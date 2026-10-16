# Enterprise Cloud Blueprint Generator Refactor & Admin Control Studio

Comprehensive engineering blueprint to refactor `DesignGeneratorPage.tsx` and wizard subsystems into a true step-by-step sequential workflow, enforce strict vendor filtering across the 5 core cloud templates, provide instant post-generation navigation to a full-width 3D blueprint viewport, eliminate excessive homepage spacing, and establish an Admin Parameter Control Studio.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned during the interactive interview phase and will be strictly executed:

- **Confirmed Decision 1 (Admin Storage)**: Admin template definitions and parameter mandatory/optional settings persist to browser `localStorage` under `zaboraa_admin_param_controls` with an instant 1-click **Reset to System Defaults** mechanism.
- **Confirmed Decision 2 (Vendor Filtering & Parameter Purging)**: When switching between templates (e.g. selecting AVS), incompatible cross-vendor parameters (AWS, GCP, Nutanix) are automatically purged from state, and Step 3 components dynamically filter to only certified options for the chosen hyperscaler.
- **Confirmed Decision 3 (Post-Generation Viewport)**: Upon clicking **"Generate Blueprint"**, the application immediately scrolls to the top (`window.scrollTo({ top: 0, behavior: 'smooth' })`) and transitions into a full-width blueprint presentation with step breadcrumbs and instant zoom/export controls.
- **Confirmed Credentials**: Default administrator authentication hardcoded for offline and local preview environments: `admin@zaboraa.com` with password `Zaboraa@123!`.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the blueprint generation experience from a long multi-scroll page into an elegant, focused 4-step progressive wizard where **only the current active step is visible**. Guides architects from scope definition to template selection, vendor-filtered component customization, and immediate full-width 3D isometric cloud blueprint generation. Empowers administrators via the Customizer Drawer to toggle parameters as mandatory vs. optional and manage enterprise templates.
- **Target Audience / Persona**: Lead Cloud Architects, Enterprise Infrastructure Engineers, Pre-Sales Systems Engineers, and Platform Administrators designing multi-cloud migrations and disaster recovery topologies.
- **Key Value**: Eliminates cognitive overload and layout fatigue, prevents invalid cross-vendor architectural configurations (e.g., Azure NetApp Files on AWS), streamlines client presentations, and provides governance over required architectural inputs.

---

## 2. User Experience & Visual Design

### Key User Flows

```
[ Step 1: Select Objective ]
       │ (Next / Continue)
       ▼
[ Step 2: Select Template (5 Core Cards) ]
       │ (Auto-purges incompatible vendor settings)
       │ (Next / Continue)
       ▼
[ Step 3: Infrastructure Components ]
       │ (Strictly filtered dropdowns & checkboxes)
       │ (Next / Continue)
       ▼
[ Step 4: Review & Generate ]
       │
       ▼ (Click "Generate Blueprint")
[ Instant Scroll-to-Top (window.scrollTo({ top: 0, behavior: 'smooth' })) ]
       │
       ▼
[ Full-Width 3D Isometric Blueprint Viewport with Step Breadcrumbs & Export Center ]
```

### Visual Identity & Theme
- **Theme Palette**: Deep dark enterprise canvas (`#020617` / `slate-950`), muted slate card surfaces (`#0f172a` / `slate-900`), border accents (`slate-800`), glowing neon status highlights (`cyan-400`, `emerald-400`, `indigo-400`).
- **Typography & Rhythm**: Sharp, high-contrast monospace metadata kickers (`text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400`), clean tabular numbers, tight vertical padding on headings.
- **Reduced Layout Spacing**:
  - `Hero.tsx`: Reduced vertical padding from `pt-12 pb-20 lg:pt-20 lg:pb-28` to `pt-8 pb-12 lg:pt-12 lg:pb-16`.
  - `HomePage.tsx`: Reduced inter-section gap from `space-y-16` to `space-y-8`.
  - `DesignGeneratorPage.tsx`: Container padding tightened from `py-12 space-y-10` to `py-6 space-y-6`.
- **Step Transitions**: Subtle fade and slide-in motion between steps (`animate-in fade-in duration-200`). At any given moment, exactly **one** step container is mounted/visible in the wizard body.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Single-Step DOM Rendering vs. Collapsible Accordions**
  - *Chosen Approach*: Strictly render only `currentStep === stepNumber` in the main workspace. Manifests, vector previews, and other step bodies are completely hidden unless navigated to.
  - *Why*: Eliminates the "massive single-page scroll dump", ensuring the user stays focused on making high-quality sizing and component choices without 3,000 pixels of vertical scrolling.
  - *Alternatives Considered*: Accordions were considered, but still lead to accordion-sprawl and visual noise on smaller viewports.

- **Decision 2: Strict Hyperscaler Compatibility Matrix**
  - *Chosen Approach*: Derive a reactive compatibility filter based on `wizardState.templateChoice`. When `vmware-to-avs` is selected, interconnect options display Azure ExpressRoute; security displays Azure Firewall / Palo Alto; cloud-native services display Azure vNet Peering, AKS, Azure SQL, Blob Storage; storage displays ANF and Azure Elastic SAN; VDI displays AVD, Horizon Cloud, Citrix DaaS. Cross-vendor selections for AWS, GCP, and Nutanix are filtered out.
  - *Why*: Prevents architects from generating impossible or unsupported topologies.

- **Decision 3: Admin Parameter Control Studio in Customizer Drawer**
  - *Chosen Approach*: Add a new tab `Architecture Parameters & Templates` in `CustomizerDrawer.tsx` accessible only to authenticated admins. Lets admins customize default templates and toggle fields (e.g. `sddcMgmtCidr`, `decoupledStorageTB`, `drEngine`, `vdiConfig`) between `Optional` and `Mandatory`.
  - *Why*: Provides governance without altering backend schemas, stored in `localStorage` with a fail-safe reset button.

---

## 4. Technical Architecture & Data Strategy

### System & State Flow Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DesignGeneratorPage.tsx                         │
│                                                                        │
│  State: currentStep (1 | 2 | 3 | 4)                                    │
│  State: wizardState (WizardState with vendor-aware fields)             │
│  State: aiBlueprintResult (Generated 3D asset or base64)               │
│  State: showGeneratedView (boolean)                                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
        ┌───────────────────────────┴───────────────────────────┐
        ▼                                                       ▼
┌───────────────────────────────────┐   ┌────────────────────────────────┐
│   WizardStepTabs Navigation       │   │ Generated Blueprint Viewport   │
│   (Step 1 → Step 2 → 3 → 4)       │   │ (Visible in Step 4 / Generated)│
└───────────────┬───────────────────┘   │ - Full-width 3D Canvas         │
                │                       │ - Zoom / Pan / Fullscreen      │
                ▼                       │ - PNG / Excel / JSON Export    │
┌───────────────────────────────────┐   └────────────────────────────────┘
│ ONLY ONE Active Step Visible:     │
│                                   │
│ [Step 1: Select Objective]        │
│   ↓ (Back / Continue)             │
│ [Step 2: Select Template (5 Core)]│
│   ↓ (Purge incompatible vars)     │
│ [Step 3: Filtered Components]     │
│   - Interconnect (Vendor Filtered)│
│   - Security & NVA (Filtered)     │
│   - Cloud-Native (Filtered)       │
│   - VDI Services (Filtered)       │
│   - DR (Filtered by Objective)    │
│   - Advanced Config (Collapsed)   │
│   ↓ (Back / Continue)             │
│ [Step 4: Generate Blueprint]      │
│   - Click "Generate Blueprint"    │
│   - window.scrollTo({top: 0})     │
└───────────────────────────────────┘
```

### The 5 Core Templates Matrix

| Template Key | Title | Hyperscaler | Target Tech | Interconnect | Storage |
|---|---|---|---|---|---|
| `vmware-to-avs` | VMware to AVS | Microsoft Azure | Azure VMware Solution Gen 2 (AV64/AV36P) | ExpressRoute FastPath | Azure NetApp Files / Elastic SAN |
| `vmware-to-nc2` | VMware to NC2 on Azure | Microsoft Azure | Nutanix NC2 on Azure Bare-Metal (AN36P) | ExpressRoute with Flow VPC | Nutanix DSF |
| `nutanix-to-nc2` | Nutanix to NC2 on Azure | Microsoft Azure | Nutanix NC2 Bare-Metal (Prism Central) | ExpressRoute Direct Peering | Nutanix AOS DSF |
| `vmware-to-gcve` | VMware to GCVE | Google Cloud | Google Cloud VMware Engine (ve1-standard-72) | Dedicated Interconnect (10G) | Google Cloud NetApp Volumes (GCNV) |
| `vmware-to-vmc` | VMware to VMC on AWS | Amazon Web Services | VMware Cloud on AWS (i4i.metal) | AWS Direct Connect Gateway | Amazon FSx for NetApp ONTAP |

---

## 5. Verification & Validation Plan

1. **Wizard Step Isolation**: Verify in DOM that when `currentStep === 1`, Steps 2, 3, and 4 and their respective containers are not rendered or visible.
2. **Post-Generation Scroll**: Verify that clicking "Generate Blueprint" immediately invokes `window.scrollTo({ top: 0, behavior: 'smooth' })` and presents the full-width generated 3D visual.
3. **Vendor Filtering**: Select `vmware-to-avs` and confirm that Step 3 only presents Azure interconnects, Azure security NVAs, Azure cloud-native services, and certified storage. Repeat for `vmware-to-gcve` and `vmware-to-vmc`.
4. **Admin Authentication**: Verify login with `admin@zaboraa.com` and `Zaboraa@123!`. Open the Customizer Drawer, inspect the new Parameter Control Studio, toggle parameters, and test the "Reset to Defaults" button.
5. **Layout Spacing**: Confirm reduced vertical margins across Hero, HomePage, and workbench pages.
6. **Regression Tests**: Run `npm test`, `npx tsx scripts/verify-wizard-calculations.ts`, `npx tsx scripts/verify-data-integrity.ts`, and `npm run build` to ensure zero regressions.
