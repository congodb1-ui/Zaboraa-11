# Enterprise Cloud Infrastructure Designer & Administration Architecture — Implementation Plan

This comprehensive plan covers the **4-step wizard refactoring of `DesignGeneratorPage.tsx`** together with **Section 11: Admin Authentication Fix, Feature Controls, and Blueprint Cloud Storage**.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions have been confirmed through user feedback and requirements analysis:

- **Confirmed Decision 1 (Admin Login Modal & Credentials)**: Replace the Google OAuth bypass and hardcoded passcode in `AdminLoginModal.tsx` with dedicated email/password Supabase Auth against `admin@zaboraa.com`. Role verification is validated against the Supabase `public.profiles` database record (`role === 'admin'`). Closing or cancelling the modal never grants admin privileges.
- **Confirmed Decision 2 (Feature Controls Location)**: A dedicated **Feature Controls** tab inside the `CustomizerDrawer.tsx` (only visible to verified administrators), managing four toggles: *Export Dossier*, *Export Executive Summary*, *Export 4K*, and *Generate Blueprint* (all default to `true`).
- **Confirmed Decision 3 (Blueprint Cloud Persistence)**: Every generated blueprint is saved to Supabase Storage (`generated-blueprints` bucket) and logged in a new `public.blueprints` table with authenticated owner ID, timestamp, blueprint ID, template, and prompt. If an unauthenticated user generates a blueprint, they receive the local preview and an inline prompt to sign in/register to persist to cloud storage.
- **Confirmed Decision 4 (File Scope & Safety Protocol)**: To satisfy Section 11 without unauthorized side-effects, all proposed changes are explicitly categorized below with exact target files.

---

## 1. Scope Classification & Proposed File Change List

As required by **Section 11.E**, the architecture and changes are classified across four tiers:

| Tier | Component / File | Purpose & Responsibility |
|---|---|---|
| **1. Frontend: Wizard UI** | `src/pages/tools/DesignGeneratorPage.tsx` | 4-step progressive wizard, dynamic forms, collapsed advanced accordion, blueprint preview console, and feature toggle enforcement. |
| **1. Frontend: Admin Auth** | `src/components/AdminLoginModal.tsx` | Replace Google OAuth bypass and hardcoded passcodes with secure Supabase Auth email/password login and password recovery. |
| **1. Frontend: State & Context** | `src/context/AuthContext.tsx` | Ensure `isAdmin` derives strictly from verified Supabase session and `public.profiles.role === 'admin'`. Remove insecure client fallbacks. |
| **1. Frontend: Customization** | `src/context/CustomizationContext.tsx` | Remove `zaboraa_admin_session` localStorage reliance. Add persistent `featureControls` state (`exportDossier`, `exportSummary`, `export4K`, `generateBlueprint`). |
| **1. Frontend: Customizer Drawer** | `src/components/CustomizerDrawer.tsx` | Add dedicated **Feature Controls** tab with accessible switches for the 4 toggles. |
| **2. Supabase Schema & Policies** | `supabase_schema.sql` & `supabase/migrations/20261016_blueprints_and_feature_controls.sql` | Create `public.blueprints` table, storage bucket policies (`generated-blueprints`), and persistent `public.app_settings` for feature controls. |
| **3. Backend / API Middleware** | `api/generate-blueprint.js` & `vite.config.ts` | Enforce server-side feature toggle check (reject generation with 403 if `generateBlueprint` is toggled off). |
| **4. Cloud Storage Service** | `src/services/storageService.ts` | Add `saveBlueprintToSupabase()` uploading image buffer to Supabase Storage and recording metadata in `public.blueprints`. |

---

## 2. Admin Portal Authentication Fix (Section 11.A & 11.D)

### Root Cause Analysis
1. In `AdminLoginModal.tsx`, clicking "Continue with Google" called `signInWithGoogle()`. In the preview environment, `signInWithGoogle()` fell back to a dummy profile.
2. The modal code immediately executed `setIsAdmin(true)` and `localStorage.setItem('zaboraa_admin_session', 'active')` upon popup completion or dismissal.
3. In `CustomizationContext.tsx`, `isAdmin` initialized from `localStorage.getItem('zaboraa_admin_session') === 'active'`, and `verifyAdminPasscode` accepted plain client strings (`zaboraa2026`).

### Remediation Architecture
1. **Remove Google Auth from Admin Modal**: Admin portal access will exclusively require email & password credentials through Supabase Auth (`supabase.auth.signInWithPassword`).
2. **Dedicated Administrator Account**: Uses `admin@zaboraa.com`.
3. **Server-Verified Role Check**:
   - `AuthContext` checks `supabase.from('profiles').select('role').eq('id', user.id).single()`.
   - Admin privileges are granted **only** if `data.role === 'admin'`.
   - Never rely on `localStorage`, URL query parameters, or closing dialog states.
4. **Credential Security**:
   - No hardcoded passwords in client code.
   - Built-in "Forgot Password?" triggering `supabase.auth.resetPasswordForEmail()`.
5. **Registration & Automatic Sign-In Review (Section 11.D)**:
   - Supabase default behavior: If email confirmation is disabled in Supabase dashboard, `signUp()` returns an active session immediately; if enabled, session is null until verified.
   - In both cases, the database trigger `public.handle_new_user()` assigns `role = 'user'` (only `admin@zaboraa.com` is configured as admin). Newly registered users will **never** receive administrative elevation.

---

## 3. Admin-Controlled Feature Toggles (Section 11.B)

### Toggles Specification
1. **Export Dossier** (`exportDossier`): Controls downloading complete architecture specification PDF/deck.
2. **Export Executive Summary** (`exportExecutiveSummary`): Controls 1-page executive summary generation.
3. **Export 4K** (`export4K`): Controls 4K UHD isometric blueprint diagram download.
4. **Generate Blueprint** (`generateBlueprint`): Controls AI blueprint generation and re-runs.

### Data & Enforcement Flow
- **Default State**: `{ exportDossier: true, exportExecutiveSummary: true, export4K: true, generateBlueprint: true }`.
- **Admin UI**: Dedicated **Feature Controls** tab in `CustomizerDrawer.tsx` with high-contrast toggles, accessible labels, and status badges.
- **Client Enforcement in `DesignGeneratorPage.tsx`**:
  - If a feature is disabled by admin, the corresponding button renders in a disabled state with a tooltip: *"This feature is currently disabled by enterprise administrator policy."*
- **Server Enforcement**:
  - In `api/generate-blueprint.js` and `vite.config.ts`, if `generateBlueprint` is disabled, the endpoint returns `403 Forbidden` (`{ success: false, error: "Blueprint generation is currently disabled by administrator policy." }`).

---

## 4. Blueprint Cloud Storage & Metadata (Section 11.C)

### Storage Pipeline
```
[Blueprint Generated]
       │
       ▼
[User Authenticated?]
   ├── YES ──> Convert Base64 to Blob ──> Upload to Supabase Storage:
   │                                       `generated-blueprints/${userId}/${blueprintId}.png`
   │                                       │
   │                                       ▼
   │                                   Insert Record in `public.blueprints`:
   │                                   • id (UUID)
   │                                   • user_id (UUID references auth.users)
   │                                   • template_id & primary_objective
   │                                   • image_url & storage_path
   │                                   • prompt & model
   │                                   • created_at (timestamptz)
   │
   └── NO ───> Display local browser preview + inline notice:
               "Sign in to permanently archive this blueprint to your enterprise repository."
```

### Row Level Security (RLS) on `public.blueprints`
- `SELECT`: `auth.uid() = user_id` OR `(SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'`.
- `INSERT`: `auth.uid() = user_id` with `user_id = auth.uid()`.
- `UPDATE / DELETE`: `auth.uid() = user_id` OR `(SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'`.

---

## 5. 4-Step Progressive Wizard in `DesignGeneratorPage.tsx`

1. **Step 1: Primary Objective**: 4 interactive cards (*Migration Only*, *Extend Production Data Center*, *Setup DR Infrastructure*, *Migrate & Setup DR Infrastructure*).
2. **Step 2: Template or Custom Path**:
   - Quick Templates tab (AVS, NC2 Azure, Nutanix NC2, GCVE, VMC on AWS).
   - Custom Path tab (Source Environment, Physical Topology, Native Landing Zone, Destination Datacenter).
3. **Step 3: Dynamic Form & Advanced Sizing**:
   - Sizing parameters, networking CIDRs, NVA firewalls, and DR replication SLAs.
   - **Collapsed Advanced Configuration Accordion**: oversubscription ratios, memory overheads, storage math.
4. **Step 4: Generate Blueprint & Console**:
   - Left side: Architectural summary, prompt preview, pre-flight checklist, and generation button (enforcing `featureControls.generateBlueprint`).
   - Right side: Reactive SVG topology diagram, 4K UHD download button (enforcing `featureControls.export4K`), export dossier/summary buttons (enforcing corresponding toggles).

---

## 6. Verification & Testing Plan

1. **Admin Login Security**:
   - Attempt to close modal: verify admin access is NOT granted.
   - Attempt invalid email/password: verify clear error message and no elevation.
   - Authenticate with valid admin credentials: verify `role === 'admin'` checked against database.
   - Sign in as regular user: verify admin controls remain completely locked and invisible.
2. **Feature Controls**:
   - Toggle "Export 4K" OFF in Admin Drawer: verify 4K export button in Step 4 is disabled with explanation tooltip.
   - Toggle "Generate Blueprint" OFF: verify generation trigger is disabled in UI and rejected by API endpoint.
   - Reload page: verify settings persist.
3. **Blueprint Persistence**:
   - Generate blueprint as logged-in user: verify successful upload to Supabase storage and entry in `public.blueprints`.
   - Verify upload errors display retry options without false success notices.
4. **Wizard Flow**:
   - Step through 1 -> 2 -> 3 -> 4, confirming all legacy sizing, templates, and calculations function seamlessly.
5. **Build & Lint**:
   - Run `compile_applet` and `lint_applet` to guarantee zero compilation errors.
