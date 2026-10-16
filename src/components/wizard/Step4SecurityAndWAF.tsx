import React, { useState } from 'react';
import {
  Shield,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { WizardState } from '../../types/wizardStateAdapter';
import { getCompatibilityForPlatform, validateWizardStep } from '../../utils/architectureCompatibilityRules';

interface Step4SecurityAndWAFProps {
  wizardState: WizardState;
  onChange: (updater: (prev: WizardState) => WizardState) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step4SecurityAndWAF: React.FC<Step4SecurityAndWAFProps> = ({
  wizardState,
  onChange,
  onNext,
  onPrev
}) => {
  const [showNvaAdvanced, setShowNvaAdvanced] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const compat = getCompatibilityForPlatform(wizardState.targetPlatform);

  const handleContinue = () => {
    const check = validateWizardStep(4, wizardState);
    if (!check.isValid) {
      setValidationError(check.errors[0] || 'Please complete required security settings.');
      return;
    }
    setValidationError(null);
    onNext();
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1.5">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
          <span>Step 04 / 05</span>
          <span>·</span>
          <span>Security & Firewalls</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Perimeter Firewalls, NVA & Web Application Security
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Establish an independent security tier with Next-Generation Firewall appliances, distributed microsegmentation, and WAF inspection.
        </p>
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Part A: Firewall Topology */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Section A: Perimeter Firewall & NVA Appliance</span>
          </div>
          <button
            type="button"
            onClick={() => onChange((p) => ({ ...p, securityNvaEnabled: !p.securityNvaEnabled }))}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold border transition cursor-pointer ${
              wizardState.securityNvaEnabled
                ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {wizardState.securityNvaEnabled ? 'Firewall: ACTIVE' : 'Firewall: DISABLED'}
          </button>
        </div>

        {wizardState.securityNvaEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1.5">
              <label className="text-slate-400">
                Firewall / NVA Solution <span className="text-cyan-400 font-mono">*</span>
              </label>
              <select
                value={wizardState.securityNvaConfig.firewall}
                onChange={(e) => {
                  setValidationError(null);
                  onChange((p) => ({
                    ...p,
                    securityNvaConfig: { ...p.securityNvaConfig, firewall: e.target.value }
                  }));
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                {compat.allowedFirewalls.map((fw) => (
                  <option key={fw} value={fw}>
                    {fw}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Firewall Placement & Inspection Flow</label>
              <select
                value={wizardState.securityNvaConfig.inspectionMode}
                onChange={(e) => onChange((p) => ({
                  ...p,
                  securityNvaConfig: { ...p.securityNvaConfig, inspectionMode: e.target.value as any }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="centralized-nva">Central Hub Virtual WAN / Transit Gateway</option>
                <option value="dual-layer">Dual-Layer (Edge NVA + Distributed NSX DFW)</option>
                <option value="distributed">Distributed Microsegmentation Only</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Part B: Web Application Firewall (WAF) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span>Section B: Web Application Firewall (WAF) & Ingress</span>
          </div>
          <button
            type="button"
            onClick={() => onChange((p) => ({
              ...p,
              securityNvaConfig: {
                ...p.securityNvaConfig,
                wafEnabled: !p.securityNvaConfig.wafEnabled
              }
            }))}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold border transition cursor-pointer ${
              wizardState.securityNvaConfig.wafEnabled
                ? 'bg-cyan-950 border-cyan-500 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {wizardState.securityNvaConfig.wafEnabled ? 'WAF: ENABLED' : 'WAF: DISABLED'}
          </button>
        </div>

        {wizardState.securityNvaConfig.wafEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
            <div className="space-y-1.5">
              <label className="text-slate-400">
                WAF Appliance / Managed Service <span className="text-cyan-400 font-mono">*</span>
              </label>
              <select
                value={wizardState.securityNvaConfig.wafSolution}
                onChange={(e) => {
                  setValidationError(null);
                  onChange((p) => ({
                    ...p,
                    securityNvaConfig: { ...p.securityNvaConfig, wafSolution: e.target.value }
                  }));
                }}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Azure WAF on Application Gateway">Azure WAF on Application Gateway (v2)</option>
                <option value="AWS WAF on Application Load Balancer">AWS WAF on Application Load Balancer</option>
                <option value="Google Cloud Armor (Managed WAF & DDoS)">Google Cloud Armor (Managed WAF & DDoS)</option>
                <option value="Cloudflare Magic Transit & Edge WAF">Cloudflare Enterprise Edge WAF</option>
                <option value="F5 BIG-IP Advanced WAF">F5 BIG-IP Advanced WAF Virtual Edition</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-400">Protected Ingress Endpoints</label>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                HTTPS (TCP 443) / Public API Services & SSL Offloading
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Part C: Collapsed NVA Advanced Settings */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
        <button
          type="button"
          onClick={() => setShowNvaAdvanced(!showNvaAdvanced)}
          className="w-full p-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-800/50 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>High Availability Clustering & Microsegmentation Details</span>
            <span className="text-[10px] font-mono text-slate-500 font-normal">(Optional Details)</span>
          </span>
          {showNvaAdvanced ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showNvaAdvanced && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">High Availability Mode</label>
                <select
                  value="active-active-ecmp"
                  disabled
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 text-xs"
                >
                  <option value="active-active-ecmp">Active-Active ECMP (Equal-Cost Multi-Path)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">Distributed Firewall (East-West)</label>
                <div className="flex items-center gap-2 pt-1 text-slate-300">
                  <input
                    type="checkbox"
                    checked={wizardState.securityNvaConfig.microsegmentation}
                    onChange={(e) => onChange((p) => ({
                      ...p,
                      securityNvaConfig: { ...p.securityNvaConfig, microsegmentation: e.target.checked }
                    }))}
                    className="rounded text-cyan-500 bg-slate-950 border-slate-700"
                  />
                  <span>Enforce Zero-Trust Microsegmentation across all SDDC subnets</span>
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
          <span>Back to Landing Zone</span>
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] cursor-pointer"
        >
          <span>Continue to Target & DR</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
