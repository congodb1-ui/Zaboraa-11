import React, { useState } from 'react';
import {
  Cloud,
  Network,
  Monitor,
  HardDrive,
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Server,
  Database,
  Lock,
  Globe2
} from 'lucide-react';
import { WizardState } from '../../types/wizardStateAdapter';
import { parseAndValidateCidr } from '../../utils/cidrUtils';
import { getCompatibilityForPlatform, validateWizardStep } from '../../utils/architectureCompatibilityRules';

interface Step3LandingZoneAndVDIProps {
  wizardState: WizardState;
  onChange: (updater: (prev: WizardState) => WizardState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3LandingZoneAndVDI: React.FC<Step3LandingZoneAndVDIProps> = ({
  wizardState,
  onChange,
  onNext,
  onPrev
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const compat = getCompatibilityForPlatform(wizardState.targetPlatform);
  const sddcCidrCheck = parseAndValidateCidr(wizardState.sddcMgmtCidr, 'azure');

  const handleContinue = () => {
    const check = validateWizardStep(3, wizardState);
    if (!check.isValid) {
      setValidationError(check.errors[0] || 'Please complete required landing zone parameters.');
      return;
    }
    setValidationError(null);
    onNext();
  };

  const handleToggleCloudService = (svc: string) => {
    onChange((prev) => {
      const current = prev.cloudNativeConfig.selectedServices || [];
      const updated = current.includes(svc)
        ? current.filter((s) => s !== svc)
        : [...current, svc];
      return {
        ...prev,
        cloudNativeConfig: {
          ...prev.cloudNativeConfig,
          selectedServices: updated
        }
      };
    });
  };

  // Provider-aware cloud-native services list
  const getProviderServices = () => {
    if (wizardState.targetPlatform === 'vmc-aws') {
      return [
        'Amazon VPC Peering & Transit Gateway Integration',
        'Amazon RDS / Aurora Database Endpoints',
        'Amazon S3 & EBS Data Storage Buckets',
        'AWS PrivateLink Interface Endpoints',
        'Amazon CloudWatch & VPC Flow Logs'
      ];
    }
    if (wizardState.targetPlatform === 'gcve') {
      return [
        'Google Cloud Shared VPC & NCC Peering',
        'Cloud SQL (PostgreSQL / MySQL Private IP)',
        'Google Cloud Storage (GCS) Multi-Region',
        'Google Private Service Connect (PSC)',
        'Cloud Logging & Monitoring Agent'
      ];
    }
    // Azure default (AVS, NC2 on Azure)
    return [
      'Azure Virtual Network Peering & Transit Hub',
      'Azure SQL Managed Instance Private Endpoint',
      'Azure Blob Storage Accounts & Data Lake',
      'Azure Private Link & Private Endpoints',
      'Azure Monitor & Network Watcher'
    ];
  };

  const currentProviderServices = getProviderServices();

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1.5">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
          <span>Step 03 / 05</span>
          <span>·</span>
          <span>Landing Zone & Services</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Cloud Foundation, Native Services & VDI
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Configure the cloud landing zone architecture, interconnecting hub-and-spoke topologies, optional native platform services, and virtual desktop infrastructure.
        </p>
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Part A: Landing Zone Foundation */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Section A: Landing Zone Network Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-400">
              Landing Zone Network Topology <span className="text-cyan-400 font-mono">*</span>
            </label>
            <select
              value={wizardState.landingZonePattern}
              onChange={(e) => {
                setValidationError(null);
                onChange((p) => ({ ...p, landingZonePattern: e.target.value }));
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
            >
              <option value="Azure Virtual WAN Hub-and-Spoke">Azure Virtual WAN Hub-and-Spoke (Global Mesh)</option>
              <option value="Standard Azure Hub-and-Spoke (Route Server)">Standard Hub-and-Spoke with Azure Route Server</option>
              <option value="AWS Transit Gateway (TGW) Hub">AWS Transit Gateway (TGW) Hub Architecture</option>
              <option value="Google Cloud Shared VPC + Cloud NCC">Google Cloud Shared VPC + Network Connectivity Center</option>
              <option value="Direct vNet Peering (High-Throughput Single Region)">Direct vNet / VPC Dedicated Peering</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-400 flex items-center justify-between">
              <span>Target SDDC Management CIDR (/22) <span className="text-cyan-400 font-mono">*</span></span>
              <span className={`text-[10px] font-mono ${sddcCidrCheck.isValid ? 'text-emerald-400' : 'text-amber-400'}`}>
                {sddcCidrCheck.isValid ? '✓ Valid /22 Allocation' : 'Required Non-Overlapping'}
              </span>
            </label>
            <input
              type="text"
              value={wizardState.sddcMgmtCidr}
              onChange={(e) => {
                setValidationError(null);
                onChange((p) => ({ ...p, sddcMgmtCidr: e.target.value }));
              }}
              placeholder="e.g. 10.240.0.0/22"
              className={`w-full px-3 py-2 rounded-lg bg-slate-950 border text-white text-xs font-mono focus:outline-none ${
                sddcCidrCheck.isValid ? 'border-slate-700 focus:border-cyan-400' : 'border-amber-500/60'
              }`}
            />
            <p className="text-[10px] text-slate-500">
              Dedicated subnet block for ESXi management, vCenter Server Appliance, NSX Edge nodes, and HCX appliances.
            </p>
          </div>
        </div>
      </div>

      {/* Part B: Cloud-Native Platform Services */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Cloud className="w-4 h-4 text-cyan-400" />
            <span>Section B: Cloud-Native Services (Provider-Filtered)</span>
          </div>
          <button
            type="button"
            onClick={() => onChange((p) => ({ ...p, cloudNativeEnabled: !p.cloudNativeEnabled }))}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold border transition cursor-pointer ${
              wizardState.cloudNativeEnabled
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {wizardState.cloudNativeEnabled ? 'Services: ACTIVE' : 'Services: EXCLUDED'}
          </button>
        </div>

        {wizardState.cloudNativeEnabled && (
          <div className="space-y-2 pt-1">
            <p className="text-[11px] text-slate-400">
              Select which platform services connect to your SDDC workloads via private peering and endpoints:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {currentProviderServices.map((svc) => {
                const isChecked = (wizardState.cloudNativeConfig.selectedServices || []).includes(svc);
                return (
                  <button
                    key={svc}
                    type="button"
                    onClick={() => handleToggleCloudService(svc)}
                    className={`p-2.5 rounded-lg border text-left transition flex items-center justify-between gap-2 cursor-pointer ${
                      isChecked
                        ? 'bg-cyan-950/30 border-cyan-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-[11px] font-medium truncate">{svc}</span>
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                      isChecked ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isChecked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Part C: VDI Services */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>Section C: Virtual Desktop Infrastructure (VDI)</span>
          </div>
          <button
            type="button"
            onClick={() => onChange((p) => ({ ...p, vdiEnabled: !p.vdiEnabled }))}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold border transition cursor-pointer ${
              wizardState.vdiEnabled
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {wizardState.vdiEnabled ? 'VDI: ENABLED' : 'VDI: DISABLED'}
          </button>
        </div>

        {wizardState.vdiEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">VDI Platform</label>
              <select
                value={wizardState.vdiConfig.platform}
                onChange={(e) => onChange((p) => ({
                  ...p,
                  vdiConfig: { ...p.vdiConfig, platform: e.target.value as any }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                {compat.allowedVdiPlatforms.map((plat) => (
                  <option key={plat} value={plat}>
                    {plat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Concurrent Named Desktops</label>
              <input
                type="number"
                min={10}
                max={50000}
                step={50}
                value={wizardState.vdiConfig.desktopCount}
                onChange={(e) => onChange((p) => ({
                  ...p,
                  vdiConfig: { ...p.vdiConfig, desktopCount: Math.max(1, parseInt(e.target.value) || 100) }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">User Profile Storage</label>
              <input
                type="text"
                value={wizardState.vdiConfig.profileStorage}
                onChange={(e) => onChange((p) => ({
                  ...p,
                  vdiConfig: { ...p.vdiConfig, profileStorage: e.target.value }
                }))}
                placeholder="e.g. Azure Files Premium (FSLogix)"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs"
              />
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
          <span>Back to Source</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] cursor-pointer"
        >
          <span>Continue to Security & Firewalls</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
