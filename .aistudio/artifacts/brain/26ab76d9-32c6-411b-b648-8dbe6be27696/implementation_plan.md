# Multi-Vendor Firewall Architecture, Distributed Security & Traffic-Flow Studio

An enterprise architectural specification and UI redesign for the Zaboraa Enterprise Architecture Designer. Introduces independent multi-vendor security layers (External/Perimeter Firewall, Internal/Segmentation Firewall, optional NSX Distributed Firewall, External Application Publishing including customer-configurable VAP, and Load Balancing with NSX LB / VMware Avi), an interactive 6-path traffic-flow editor, a two-column layout with a sticky Architecture Summary rail on desktop (collapsible on mobile), instant scroll-to-top on step transitions, and homepage hero whitespace compression.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Please review the core architectural decisions and design rules incorporated into this revised plan:

- **Confirmed Decision 1 (Independent Multi-Vendor Firewall Layers)**:
  - Step 4 is restructured into separate, decoupled security controls:
    1. **External / Perimeter Firewall**: Inspects north-south internet and public ingress/egress. Configured with independent vendor (*Palo Alto*, *Fortinet*, *Check Point*, *Azure Firewall*, *AWS Network Firewall*), model, HA model, and capacity.
    2. **Internal / Segmentation Firewall**: Inspects internal tier-to-tier and cross-subnet traffic. Can use a completely different vendor from the external firewall (e.g., Palo Alto perimeter with Fortinet internal segmentation).
    3. **NSX Distributed Firewall (DFW)**: Optional kernel-level microsegmentation enforced at the workload vNIC boundary, explicitly represented as distributed policy rather than a physical network hop.
    4. **External Application Publishing Platform**: Supports the customer's configurable "VAP" product (or Citrix ADC, F5 BIG-IP, Azure Application Gateway), treated as a flexible unverified product name without hardcoded assumptions.
    5. **Load Balancing Tier**: Selectable between VMware Avi (NSX Advanced Load Balancer), NSX Native Load Balancing, F5 BIG-IP, and cloud-native load balancers.
  - Each layer supports status states: `Enabled (New)`, `Existing Infrastructure`, or `Not Applicable / Disabled`.
  - Unlisted hardware or virtual models can be entered freely and tagged as `Unverified Specification` rather than inventing synthetic metrics.
- **Confirmed Decision 2 (Interactive Traffic-Flow Modeling Editor)**:
  - An interactive matrix allows architects to assign specific security controls to 6 core traffic vectors:
    1. *Internet Ingress & Egress*
    2. *Internal Application-to-Application*
    3. *East-West Workload Traffic*
    4. *Management & Shared-Services*
    5. *Hybrid / On-Premises Interconnect*
    6. *Published Application Traffic*
  - The diagram renderer consumes this flow model directly—never automatically forcing every packet through both firewalls.
- **Confirmed Decision 3 (Instant Jump to Top on Step Transition)**:
  - Clicking Next, Continue, or Back instantly snaps the viewport (`behavior: 'instant'`) to the top of the wizard container (`wizardTopRef`), ensuring the architect immediately views the title and top parameters.
- **Confirmed Decision 4 (Sticky Desktop Architecture Summary Rail & Collapsible Mobile Drawer)**:
  - Desktop layout utilizes a two-column grid (`lg:col-span-8` main parameter stage + `lg:col-span-4` sticky right rail).
  - The summary rail updates live as selections change, displaying active vendors, computed capacity, network topology, traffic-flow inspection assignments, and blocking warnings.
- **Confirmed Decision 5 (Homepage Hero Vertical Whitespace Tightening)**:
  - Tightens top padding on `src/components/Hero.tsx` from `pt-12 lg:pt-20` down to `pt-4 sm:pt-6 lg:pt-8` to eliminate the whitespace gap beneath the navigation bar.

---

### 1. Overview & Core Concept

- **What It Does**: Provides enterprise cloud architects with a multi-layered security and network design workbench. Accommodates real-world enterprise topologies where perimeter security, internal zone segmentation, distributed microsegmentation, web publishing, and load balancing are governed by distinct vendors and service-chaining rules.
- **Target Persona**: Principal Cloud Security Architects, Network Infrastructure Engineers, and Enterprise Security Directors designing hybrid VMware (AVS, NC2, GCVE, VMC) and Nutanix estates.
- **Key Value**: Delivers customer-accurate security blueprints with verified traffic-inspection paths, eliminating arbitrary vendor bundling or hallucinated double-firewall hops.

---

### 2. User Experience & Visual Design

#### Workspace Layout (Two-Column Desktop + Collapsible Mobile)
```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Quick-Start Templates: [AVS Gen 2] [NC2 Azure] [Nutanix Native] [GCVE] [VMC]│
├─────────────────────────────────────────────────────────────────────────────┤
│  Compact Stepper: [01 Objective]─[02 Source]─[03 LZ & VDI]─[04 Security]─[05 Target]
├─────────────────────────────────────────────────────────────────────────────┤
│  <div ref={wizardTopRef} />                                                 │
│  ┌──────────────────────────────────────────────┬────────────────────────┐  │
│  │ Main Parameter Stage (lg:col-span-8)         │ Architecture Summary   │  │
│  │                                              │ Rail (lg:col-span-4)   │  │
│  │  - Active Step Isolated in Viewport          │ [Sticky Top-20]        │  │
│  │  - Mandatory fields visible by default       ├────────────────────────┤  │
│  │  - Collapsible optional parameter accordions │ Live Security State:   │  │
│  │  - Step 4: 5 Separate Security Tiers         │ • Perimeter: Palo Alto │  │
│  │  - Step 4: Traffic-Flow Matrix Editor        │ • Internal: Fortinet   │  │
│  │                                              │ • NSX DFW: Active (L7) │  │
│  │  [ ← Back ]                   [ Continue → ] │ • Publisher: VAP       │  │
│  │                                              │ • Load Balancer: Avi   │  │
│  │                                              │ ────────────────────── │  │
│  │                                              │ Blockers: 0 Warnings   │  │
│  └──────────────────────────────────────────────┴────────────────────────┘  │
├─────────────────────────────────────────────────────────────────────────────┤
│  Generation Action Center (Scrolls to 3D Blueprint on Success)              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Step 4 Redesign: Multi-Vendor Security & Traffic-Flow Studio
1. **Tier 1: External / Perimeter Firewall**:
   - Status: `Enabled (New)`, `Existing External Firewall`, `Not Applicable`.
   - Conditional Fields: Vendor (*Palo Alto Networks*, *Fortinet*, *Check Point*, *Azure Firewall Premium*, *AWS Network Firewall*, *Custom / Enter Unlisted*), Model SKU (e.g. PA-3410, FortiGate 200F, or freeform unverified model), Deployment Mode (*Managed Service*, *Active/Active ECMP NVA*, *Active/Passive with Floating IP*), Inspected Throughput.
2. **Tier 2: Internal / Segmentation Firewall**:
   - Status: `Enabled (New)`, `Existing Segmentation Firewall`, `Not Applicable`.
   - Independent Vendor: Allows mixing vendors (e.g., Fortinet internal segmentation behind Palo Alto perimeter).
   - Independent Model SKU, HA mode, and placement (Dedicated transit hub vNet vs workload edge).
3. **Tier 3: NSX Distributed Firewall (DFW)**:
   - Status: `Enabled (Distributed Workload Enforcement)` vs `Disabled`.
   - Scope: Kernel-level microsegmentation, L7 Application ID inspection, Distributed IDS/IPS, FQDN filtering.
   - Visual Treatment: Illustrated as policy perimeters wrapped directly around workload pods, not as an in-line physical gateway.
4. **Tier 4: External Application Publishing (VAP / Reverse Proxy)**:
   - Status: `Enabled` vs `Disabled`.
   - Product Selection: Configurable text/select input defaulting to customer's `"VAP Platform"` with options for *Citrix ADC (NetScaler)*, *F5 BIG-IP APM*, *Azure Application Gateway*, *Cloudflare Access*. Tagged as unverified if custom.
   - Publishing Mode: Reverse Proxy, SSL Offloading, SAML/OIDC Pre-authentication.
5. **Tier 5: Load Balancing Tier**:
   - Status: `Enabled` vs `Disabled`.
   - Engine: *VMware Avi (NSX Advanced Load Balancer)*, *NSX Native Load Balancer (Tier-1)*, *F5 BIG-IP LTM*, *Cloud-Native Load Balancer (Azure ALB / AWS ALB)*.
   - Service Chaining: Option to consolidate with the Application Publishing tier if the same product is used (e.g. F5 BIG-IP performing both VAP and LTM).
6. **Traffic-Flow Matrix Editor**:
   - Clean, compact configuration grid mapping which tier inspects which vector:
     | Traffic Vector | Primary Inspection Control | Secondary Inspection | Bypass / Direct |
     | :--- | :--- | :--- | :--- |
     | **Internet Ingress** | External Perimeter Firewall | App Publisher (VAP) | No |
     | **Internet Egress** | External Perimeter Firewall | — | No |
     | **East-West Workload** | NSX Distributed Firewall | Internal Segmentation FW | Workload vNet |
     | **App-to-App Tier** | Internal Segmentation Firewall | NSX DFW | Subnet Peering |
     | **Hybrid / On-Prem** | Internal Segmentation Firewall | — | Dedicated Circuit |
     | **Published Apps** | App Publisher (VAP) | Load Balancer (Avi) | External Ingress |

---

### 3. Architecture Blueprint & 4K Schematic Synthesis

The 3D Gemini blueprint prompt and 2D vector schematic will consume the concrete security and flow model:
- **Perimeter Tube**: Drawn from the Internet gateway through the External Firewall into the DMZ / Transit Hub.
- **Internal Transit Tube**: Connects the Transit Hub to the SDDC compute clusters through the Internal Firewall only when internal inspection is active.
- **Distributed Shield Nodes**: NSX DFW is rendered as holographic shield auras encompassing VM workload clusters rather than a blocking middlebox.
- **Publishing & Ingress Pods**: Renders the Application Publishing tier (e.g. VAP) and Load Balancer (e.g. Avi) as distinct front-end gateway nodes before passing traffic to backend workload pools.
- **Validation Engine**: Flags anomalies (e.g., Published application traffic enabled without an ingress firewall or publisher; NSX DFW enabled on non-NSX bare metal).

---

### 4. Technical Architecture & File Updates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           WizardState Data Model                            │
├─────────────────────────────────────────────────────────────────────────────┤
│  wizardState.securityConfig:                                                │
│   ├── perimeterFirewall: { enabled, status, vendor, model, haMode, isCustom}│
│   ├── internalFirewall:  { enabled, status, vendor, model, haMode, isCustom}│
│   ├── nsxDistributedFirewall: { enabled, idsIpsEnabled, l7AppIdEnabled }    │
│   ├── appPublishing:     { enabled, productName, mode, isCustomProduct }    │
│   ├── loadBalancing:     { enabled, platform, consolidatedWithPublishing }  │
│   └── trafficFlows:                                                         │
│        ├── internetIngress: ['perimeter', 'publishing']                     │
│        ├── internetEgress:  ['perimeter']                                   │
│        ├── eastWest:        ['nsx-dfw']                                     │
│        ├── internalAppToApp:['internal-fw', 'nsx-dfw']                      │
│        ├── hybridTransit:   ['internal-fw']                                 │
│        └── publishedTraffic:['publishing', 'load-balancer']                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Detailed File Modifications:
1. `src/types/wizardStateAdapter.ts`:
   - Extend `WizardState` with decoupled `perimeterFirewall`, `internalFirewall`, `nsxDistributedFirewall`, `appPublishing`, `loadBalancing`, and `trafficFlows`.
   - Update default factory and legacy state mapping to guarantee backwards compatibility.
2. `src/utils/architectureCompatibilityRules.ts`:
   - Add catalog of verified firewall models for Palo Alto, Fortinet, Check Point, Cisco, and cloud-native firewalls.
   - Add compatibility checks for NSX LB vs Avi Networks and external publishing platforms.
   - Add traffic flow path validation (e.g., verifying that internet-bound traffic passes through an active firewall).
3. `src/components/wizard/Step4SecurityAndWAF.tsx`:
   - Redesign into 5 collapsible tier panels (Perimeter FW, Internal FW, NSX DFW, App Publishing VAP, Load Balancing) with progressive disclosure.
   - Add the Traffic-Flow Matrix Editor with intuitive dropdowns.
4. `src/components/wizard/ArchitectureSummaryRail.tsx`:
   - Display real-time security posture: Perimeter Vendor, Internal Vendor, DFW status, Publisher name, and Load Balancer engine.
   - Display live capacity metrics (vCPU, RAM, storage) and unresolved blockers.
5. `src/pages/tools/DesignGeneratorPage.tsx`:
   - Integrate `wizardTopRef` with `behavior: 'instant'` on step transitions.
   - Mount `ArchitectureSummaryRail` in a 2-column grid (`lg:col-span-8` + `lg:col-span-4`).
   - Feed decoupled firewall tiers and traffic paths into `buildIsometricDiagramPrompt` and 4K vector visual spec.
6. `src/components/Hero.tsx`:
   - Reduce top padding from `pt-12 lg:pt-20` down to `pt-4 sm:pt-6 lg:pt-8`.
7. `src/tests/wizardAndCompatibility.test.ts`:
   - Add comprehensive tests for independent perimeter/internal firewall vendors, NSX DFW toggles, VAP publishing, Avi vs NSX LB, and traffic-flow path validation.

---

### 5. Verification & Test Plan

1. **Multi-Vendor Firewall Tests**:
   - Verify Perimeter Firewall set to Palo Alto while Internal Firewall set to Fortinet.
   - Verify Perimeter Firewall enabled while Internal is disabled, and vice versa.
   - Verify unlisted/custom firewall models preserve `isCustom: true` and are flagged as unverified without crashing.
2. **NSX DFW & App Publishing Tests**:
   - Verify NSX DFW enabled adds distributed policy tags without adding a physical hop in the interconnect link table.
   - Verify customer's configurable VAP product name is persisted and rendered in the manifest.
   - Verify NSX LB and VMware Avi options render appropriate compatible target pairings.
3. **Traffic-Flow Validation Tests**:
   - Verify traffic-flow editor assignments correctly guide the prompt and schematic synthesis.
   - Verify validation errors when internet ingress is active without any perimeter firewall or publishing gateway.
4. **Navigation & UI Ergonomics**:
   - Verify clicking Next/Continue instantly jumps to `wizardTopRef` at the top of the container.
   - Verify sticky summary rail updates immediately upon selecting security options.
   - Verify homepage hero section has no excessive empty whitespace beneath the navbar.
5. **Automated Suite**:
   - Execute `npm test -- --run` to confirm all existing and new tests pass.
   - Execute `tsc --noEmit` and `npm run build` to verify clean compilation.
