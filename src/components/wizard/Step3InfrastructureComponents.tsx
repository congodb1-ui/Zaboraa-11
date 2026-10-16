import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Network,
  Shield,
  Cloud,
  Monitor,
  ShieldCheck,
  HardDrive,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info,
  Server,
  Layers,
  Database,
  Lock,
  Cpu
} from 'lucide-react';
import { WizardState } from '../../types/wizardStateAdapter';

interface Step3InfrastructureComponentsProps {
  wizardState: WizardState;
  onChange: (updater: (prev: WizardState) => WizardState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3InfrastructureComponents: React.FC<Step3InfrastructureComponentsProps> = ({
  wizardState,
  onChange,
  onNext,
  onPrev
}) => {
  // Advanced Configuration is COLLAPSED by default
  const [showAdvancedConfig, setShowAdvancedConfig] = useState<boolean>(false);

  // Helper toggle functions
  const toggleSection = (section: 'interconnect' | 'security' | 'cloudNative' | 'vdi' | 'dr' | 'other') => {
    onChange((prev) => {
      switch (section) {
        case 'interconnect':
          return { ...prev, interconnectEnabled: !prev.interconnectEnabled };
        case 'security':
          return { ...prev, securityNvaEnabled: !prev.securityNvaEnabled };
        case 'cloudNative':
          return { ...prev, cloudNativeEnabled: !prev.cloudNativeEnabled };
        case 'vdi':
          return { ...prev, vdiEnabled: !prev.vdiEnabled };
        case 'dr':
          return { ...prev, drEnabled: !prev.drEnabled };
        case 'other':
          return { ...prev, otherServicesEnabled: !prev.otherServicesEnabled };
      }
    });
  };

  const handleCloudNativeServiceToggle = (service: string) => {
    onChange((prev) => {
      const current = prev.cloudNativeConfig.selectedServices || [];
      const updated = current.includes(service)
        ? current.filter((s) => s !== service)
        : [...current, service];
      return {
        ...prev,
        cloudNativeConfig: {
          ...prev.cloudNativeConfig,
          selectedServices: updated
        }
      };
    });
  };

  const template = wizardState.templateChoice || 'vmware-to-avs';
  const isAzure = template === 'vmware-to-avs' || template === 'vmware-to-nc2' || template === 'nutanix-to-nc2';
  const isAws = template === 'vmware-to-vmc';
  const isGcp = template === 'vmware-to-gcve';
  const isNutanix = template === 'vmware-to-nc2' || template === 'nutanix-to-nc2';

  const cloudNativeOptions = React.useMemo(() => {
    if (isAws) {
      return [
        { id: 'tgw', label: 'AWS Transit Gateway (TGW) & Connected VPC', desc: 'Direct line-rate ENI backbone routing to AWS native VPC' },
        { id: 'eks', label: 'Amazon Elastic Kubernetes Service (EKS)', desc: 'Containerized microservices running adjacent to bare-metal VMC SDDC' },
        { id: 'db', label: 'Amazon Aurora PostgreSQL / RDS', desc: 'Managed high-availability relational data tier with Multi-AZ' },
        { id: 'storage', label: 'Amazon S3 Object Storage & Glacier', desc: 'Scalable immutable data lakes and long-term archive tiers' },
        { id: 'privatelink', label: 'AWS PrivateLink & Interface Endpoints', desc: 'Secure non-internet routing to AWS PaaS endpoints' },
        { id: 'identity', label: 'AWS KMS & IAM Identity Center', desc: 'Enterprise RBAC, Single Sign-On, and KMS encryption keys' }
      ];
    }
    if (isGcp) {
      return [
        { id: 'shared-vpc', label: 'Google Cloud Shared VPC & NCC', desc: 'Network Connectivity Center hub routing directly into GCVE SDDC' },
        { id: 'gke', label: 'Google Kubernetes Engine (GKE)', desc: 'Containerized microservices running adjacent to bare-metal GCVE SDDC' },
        { id: 'db', label: 'Google Cloud SQL Managed Instance', desc: 'Managed high-availability transactional data tier with Cloud SQL' },
        { id: 'storage', label: 'Google Cloud Storage (GCS)', desc: 'Scalable immutable data lakes and long-term archive tiers' },
        { id: 'analytics', label: 'BigQuery & Vertex AI Analytics', desc: 'Direct line-rate analytical query pipelines on production data' },
        { id: 'identity', label: 'Google Cloud KMS & Cloud IAM', desc: 'Enterprise RBAC, Cloud IAM, and Cloud HSM keys' }
      ];
    }
    if (isNutanix) {
      return [
        { id: 'flow-vpc', label: 'Nutanix Flow Virtual Networking (VPC)', desc: 'Software-defined overlay network integrated with Azure native subnets' },
        { id: 'vnet-peering', label: 'Azure Virtual Network Peering & Transit', desc: 'Direct low-latency backbone routing to Azure native landing zone' },
        { id: 'storage', label: 'Azure Storage Accounts & Blob Data', desc: 'Scalable immutable data lakes and long-term archive tiers' },
        { id: 'privatelink', label: 'Azure Private Link / Private Endpoints', desc: 'Secure non-internet routing to PaaS endpoints' },
        { id: 'identity', label: 'Microsoft Entra ID & Key Vault', desc: 'Enterprise RBAC, Single Sign-On, and Hardware Security Module keys' }
      ];
    }
    // Default Azure AVS
    return [
      { id: 'vnet-peering', label: 'Azure Virtual Network Peering & Transit', desc: 'Direct low-latency backbone routing to Azure native landing zone' },
      { id: 'k8s', label: 'Managed Azure Kubernetes (AKS)', desc: 'Containerized microservices running adjacent to bare-metal SDDC' },
      { id: 'db', label: 'Azure SQL Managed Instance', desc: 'Managed high-availability transactional data tier' },
      { id: 'storage', label: 'Azure Storage Accounts & Blob Data', desc: 'Scalable immutable data lakes and long-term archive tiers' },
      { id: 'privatelink', label: 'Azure Private Link & Private Endpoints', desc: 'Secure non-internet routing to PaaS endpoints' },
      { id: 'identity', label: 'Microsoft Entra ID & Azure Key Vault', desc: 'Enterprise RBAC, Single Sign-On, and Hardware Security Module keys' },
      { id: 'analytics', label: 'Azure Synapse & Fabric Analytics', desc: 'Direct analytical query pipelines on production data' }
    ];
  }, [isAws, isGcp, isNutanix]);

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
          <span>Step 03 / 04</span>
          <span>·</span>
          <span>Component Configuration</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Select Infrastructure Components
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Enable or disable specific architectural tiers independently. Active options are strictly filtered to the compatible platform matrix for <strong className="text-cyan-300 font-mono">{wizardState.templateChoice}</strong>.
        </p>
      </div>

      {/* 6 Independent Infrastructure Sections */}
      <div className="space-y-4">
        {/* =========================================================================
            SECTION 1: Interconnect & Layer 2 Extensions
           ========================================================================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            wizardState.interconnectEnabled
              ? 'bg-slate-900 border-cyan-500/60 shadow-lg shadow-cyan-500/5'
              : 'bg-slate-900/40 border-slate-800/80 opacity-70'
          }`}
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border ${
                  wizardState.interconnectEnabled
                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Network className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Interconnect Layer 2 Extensions
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300">
                    Physical Connectivity
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  High-speed cross-premises links, direct circuits, and L2 stretched subnets.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer self-end sm:self-auto">
              <span className="text-xs font-mono font-semibold text-slate-300">
                {wizardState.interconnectEnabled ? 'Included in Design' : 'Excluded'}
              </span>
              <input
                type="checkbox"
                checked={wizardState.interconnectEnabled}
                onChange={() => toggleSection('interconnect')}
                className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {wizardState.interconnectEnabled && (
            <div className="p-4 sm:p-5 space-y-4 bg-slate-950/40 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Circuit / Connection Type</label>
                  <select
                    value={wizardState.interconnectConfig.type}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        interconnectConfig: { ...prev.interconnectConfig, type: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {isAzure && (
                      <>
                        <option value="Azure ExpressRoute FastPath (10 Gbps)">Azure ExpressRoute FastPath (10 Gbps)</option>
                        <option value="Azure ExpressRoute Direct (100 Gbps)">Azure ExpressRoute Direct (100 Gbps)</option>
                        {isNutanix && (
                          <option value="Azure ExpressRoute FastPath with Flow VPC">Azure ExpressRoute FastPath with Flow VPC</option>
                        )}
                        <option value="High-Performance IPSec VPN Tunnel (BGP)">High-Performance IPSec VPN Tunnel (BGP)</option>
                      </>
                    )}
                    {isAws && (
                      <>
                        <option value="AWS Direct Connect Gateway (10G)">AWS Direct Connect Gateway (10G)</option>
                        <option value="AWS Direct Connect Dedicated (10 Gbps)">AWS Direct Connect Dedicated (10 Gbps)</option>
                        <option value="High-Performance IPSec VPN Tunnel (BGP)">High-Performance IPSec VPN Tunnel (BGP)</option>
                      </>
                    )}
                    {isGcp && (
                      <>
                        <option value="Google Cloud Dedicated Interconnect (10G)">Google Cloud Dedicated Interconnect (10G)</option>
                        <option value="Google Cloud Partner Interconnect (10G/100G)">Google Cloud Partner Interconnect (10G/100G)</option>
                        <option value="High-Performance IPSec VPN Tunnel (BGP)">High-Performance IPSec VPN Tunnel (BGP)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Bandwidth Capacity</label>
                  <select
                    value={wizardState.interconnectConfig.bandwidthGbps}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        interconnectConfig: { ...prev.interconnectConfig, bandwidthGbps: Number(e.target.value) }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value={1}>1 Gbps Standard Trunk</option>
                    <option value={10}>10 Gbps Dedicated Line-Rate</option>
                    <option value={100}>100 Gbps Ultra-High Throughput</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Circuit Redundancy</label>
                  <select
                    value={wizardState.interconnectConfig.redundancy}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        interconnectConfig: {
                          ...prev.interconnectConfig,
                          redundancy: e.target.value as 'dual' | 'single'
                        }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="dual">Dual Redundant Active-Active (99.99% SLA)</option>
                    <option value="single">Single Dedicated Uplink</option>
                  </select>
                </div>
              </div>

              {/* L2 Extension Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-800/60">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wizardState.interconnectConfig.layer2Extension}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        interconnectConfig: { ...prev.interconnectConfig, layer2Extension: e.target.checked }
                      }))
                    }
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Layer 2 Network Extension (HCX L2 Stretch)</span>
                    <span className="text-[11px] text-slate-400 font-mono">Extend IP subnets without workload re-IP or DNS modification</span>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wizardState.interconnectConfig.fastPathEnabled}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        interconnectConfig: { ...prev.interconnectConfig, fastPathEnabled: e.target.checked }
                      }))
                    }
                    className="w-4 h-4 accent-cyan-500 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">FastPath Gateway Bypass</span>
                    <span className="text-[11px] text-slate-400 font-mono">Sub-2ms direct hypervisor-to-hypervisor packet transport</span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 2: Landing Zone — Security & NVA
           ========================================================================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            wizardState.securityNvaEnabled
              ? 'bg-slate-900 border-emerald-500/60 shadow-lg shadow-emerald-500/5'
              : 'bg-slate-900/40 border-slate-800/80 opacity-70'
          }`}
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border ${
                  wizardState.securityNvaEnabled
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Landing Zone — Security & NVA
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                    Perimeter & Inspection
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Firewalls, network virtual appliances (NVAs), microsegmentation, and WAF perimeter.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer self-end sm:self-auto">
              <span className="text-xs font-mono font-semibold text-slate-300">
                {wizardState.securityNvaEnabled ? 'Included in Design' : 'Excluded'}
              </span>
              <input
                type="checkbox"
                checked={wizardState.securityNvaEnabled}
                onChange={() => toggleSection('security')}
                className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {wizardState.securityNvaEnabled && (
            <div className="p-4 sm:p-5 space-y-4 bg-slate-950/40 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Next-Gen Firewall / NVA</label>
                  <select
                    value={wizardState.securityNvaConfig.firewall}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        firewallProvider: e.target.value,
                        securityNvaConfig: { ...prev.securityNvaConfig, firewall: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {isAzure && (
                      <>
                        <option value="Palo Alto Networks VM-Series">Palo Alto Networks VM-Series (Panorama)</option>
                        <option value="Azure Firewall Premium / Native">Azure Firewall Premium (TLS Inspection)</option>
                        <option value="Fortinet FortiGate-VM">Fortinet FortiGate-VM (Security Fabric)</option>
                        <option value="Check Point CloudGuard">Check Point CloudGuard Network</option>
                        {isNutanix && <option value="Nutanix Flow Security + Azure NVA">Nutanix Flow Security + Azure NVA</option>}
                      </>
                    )}
                    {isAws && (
                      <>
                        <option value="AWS Network Firewall">AWS Network Firewall</option>
                        <option value="Fortinet FortiGate-VM">Fortinet FortiGate-VM (Security Fabric)</option>
                        <option value="Palo Alto Networks VM-Series">Palo Alto Networks VM-Series (Panorama)</option>
                        <option value="Check Point CloudGuard">Check Point CloudGuard Network</option>
                      </>
                    )}
                    {isGcp && (
                      <>
                        <option value="Google Cloud Armor & Next-Gen NVA">Google Cloud Armor & Next-Gen NVA</option>
                        <option value="Palo Alto Networks VM-Series">Palo Alto Networks VM-Series (Panorama)</option>
                        <option value="Fortinet FortiGate-VM">Fortinet FortiGate-VM (Security Fabric)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Web Application Firewall (WAF)</label>
                  <select
                    value={wizardState.securityNvaConfig.wafSolution}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        wafSolution: e.target.value,
                        securityNvaConfig: { ...prev.securityNvaConfig, wafSolution: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    {isAzure && (
                      <>
                        <option value="Azure WAF on Application Gateway">Azure WAF on Application Gateway</option>
                        <option value="Azure Front Door Premium WAF">Azure Front Door Premium WAF</option>
                        <option value="Cloudflare Magic Transit">Cloudflare Magic Transit & WAF</option>
                      </>
                    )}
                    {isAws && (
                      <>
                        <option value="AWS WAF">AWS WAF (Regional & CloudFront)</option>
                        <option value="F5 Distributed Cloud WAF">F5 Distributed Cloud WAF</option>
                        <option value="Cloudflare Magic Transit">Cloudflare Magic Transit & WAF</option>
                      </>
                    )}
                    {isGcp && (
                      <>
                        <option value="Google Cloud Armor WAF">Google Cloud Armor WAF</option>
                        <option value="F5 Distributed Cloud WAF">F5 Distributed Cloud WAF</option>
                        <option value="Cloudflare Magic Transit">Cloudflare Magic Transit & WAF</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Inspection Architecture</label>
                  <select
                    value={wizardState.securityNvaConfig.inspectionMode}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        securityNvaConfig: {
                          ...prev.securityNvaConfig,
                          inspectionMode: e.target.value as 'centralized-nva' | 'distributed' | 'dual-layer'
                        }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="dual-layer">Dual-Layer (North-South NVA + East-West DFW)</option>
                    <option value="centralized-nva">Centralized Secure Transit Hub</option>
                    <option value="distributed">Distributed Microsegmentation Only</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/60">
                <label className="flex items-center gap-2 p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wizardState.securityNvaConfig.microsegmentation}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        securityNvaConfig: { ...prev.securityNvaConfig, microsegmentation: e.target.checked }
                      }))
                    }
                    className="w-4 h-4 accent-emerald-500 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">East-West Microsegmentation Active</span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      NSX-T Distributed Firewall (DFW) or Nutanix Flow zero-trust isolation between workload VMs
                    </span>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 3: Landing Zone — Cloud-Native Services
           ========================================================================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            wizardState.cloudNativeEnabled
              ? 'bg-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-500/5'
              : 'bg-slate-900/40 border-slate-800/80 opacity-70'
          }`}
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border ${
                  wizardState.cloudNativeEnabled
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Landing Zone — Cloud-Native Services
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300">
                    PaaS & Platform Services
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Managed compute, cloud-native databases, storage, and platform integration tiers.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer self-end sm:self-auto">
              <span className="text-xs font-mono font-semibold text-slate-300">
                {wizardState.cloudNativeEnabled ? 'Included in Design' : 'Excluded'}
              </span>
              <input
                type="checkbox"
                checked={wizardState.cloudNativeEnabled}
                onChange={() => toggleSection('cloudNative')}
                className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {wizardState.cloudNativeEnabled && (
            <div className="p-4 sm:p-5 space-y-3 bg-slate-950/40 text-xs">
              <div className="text-[11px] text-slate-400 font-mono">
                Select the cloud-native platform services to attach to the cloud landing zone:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {cloudNativeOptions.map((opt) => {
                  const isChecked = (wizardState.cloudNativeConfig.selectedServices || []).includes(opt.label);
                  return (
                    <label
                      key={opt.id}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition ${
                        isChecked
                          ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-200'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleCloudNativeServiceToggle(opt.label)}
                        className="w-4 h-4 accent-indigo-500 rounded mt-0.5 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-xs text-slate-200">{opt.label}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">{opt.desc}</div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 4: VDI Services (Virtual Desktop Infrastructure)
           ========================================================================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            wizardState.vdiEnabled
              ? 'bg-slate-900 border-blue-500/60 shadow-lg shadow-blue-500/5'
              : 'bg-slate-900/40 border-slate-800/80 opacity-70'
          }`}
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border ${
                  wizardState.vdiEnabled
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    VDI Services (Virtual Desktop Infrastructure)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-blue-300">
                    Optional Desktop Fleet
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Dedicated virtual desktops, host pools, and user profile storage integration.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer self-end sm:self-auto">
              <span className="text-xs font-mono font-semibold text-slate-300">
                {wizardState.vdiEnabled ? 'Included in Design' : 'Excluded'}
              </span>
              <input
                type="checkbox"
                checked={wizardState.vdiEnabled}
                onChange={() => toggleSection('vdi')}
                className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {wizardState.vdiEnabled && (
            <div className="p-4 sm:p-5 space-y-4 bg-slate-950/40 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">VDI Technology Platform</label>
                  <select
                    value={wizardState.vdiConfig.platform}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        vdiConfig: {
                          ...prev.vdiConfig,
                          platform: e.target.value as any
                        }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    {isAzure && (
                      <>
                        <option value="Azure Virtual Desktop (AVD)">Azure Virtual Desktop (AVD)</option>
                        <option value="VMware Horizon Cloud">VMware Horizon Cloud on Azure</option>
                        <option value="Citrix DaaS">Citrix DaaS on Azure</option>
                        {isNutanix && <option value="Nutanix Frame">Nutanix Frame on Azure</option>}
                      </>
                    )}
                    {isAws && (
                      <>
                        <option value="Amazon WorkSpaces">Amazon WorkSpaces Core</option>
                        <option value="VMware Horizon Cloud">VMware Horizon Cloud on AWS</option>
                        <option value="Citrix DaaS">Citrix DaaS on AWS</option>
                      </>
                    )}
                    {isGcp && (
                      <>
                        <option value="Citrix DaaS">Citrix DaaS on Google Cloud</option>
                        <option value="VMware Horizon Cloud">VMware Horizon Cloud on GCP</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Desktop User Capacity</label>
                  <select
                    value={wizardState.vdiConfig.desktopCount}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        vdiConfig: { ...prev.vdiConfig, desktopCount: Number(e.target.value) }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    <option value={100}>100 Concurrent Users</option>
                    <option value={250}>250 Concurrent Users</option>
                    <option value={500}>500 Enterprise Workstations</option>
                    <option value={1000}>1,000+ Scale Fleet</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Profile Storage Tier</label>
                  <select
                    value={wizardState.vdiConfig.profileStorage}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        vdiConfig: { ...prev.vdiConfig, profileStorage: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                  >
                    {isAzure && (
                      <>
                        <option value="Azure Files Premium (FSLogix Profiles)">Azure Files Premium (FSLogix Profiles)</option>
                        <option value="Azure NetApp Files Ultra">Azure NetApp Files Ultra</option>
                        {isNutanix && <option value="Nutanix Files SMB Profile Share">Nutanix Files SMB Profile Share</option>}
                      </>
                    )}
                    {isAws && (
                      <>
                        <option value="Amazon FSx ONTAP Clustered SMB">Amazon FSx ONTAP Clustered SMB</option>
                        <option value="Amazon EFS Elastic Profile Share">Amazon EFS Elastic Profile Share</option>
                      </>
                    )}
                    {isGcp && (
                      <>
                        <option value="Google Cloud NetApp Volumes SMB">Google Cloud NetApp Volumes SMB</option>
                        <option value="Filestore Enterprise SMB">Filestore Enterprise SMB</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 5: Disaster Recovery
           ========================================================================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            wizardState.drEnabled
              ? 'bg-slate-900 border-amber-500/60 shadow-lg shadow-amber-500/5'
              : 'bg-slate-900/40 border-slate-800/80 opacity-70'
          }`}
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border ${
                  wizardState.drEnabled
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Disaster Recovery (DR)
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300">
                    Business Continuity & SLA
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Secondary standby cluster, replication engine, and automated failover SLAs.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer self-end sm:self-auto">
              <span className="text-xs font-mono font-semibold text-slate-300">
                {wizardState.drEnabled ? 'Included in Design' : 'Excluded'}
              </span>
              <input
                type="checkbox"
                checked={wizardState.drEnabled}
                onChange={() => toggleSection('dr')}
                className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {wizardState.drEnabled && (
            <div className="p-4 sm:p-5 space-y-4 bg-slate-950/40 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Replication Engine</label>
                  <select
                    value={wizardState.drConfig.engine}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        drConfig: { ...prev.drConfig, engine: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    {isAzure && !isNutanix && (
                      <>
                        <option value="VMware Site Recovery Manager (SRM) + vSphere Replication">VMware SRM + vSphere Replication</option>
                        <option value="Azure Site Recovery (ASR)">Azure Site Recovery (ASR)</option>
                        <option value="Zerto Continuous Data Protection (CDP)">Zerto Continuous Data Protection (CDP)</option>
                        <option value="Veeam Backup & Replication Enterprise">Veeam Backup & Replication</option>
                      </>
                    )}
                    {isNutanix && (
                      <>
                        <option value="Nutanix Protection Domains (NearSync & Metro Availability)">Nutanix Protection Domains (Metro/NearSync)</option>
                        <option value="Nutanix Move Cross-Hypervisor">Nutanix Move Cross-Hypervisor</option>
                        <option value="HYCU for Nutanix Enterprise Clouds">HYCU for Nutanix Enterprise Clouds</option>
                      </>
                    )}
                    {isAws && (
                      <>
                        <option value="VMware Site Recovery Manager (SRM) + vSphere Replication">VMware SRM + vSphere Replication</option>
                        <option value="AWS Elastic Disaster Recovery (AWS DRS)">AWS Elastic Disaster Recovery (AWS DRS)</option>
                        <option value="Zerto Continuous Data Protection (CDP)">Zerto Continuous Data Protection (CDP)</option>
                      </>
                    )}
                    {isGcp && (
                      <>
                        <option value="Zerto Continuous Data Protection (CDP)">Zerto Continuous Data Protection (CDP)</option>
                        <option value="VMware HCX / Google Cloud Interconnect">VMware HCX / Google Cloud Interconnect</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Target RPO SLA</label>
                  <select
                    value={wizardState.drConfig.rpoMinutes}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        drConfig: { ...prev.drConfig, rpoMinutes: Number(e.target.value) }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value={0}>0 min (Sync / Zero Data Loss)</option>
                    <option value={5}>5 min (Near-Realtime)</option>
                    <option value={15}>15 min (Standard Enterprise)</option>
                    <option value={60}>1 hour RPO</option>
                    <option value={240}>4 hours RPO</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Target RTO SLA</label>
                  <select
                    value={wizardState.drConfig.rtoMinutes}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        drConfig: { ...prev.drConfig, rtoMinutes: Number(e.target.value) }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value={15}>15 min Automated Cutover</option>
                    <option value={30}>30 min Orchestrated Runbook</option>
                    <option value={60}>1 hour Recovery Time</option>
                    <option value={240}>4 hours Cold Provisioning</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Resilience Strategy</label>
                  <select
                    value={wizardState.drConfig.strategy}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        drConfig: { ...prev.drConfig, strategy: e.target.value }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    <option value="Pilot Light (3-Node Minimum)">Pilot Light (3-Node Minimum)</option>
                    <option value="Warm Standby (Full Cluster)">Warm Standby (Full Sized Cluster)</option>
                    <option value="Cold Storage / On-Demand">Cold Storage / On-Demand Restore</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            SECTION 6: Other Services (Decoupled Storage, Migration, Observability)
           ========================================================================= */}
        <div
          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
            wizardState.otherServicesEnabled
              ? 'bg-slate-900 border-purple-500/60 shadow-lg shadow-purple-500/5'
              : 'bg-slate-900/40 border-slate-800/80 opacity-70'
          }`}
        >
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl border ${
                  wizardState.otherServicesEnabled
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-400'
                    : 'bg-slate-950 border-slate-800 text-slate-500'
                }`}
              >
                <HardDrive className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Other Services
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-purple-300">
                    Decoupled Storage & Migration
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  External NFS datastores, migration fleet appliances, and operations telemetry.
                </p>
              </div>
            </div>

            <label className="flex items-center gap-2.5 cursor-pointer self-end sm:self-auto">
              <span className="text-xs font-mono font-semibold text-slate-300">
                {wizardState.otherServicesEnabled ? 'Included in Design' : 'Excluded'}
              </span>
              <input
                type="checkbox"
                checked={wizardState.otherServicesEnabled}
                onChange={() => toggleSection('other')}
                className="w-5 h-5 accent-purple-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {wizardState.otherServicesEnabled && (
            <div className="p-4 sm:p-5 space-y-4 bg-slate-950/40 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Decoupled External Storage</label>
                  <select
                    value={wizardState.otherServicesConfig.decoupledStorageProvider}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        otherServicesConfig: {
                          ...prev.otherServicesConfig,
                          decoupledStorageProvider: e.target.value
                        }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  >
                    {isAzure && !isNutanix && (
                      <>
                        <option value="Azure NetApp Files (ANF NFS Datastore)">Azure NetApp Files (ANF NFS)</option>
                        <option value="Azure Elastic SAN (iSCSI Datastore)">Azure Elastic SAN (iSCSI)</option>
                        <option value="None (100% Local All-Flash NVMe)">None (100% Local All-Flash NVMe)</option>
                      </>
                    )}
                    {isNutanix && (
                      <>
                        <option value="Native Nutanix DSF Storage">Native Nutanix DSF Storage</option>
                        <option value="Azure NetApp Files (ANF NFS Datastore)">Azure NetApp Files (ANF NFS)</option>
                        <option value="None (100% Local All-Flash NVMe)">None (100% Local All-Flash NVMe)</option>
                      </>
                    )}
                    {isAws && (
                      <>
                        <option value="Amazon FSx for NetApp ONTAP (NFS Datastore)">Amazon FSx for NetApp ONTAP</option>
                        <option value="None (100% Local All-Flash NVMe)">None (100% Local All-Flash NVMe)</option>
                      </>
                    )}
                    {isGcp && (
                      <>
                        <option value="Google Cloud NetApp Volumes (GCNV NFS Datastore)">Google Cloud NetApp Volumes (GCNV)</option>
                        <option value="None (100% Local All-Flash NVMe)">None (100% Local All-Flash NVMe)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">
                    Decoupled Capacity (TB): <span className="text-cyan-400 font-mono">{wizardState.otherServicesConfig.decoupledStorageTB} TB</span>
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={500}
                    step={10}
                    value={wizardState.otherServicesConfig.decoupledStorageTB}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        decoupledStorageTB: Number(e.target.value),
                        otherServicesConfig: {
                          ...prev.otherServicesConfig,
                          decoupledStorageTB: Number(e.target.value),
                          decoupledStorageEnabled: Number(e.target.value) > 0
                        }
                      }))
                    }
                    className="w-full accent-purple-500 cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Migration Appliance Engine</label>
                  <select
                    value={wizardState.otherServicesConfig.migrationAppliance}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        otherServicesConfig: {
                          ...prev.otherServicesConfig,
                          migrationAppliance: e.target.value as any
                        }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  >
                    {isNutanix ? (
                      <option value="Nutanix Move">Nutanix Move Appliance (Cross-Hypervisor)</option>
                    ) : isAws ? (
                      <>
                        <option value="VMware HCX Enterprise">VMware HCX Enterprise (Bulk / RAV / MON)</option>
                        <option value="AWS MGN">AWS Application Migration Service (MGN)</option>
                        <option value="None">None (In-Place / Greenfield)</option>
                      </>
                    ) : (
                      <>
                        <option value="VMware HCX Enterprise">VMware HCX Enterprise (Bulk / RAV / MON)</option>
                        <option value="None">None (In-Place / Greenfield)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          REQUIREMENT 3: Advanced Configuration (COLLAPSED BY DEFAULT)
         ========================================================================= */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-lg">
        <button
          type="button"
          onClick={() => setShowAdvancedConfig(!showAdvancedConfig)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-900 transition cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-xs font-bold text-white tracking-wide block">
                Advanced Configuration (CIDRs, Sizing & Assumptions)
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {showAdvancedConfig ? 'Hide advanced engineering parameters' : 'Collapsed by default · Click to tweak CIDR blocks, host specs, and overcommit ratios'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
            <span>{showAdvancedConfig ? 'Collapse' : 'Expand'}</span>
            {showAdvancedConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showAdvancedConfig && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/70 space-y-5 text-xs">
            {/* CIDR Addressing */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-300 font-bold border-b border-slate-800 pb-1.5">
                <Network className="w-3.5 h-3.5 text-cyan-400" />
                <span>CIDR Blocks & Addressing</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Source On-Premises CIDR Block</label>
                  <input
                    type="text"
                    value={wizardState.sourceMgmtCidr}
                    onChange={(e) => onChange((prev) => ({ ...prev, sourceMgmtCidr: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="10.10.0.0/16"
                  />
                  <span className="text-[10px] text-slate-500 font-mono block">e.g. 10.10.0.0/16</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Target SDDC Management CIDR Block (/22 or /20)</label>
                  <input
                    type="text"
                    value={wizardState.sddcMgmtCidr}
                    onChange={(e) => onChange((prev) => ({ ...prev, sddcMgmtCidr: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                    placeholder="10.240.0.0/22"
                  />
                  <span className="text-[10px] text-slate-500 font-mono block">e.g. 10.240.0.0/22 (Must not overlap with on-premises)</span>
                </div>
              </div>
            </div>

            {/* Sizing & Overcommit Assumptions */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-300 font-bold border-b border-slate-800 pb-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                <span>Cluster Sizing & Overcommit Assumptions</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Source Host Count</label>
                  <input
                    type="number"
                    min={1}
                    max={128}
                    value={wizardState.clusters[0]?.hostCount || 16}
                    onChange={(e) =>
                      onChange((prev) => {
                        const count = Number(e.target.value);
                        const updated = [...prev.clusters];
                        if (updated[0]) updated[0].hostCount = count;
                        return { ...prev, clusters: updated };
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">vCPU:pCPU Overcommit Ratio</label>
                  <select
                    value={wizardState.assumptions.maxOversubscriptionRatio}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        assumptions: {
                          ...prev.assumptions,
                          maxOversubscriptionRatio: Number(e.target.value)
                        }
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value={2.0}>2.0:1 (Conservative)</option>
                    <option value={2.5}>2.5:1 (Balanced Enterprise Standard)</option>
                    <option value={3.0}>3.0:1 (High Density)</option>
                    <option value={4.0}>4.0:1 (Aggressive Dev/Test)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Failure Tolerance (N+X Reserved)</label>
                  <select
                    value={wizardState.failureReservedHosts}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        failureReservedHosts: Number(e.target.value)
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value={1}>N+1 (Single Host Failure Protection)</option>
                    <option value={2}>N+2 (Dual Host Mission-Critical Protection)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Templates</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Continue to Generate Blueprint</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
