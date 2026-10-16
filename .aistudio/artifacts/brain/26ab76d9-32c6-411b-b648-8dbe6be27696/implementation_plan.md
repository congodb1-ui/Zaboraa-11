# Zaboraa Enterprise Design Generator — Architecture-Aware Blueprint Studio

A comprehensive overhaul of the Zaboraa Design Generator wizard, visual blueprint renderer, and administrative parameter controls. This implements a true step-by-step 5-stage architecture wizard with strict step isolation, robust Back/Continue navigation with state preservation, dynamic compatibility-driven vendor filtering, scroll-on-success viewport navigation, and a hardened Supabase Auth administrative governance model with all hardcoded credentials eliminated.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The implementation plan has been revised based on your instructions. Please review the confirmed architectural decisions below:

- **Confirmed Decision 1 (Admin Security Hardening & Zero Hardcoded Credentials)**:
  - Completely remove the hardcoded credentials display and autofill buttons (`admin@zaboraa.com` / `Zaboraa@123!`) from `AdminLoginModal.tsx`.
  - Admin access will be authenticated exclusively via Supabase Auth (`supabase.auth.signInWithPassword`), with server-side / database profile verification (`profiles.role === 'admin'`) and RLS authorization.
  - An idempotent SQL migration script will securely register and provision `admin@zaboraa.com` with the `admin` role in `public.profiles`.
- **Confirmed Decision 2 (Scroll-on-Success Navigation)**:
  - Generation trigger will **not** scroll immediately upon clicking "Generate 3D Blueprint".
  - The viewport stays focused on the generation progress bar during processing.
  - Only upon **successful generation confirmation** (`res.success === true` and image data received) will the page smoothly scroll to the rendered 3D Blueprint at the top of the canvas viewport on both desktop and mobile.
- **Confirmed Decision 3 (True 5-Step Architecture Wizard)**:
  - Strict step-by-step presentation (only the current active step is rendered in the DOM; steps 1–5 are never stacked together).
  - Clean Back and Continue navigation buttons with field validation for required parameters.
  - Advanced configuration panels default to collapsed accordions to keep the interface focused and scannable.
- **Confirmed Decision 4 (8 Quick-Start Templates & 5 Core Hyperscalers)**:
  - Exact templates: `VMware to AVS`, `VMware to NC2 on Azure`, `Nutanix to NC2 on Azure`, `VMware to GCVE`, `VMware to VMC on AWS`, plus `Hybrid Extension`, `Migration + DR`, and `Multi-cloud`.
- **Confirmed Decision 5 (Compatibility-Driven Vendor Filtering & Stale State Clearing)**:
  - Selection of a target platform or cloud template strictly filters incompatible services (e.g. AWS Transit Gateway is hidden/disabled for Azure AVS; HCX is hidden for pure Nutanix-to-Nutanix; Azure NetApp Files is scoped to Azure targets).
  - Incompatible stale options are automatically cleared upon template or platform changes, with user feedback.
- **Confirmed Decision 6 (Spacing & Layout Density Optimization)**:
  - Compress excessive padding (reduce 80px/64px gaps to compact 24px–32px section spacing, tighten form field margins from `mb-6` to `mb-3`) without disrupting responsive touch targets.

---

### 1. Overview & Core Concept

- **What It Does**: An enterprise cloud architecture workbench that guides solution architects through 5 structured stages to define their target cloud posture, automatically enforces vendor compatibility rules, and renders a photorealistic 3D architecture blueprint and 4K vector schematic illustrating only the selected components and verified network interconnects.
- **Target Audience / Persona**: Lead Cloud Architects, Principal Infrastructure Engineers, and Enterprise IT Directors planning VMware and Nutanix migrations across Azure, AWS, and Google Cloud.
- **Key Value**: Delivers accurate, boardroom-ready architecture schematics and Bills of Materials (BOM) in minutes, ensuring zero incompatible or hallucinated network connections.

---

### 2. User Experience & Visual Design

#### True 5-Stage Wizard Workflow
Each stage is displayed in isolation with an indicator bar showing completion status, estimated time, and active breadcrumb:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Quick-Start Templates: [VMware→AVS] [VMware→NC2] [Nutanix→NC2] [GCVE] [VMC] │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Step 1: Objective] ── [Step 2: Source] ── [Step 3: Landing Zone & VDI]    │
│                     ── [Step 4: Security & WAF] ── [Step 5: Target & DR]    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                     CURRENT ACTIVE STEP VIEWPORT ONLY                       │
│                                                                             │
│  [Required Fields]                                                          │
│  ▸ Advanced Parameters (Collapsed Accordion)                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [ ← Back ]                                                 [ Continue → ]  │
└─────────────────────────────────────────────────────────────────────────────┘
```

1. **Step 1 — Architectural Objective**:
   - Required: Architecture Objective (*Migration Only*, *Extend Production*, *Setup DR*, *Migrate & Setup DR*), Deployment Scope (*Single Cloud*, *Hybrid*, *Multi-Cloud*).
   - Collapsed/Optional: Migration Strategy (*Rehost*, *Replatform*, *Modernize*), Workload Criticality, Downtime Tolerance.
2. **Step 2 — Existing / Source Infrastructure**:
   - Required: Source Provider (*On-Premises*, *Azure*, *AWS*, *GCP*), Source Platform (*VMware vSphere*, *Nutanix AOS/AHV*, *Hyper-V*, *Bare Metal*), Site Count, Management CIDR.
   - Conditional: Hypervisor Version, VM Count, Storage/Compute inventory, Existing L2 Extension.
3. **Step 3 — Landing Zone, Cloud-Native Services & VDI**:
   - Part A (Landing Zone Foundation): Target Provider, Region, Network Topology (*Virtual WAN*, *Transit Gateway*, *Hub-and-Spoke*), SDDC Management CIDR.
   - Part B (Cloud-Native Services): Categorized independent toggles (Azure NetApp Files, FSx ONTAP, Google NetApp Volumes, Private Link, Native SQL).
   - Part C (VDI Services): Optional VDI toggle (*Azure Virtual Desktop*, *Citrix DaaS*, *Horizon Cloud*), user concurrency sizing.
4. **Step 4 — Security, Firewalls, WAF & NVA**:
   - Part A (Firewall Topology): Central Hub vs Distributed, NVA Vendor (*Azure Firewall*, *Palo Alto Networks*, *Fortinet FortiGate*, *AWS Network Firewall*), Traffic Inspection Mode (North-South, East-West).
   - Part B (WAF): Managed Web Application Firewall, DDoS Protection level.
5. **Step 5 — Target Infrastructure, Production/DR & Migration Tools**:
   - Part A (Target SDDC): Target Platform (*AVS*, *NC2 on Azure*, *GCVE*, *VMC on AWS*), Node Class/SKU, Cluster Node Count, Storage Attachment.
   - Part B (Production & DR): DR Engine (*VMware SRM*, *Nutanix Leap/Metro*, *Azure Site Recovery*, *Zerto*), RPO/RTO validation.
   - Part C (Migration Tools): Scenario-matched migration engine (*VMware HCX*, *Nutanix Move*, *Azure Migrate*).
   - Part D (Layer 2 Interconnect): Dedicated Interconnect type (*ExpressRoute*, *DirectConnect*, *Cloud Interconnect*, *IPsec VPN*), bandwidth sizing, optional HCX Network Extension toggle.

#### Generation Telemetry & Post-Generation Scroll
- When the user clicks **Generate 3D Blueprint**, the wizard enters an in-place loading state with real-time progress phases:
  - `Phase 1 (0-25%)`: Validating multi-tier CIDRs and interconnect paths.
  - `Phase 2 (25-60%)`: Synthesizing architecture-grounded prompt (zero hallucinated connections).
  - `Phase 3 (60-90%)`: Calling server-side Gemini API for 3D isometric rendering.
  - `Phase 4 (90-100%)`: Assembling architectural legend and BOM manifest.
- **Scroll Execution**: Upon `res.success === true`, `window.scrollTo({ top: blueprintCanvasOffset, behavior: 'smooth' })` smoothly brings the newly rendered 3D Blueprint and export dock into full view.

---

### 3. Compatibility Rules & Vendor Filtering Matrix

A centralized rules catalog (`src/utils/architectureCompatibilityRules.ts`) enforces valid combinations and automatically sanitizes stale state:

| Target Platform | Allowed Migration Tools | Compatible Storage | Compatible NVA / Firewalls | Compatible Interconnect |
| :--- | :--- | :--- | :--- | :--- |
| **Azure AVS** | VMware HCX, Azure Migrate | Azure NetApp Files, Managed Disks | Azure Firewall, Palo Alto, Fortinet | ExpressRoute, Azure vWAN, Global Reach |
| **Nutanix NC2 on Azure** | Nutanix Move, Leap, Commvault | Native Nutanix DSF, Azure Blob | Azure Firewall, Fortinet, Palo Alto | Azure ExpressRoute, Azure VNet Peering |
| **Google Cloud GCVE** | VMware HCX, G/C Migrate | Google Cloud NetApp Volumes | Cloud Firewall, Palo Alto VM-Series | Dedicated Interconnect, Partner Interconnect |
| **AWS VMC** | VMware HCX, AWS MGN | AWS FSx for NetApp ONTAP | AWS Network Firewall, Fortinet | Direct Connect, AWS Transit Gateway |

- **Stale Value Clearing**: When switching from `VMware to AVS` to `Nutanix to NC2 on Azure`, HCX is cleared and replaced with `Nutanix Move`; Azure NetApp Files is cleared if migrating to AWS VMC; any incompatible CIDR or attachment is flagged with an inline dismissal banner.

---

### 4. Admin Parameter Control Studio & Security Architecture

#### Security Hardening (Zero Hardcoded Credentials)
- **Delete Hardcoded Admin Credentials**: Remove default credential text and autofill buttons from `AdminLoginModal.tsx`.
- **Supabase Authentication**:
  - Sign-in relies entirely on `supabase.auth.signInWithPassword({ email, password })`.
  - Database-backed role checks:
    ```sql
    -- Provision dedicated admin user
    UPDATE public.profiles
    SET role = 'admin', subscription_tier = 'enterprise'
    WHERE email = 'admin@zaboraa.com';
    ```
  - Client state checks verify session JWT against Supabase Auth before unlocking customizer controls.

#### Admin Parameter Studio Features
- Located in the Customizer Drawer under the **Parameter Studio** tab:
  - Toggle required/optional/conditional status for any wizard field.
  - Enable/disable individual templates or cloud destinations.
  - Persist modifications to Supabase table `admin_parameter_controls` with fallback to versioned local storage.
  - "Reset to Factory Defaults" button to restore canonical architecture definitions.

---

### 5. Technical Architecture & File Modifications

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DesignGeneratorPage.tsx                          │
├─────────────────────────────────────────────────────────────────────────────┤
│  Quick-Start Template Selector (8 Cards)                                    │
│  WizardStepTabs (Steps 1 through 5)                                         │
│                                                                             │
│  [Step 1: Objective]       (components/wizard/Step1SelectObjective.tsx)     │
│  [Step 2: Source]          (components/wizard/Step2SourceInfrastructure.tsx)│
│  [Step 3: Landing Zone]    (components/wizard/Step3LandingZoneAndVDI.tsx)   │
│  [Step 4: Security & WAF]  (components/wizard/Step4SecurityAndWAF.tsx)      │
│  [Step 5: Target & DR]     (components/wizard/Step5TargetAndDR.tsx)         │
│                                                                             │
│  Generation Action Center  (components/wizard/BlueprintStudioViewport.tsx)  │
│    - Smooth scroll target ref                                               │
│    - Dual-Mode: 3D Isometric View + 4K Vector Schematic                     │
│    - Session revision history strip                                         │
│    - Export Hub: 4K PNG, BOM Excel, Topology JSON, Executive PDF            │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Core Files to Update:
1. `src/components/AdminLoginModal.tsx`: Strip all hardcoded credentials and autofill buttons; reinforce authentic Supabase Auth with server-side role validation.
2. `src/pages/tools/DesignGeneratorPage.tsx`: Implement true step isolation (1 to 5), smooth scroll strictly after generation success, spacing compression, and integration with the parameter catalogue.
3. `src/components/wizard/`:
   - `Step1SelectObjective.tsx`: Objective, scope, and criticality.
   - `Step2SourceInfrastructure.tsx`: Source hypervisor, version, host count, and management CIDR.
   - `Step3LandingZoneAndVDI.tsx`: Cloud foundation, regional services, and VDI options.
   - `Step4SecurityAndWAF.tsx`: NVA firewall placement, WAF, and traffic inspection.
   - `Step5TargetAndDR.tsx`: Target SDDC, sizing, HCX/Move migration tools, and L2 interconnect.
   - `BlueprintStudioViewport.tsx`: High-resolution canvas with zoom/pan, layer badges, and scroll-to anchor.
4. `src/utils/architectureCompatibilityRules.ts`: Shared compatibility validation and stale selection clearing functions.
5. `src/utils/adminParameterControls.ts`: Persisted admin controls for mandatory/optional fields and template publishing.
6. `src/tests/architectureCalculations.test.ts`: Automated regression tests for vendor filtering, template loading, and calculations.

---

### 6. Verification & Test Plan

1. **Step Isolation & Navigation Verification**:
   - Verify only the current step is visible.
   - Verify Back and Continue buttons preserve all user inputs and prevent advancing when required fields are empty.
2. **Scroll-on-Success Verification**:
   - Verify that clicking "Generate 3D Blueprint" does **not** prematurely scroll down.
   - Verify that upon API response success, the viewport smoothly scrolls to the rendered 3D Blueprint on desktop and mobile.
3. **Vendor Filtering & Stale State Clearing**:
   - Test switching from `VMware to AVS` to `Nutanix to NC2 on Azure`: verify HCX and ANF are cleared and replaced with compatible Nutanix Move and Azure Blob options.
   - Test AWS VMC template: verify AWS Transit Gateway and FSx ONTAP appear, while Azure-only services remain excluded.
4. **Admin Security & Authentication Verification**:
   - Verify zero hardcoded passwords or emails appear in `AdminLoginModal.tsx`.
   - Verify sign-in requires valid Supabase credentials and rejects non-admin users.
5. **Layout Spacing Verification**:
   - Inspect container heights and padding across mobile (375px), tablet (768px), and desktop (1440px) to confirm reduced whitespace and zero horizontal overflow.
6. **Automated Vitest Suite**: Run `npm test` to confirm all architecture calculations and compatibility rules pass cleanly.
