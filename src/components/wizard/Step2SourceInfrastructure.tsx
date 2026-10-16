import React, { useState } from 'react';
import {
  Server,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  HardDrive,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Building,
  User,
  Calendar,
  Globe,
  Sliders,
  AlertCircle
} from 'lucide-react';
import { WizardState, WizardClusterSpec } from '../../types/wizardStateAdapter';
import { parseAndValidateCidr } from '../../utils/cidrUtils';
import { HARDWARE_VENDOR_CATALOGUE } from '../../data/cloudCompatibilityCatalogue';
import { validateWizardStep } from '../../utils/architectureCompatibilityRules';

interface Step2SourceInfrastructureProps {
  wizardState: WizardState;
  onChange: (updater: (prev: WizardState) => WizardState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2SourceInfrastructure: React.FC<Step2SourceInfrastructureProps> = ({
  wizardState,
  onChange,
  onNext,
  onPrev
}) => {
  const [showAdvancedInventory, setShowAdvancedInventory] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const cidrValidation = parseAndValidateCidr(wizardState.sourceMgmtCidr, 'on-premise');

  const selectedVendorCatalogue =
    HARDWARE_VENDOR_CATALOGUE.find((v) => v.vendor === wizardState.hardwareVendor) ||
    HARDWARE_VENDOR_CATALOGUE[0];

  const handleAddCluster = () => {
    const newId = `cluster-${Date.now()}`;
    const newCluster: WizardClusterSpec = {
      id: newId,
      name: `Cluster ${wizardState.clusters.length + 1}`,
      hostCount: 4,
      sockets: 2,
      coresPerSocket: 32,
      hyperthreading: true,
      ramGB: 768,
      storageTB: 19.2
    };

    onChange((prev) => ({
      ...prev,
      clusters: [...prev.clusters, newCluster]
    }));
  };

  const handleRemoveCluster = (id: string) => {
    if (wizardState.clusters.length <= 1) return;
    onChange((prev) => ({
      ...prev,
      clusters: prev.clusters.filter((c) => c.id !== id)
    }));
  };

  const handleUpdateCluster = (id: string, field: keyof WizardClusterSpec, val: any) => {
    onChange((prev) => ({
      ...prev,
      clusters: prev.clusters.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    }));
  };

  const handleContinue = () => {
    const check = validateWizardStep(2, wizardState);
    if (!check.isValid) {
      setValidationError(check.errors[0] || 'Please complete all required fields.');
      return;
    }
    setValidationError(null);
    onNext();
  };

  const totalPhysicalHosts = wizardState.clusters.reduce((acc, c) => acc + c.hostCount, 0);
  const totalRawCores = wizardState.clusters.reduce((acc, c) => acc + c.hostCount * c.sockets * c.coresPerSocket, 0);
  const totalInstalledRamTB = (wizardState.clusters.reduce((acc, c) => acc + c.hostCount * c.ramGB, 0) / 1024).toFixed(1);
  const totalInstalledStorageTB = wizardState.clusters.reduce((acc, c) => acc + c.hostCount * c.storageTB, 0).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1.5">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
          <span>Step 02 / 05</span>
          <span>·</span>
          <span>Source Infrastructure</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Existing Infrastructure & Workload Inventory
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Specify your current on-premises or cloud source hypervisors, compute fabric, and management subnet allocation.
        </p>
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Customer & Project Metadata */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-200">Enterprise Engagement Details</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer / Account <span className="text-cyan-400 font-mono">*</span></span>
            </label>
            <input
              type="text"
              value={wizardState.customerName}
              onChange={(e) => {
                setValidationError(null);
                onChange((p) => ({ ...p, customerName: e.target.value }));
              }}
              placeholder="e.g. Acme Corporation"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lead Architect</span>
            </label>
            <input
              type="text"
              value={wizardState.architectName}
              onChange={(e) => onChange((p) => ({ ...p, architectName: e.target.value }))}
              placeholder="e.g. Wasim Sayyed"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Architecture Date</span>
            </label>
            <input
              type="text"
              value={wizardState.projectDate}
              onChange={(e) => onChange((p) => ({ ...p, projectDate: e.target.value }))}
              placeholder="e.g. October 2026"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400 font-medium"
            />
          </div>
        </div>
      </div>

      {/* Source Platform & Subnet Allocation */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-bold text-slate-200">Source Hypervisor & Subnet Planning</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-400">
              Source Platform <span className="text-cyan-400 font-mono">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'vmware', label: 'VMware vSphere', desc: 'ESXi 7.0/8.0 / VCF' },
                { id: 'nutanix', label: 'Nutanix AHV', desc: 'AOS 6.5/6.8 Prism' },
                { id: 'hyperv', label: 'Microsoft Hyper-V', desc: 'WSFC / SCVMM' },
                { id: 'baremetal', label: 'Physical Bare Metal', desc: 'Dell / HPE / Cisco' }
              ].map((plat) => {
                const isSelected = wizardState.sourcePlatform === plat.id;
                return (
                  <button
                    key={plat.id}
                    type="button"
                    onClick={() => {
                      setValidationError(null);
                      onChange((p) => ({ ...p, sourcePlatform: plat.id as any }));
                    }}
                    className={`p-2.5 rounded-lg border text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-white ring-1 ring-cyan-500/40'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">{plat.label}</div>
                    <div className="text-[10px] text-slate-500">{plat.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 flex items-center justify-between">
              <span>Source Management Subnet CIDR <span className="text-cyan-400 font-mono">*</span></span>
              <span className={`text-[10px] font-mono ${cidrValidation.isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                {cidrValidation.isValid ? '✓ Valid IPv4 CIDR' : 'Required for overlap check'}
              </span>
            </label>
            <input
              type="text"
              value={wizardState.sourceMgmtCidr}
              onChange={(e) => {
                setValidationError(null);
                onChange((p) => ({ ...p, sourceMgmtCidr: e.target.value }));
              }}
              placeholder="e.g. 10.10.0.0/24"
              className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-white text-xs font-mono focus:outline-none ${
                cidrValidation.isValid ? 'border-slate-700 focus:border-cyan-400' : 'border-amber-500/60'
              }`}
            />
            <p className="text-[10px] text-slate-500">
              Used for automated non-overlapping validation against cloud SDDC management allocations.
            </p>
          </div>
        </div>
      </div>

      {/* Hardware Vendor & Active Clusters */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="text-xs font-bold text-slate-200">On-Premises Compute Clusters</div>
            <div className="text-[11px] text-slate-400 font-mono">
              Aggregate: {totalPhysicalHosts} Hosts · {totalRawCores} Cores · {totalInstalledRamTB} TB RAM · {totalInstalledStorageTB} TB Raw
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddCluster}
            className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-semibold text-xs flex items-center gap-1.5 cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Cluster</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {wizardState.clusters.map((cluster, idx) => (
            <div
              key={cluster.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={cluster.name}
                  onChange={(e) => handleUpdateCluster(cluster.id, 'name', e.target.value)}
                  className="font-bold text-xs text-white bg-transparent border-b border-transparent hover:border-slate-700 focus:border-cyan-400 focus:outline-none px-1"
                />
                {wizardState.clusters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCluster(cluster.id)}
                    className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Hosts</label>
                  <input
                    type="number"
                    min={1}
                    max={64}
                    value={cluster.hostCount}
                    onChange={(e) => handleUpdateCluster(cluster.id, 'hostCount', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Sockets / Host</label>
                  <input
                    type="number"
                    min={1}
                    max={8}
                    value={cluster.sockets}
                    onChange={(e) => handleUpdateCluster(cluster.id, 'sockets', Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Cores / Socket</label>
                  <input
                    type="number"
                    min={4}
                    max={128}
                    value={cluster.coresPerSocket}
                    onChange={(e) => handleUpdateCluster(cluster.id, 'coresPerSocket', Math.max(4, parseInt(e.target.value) || 4))}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">RAM / Host (GB)</label>
                  <input
                    type="number"
                    min={64}
                    max={4096}
                    step={64}
                    value={cluster.ramGB}
                    onChange={(e) => handleUpdateCluster(cluster.id, 'ramGB', Math.max(64, parseInt(e.target.value) || 64))}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400">Raw Disk / Host (TB)</label>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    step={1}
                    value={cluster.storageTB}
                    onChange={(e) => handleUpdateCluster(cluster.id, 'storageTB', Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapsed Advanced Source Inventory Accordion */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
        <button
          type="button"
          onClick={() => setShowAdvancedInventory(!showAdvancedInventory)}
          className="w-full p-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-800/50 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>Hardware Manufacturer, Site Count & Layer 2 Extension</span>
            <span className="text-[10px] font-mono text-slate-500 font-normal">(Optional Details)</span>
          </span>
          {showAdvancedInventory ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showAdvancedInventory && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">Server Hardware Vendor</label>
                <select
                  value={wizardState.hardwareVendor}
                  onChange={(e) => onChange((p) => ({ ...p, hardwareVendor: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  {HARDWARE_VENDOR_CATALOGUE.map((v) => (
                    <option key={v.vendor} value={v.vendor}>
                      {v.vendor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">Hardware Model / SKU</label>
                <select
                  value={wizardState.hardwareSku}
                  onChange={(e) => onChange((p) => ({ ...p, hardwareSku: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  {selectedVendorCatalogue.models.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
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
          <span>Back to Objective</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] cursor-pointer"
        >
          <span>Continue to Landing Zone & VDI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
