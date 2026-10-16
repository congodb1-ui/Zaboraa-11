import React, { useState } from 'react';
import {
  ArrowRight,
  Send,
  Building2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Globe2,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { WizardState, ArchitectureObjective } from '../../types/wizardStateAdapter';
import { validateWizardStep } from '../../utils/architectureCompatibilityRules';

interface Step1SelectObjectiveProps {
  wizardState: WizardState;
  onChange: (updater: (prev: WizardState) => WizardState) => void;
  onNext: () => void;
}

interface ObjectiveOption {
  id: ArchitectureObjective;
  title: string;
  badge: string;
  description: string;
  recommendedFor: string;
  icon: React.ElementType;
  highlights: string[];
}

const OBJECTIVE_OPTIONS: ObjectiveOption[] = [
  {
    id: 'migration-only',
    title: 'Migration Only',
    badge: 'Datacenter Evacuation',
    description: 'Relocate on-premises workloads to dedicated cloud bare-metal with near-zero downtime and zero hypervisor lock-in.',
    recommendedFor: 'Lease expiration, datacenter consolidation, hardware end-of-life',
    icon: Send,
    highlights: ['Non-disruptive migration waves', 'Layer 2 network stretch', 'Zero-downtime cutover']
  },
  {
    id: 'extend-dc',
    title: 'Extend Production Data Center',
    badge: 'Hybrid Cloud Burst',
    description: 'Seamlessly extend on-premises networks and clusters into hyperscaler infrastructure for dynamic capacity and seasonal burst.',
    recommendedFor: 'Hybrid operations, bursting dev/test workloads, elastic capacity',
    icon: Building2,
    highlights: ['Single pane of glass management', 'Bi-directional VM mobility', 'ExpressRoute / Direct Connect']
  },
  {
    id: 'setup-dr',
    title: 'Setup DR Infrastructure',
    badge: 'Business Continuity',
    description: 'Establish a secondary cloud disaster recovery target with automated orchestration and sub-hour recovery SLAs.',
    recommendedFor: 'Replacing secondary physical datacenter, regulatory ransomware recovery',
    icon: ShieldCheck,
    highlights: ['Pilot Light 3-node footprint', 'Sub-15 min RPO replication', 'One-click failover runbooks']
  },
  {
    id: 'migrate-and-dr',
    title: 'Migrate & Setup DR',
    badge: 'Full Modernization',
    description: 'Complete cloud modernization: migrate production workloads to cloud SDDC with secondary availability zone or multi-region DR protection.',
    recommendedFor: 'Enterprise core transformation, zero downtime and secondary region failover',
    icon: Zap,
    highlights: ['Full production migration', 'Cross-region DR replication', 'Zero-trust perimeter security']
  }
];

export const Step1SelectObjective: React.FC<Step1SelectObjectiveProps> = ({
  wizardState,
  onChange,
  onNext
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const selectedObjective = wizardState.objective || 'migrate-and-dr';

  const handleSelectObjective = (obj: ArchitectureObjective) => {
    setValidationError(null);
    onChange((prev) => {
      const isDrNeeded = obj === 'setup-dr' || obj === 'migrate-and-dr';
      return {
        ...prev,
        objective: obj,
        drEnabled: isDrNeeded,
        interconnectEnabled: true,
        footprintScope: obj === 'extend-dc' ? 'private-sddc' : prev.footprintScope || 'hybrid-multi'
      };
    });
  };

  const handleScopeChange = (scope: 'private-sddc' | 'native-cloud' | 'hybrid-multi') => {
    setValidationError(null);
    onChange((prev) => ({
      ...prev,
      footprintScope: scope
    }));
  };

  const handleContinue = () => {
    const check = validateWizardStep(1, wizardState);
    if (!check.isValid) {
      setValidationError(check.errors[0] || 'Please complete required fields.');
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
          <span>Step 01 / 05</span>
          <span>·</span>
          <span>Architectural Objective</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          What is the primary architecture goal?
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Select the strategic outcome for your enterprise cloud architecture. This drives sizing recommendations, interconnect configurations, and resiliency requirements.
        </p>
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Primary Objective Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {OBJECTIVE_OPTIONS.map((opt) => {
          const isSelected = selectedObjective === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              onClick={() => handleSelectObjective(opt.id)}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 via-cyan-950/40 to-slate-900 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-lg border transition ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 block">
                        {opt.badge}
                      </span>
                      <h3 className="text-sm font-bold text-white tracking-tight">
                        {opt.title}
                      </h3>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-full bg-cyan-500/20 text-cyan-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {opt.description}
                </p>

                <div className="space-y-1 pt-1 border-t border-slate-800/80">
                  {opt.highlights.map((h, i) => (
                    <div key={i} className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-cyan-400 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deployment Scope (Required) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
          <span>Deployment Scope <span className="text-cyan-400 font-mono">*</span></span>
          <span className="text-[10px] font-mono text-slate-400">Required</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          {[
            { id: 'hybrid-multi', label: 'Hybrid Cloud', desc: 'On-premises datacenter connected to cloud SDDC' },
            { id: 'native-cloud', label: 'Multi-Cloud Mesh', desc: 'Spans multiple cloud providers and regions' },
            { id: 'private-sddc', label: 'Single Cloud', desc: 'Dedicated isolated bare-metal cloud cluster' }
          ].map((scope) => {
            const isSelected = wizardState.footprintScope === scope.id;
            return (
              <button
                key={scope.id}
                type="button"
                onClick={() => handleScopeChange(scope.id as any)}
                className={`p-3 rounded-lg border text-left transition cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <div className="font-bold text-xs text-white">{scope.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{scope.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collapsed Advanced Constraints & Strategy Accordion */}
      <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-900/60">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full p-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:bg-slate-800/50 transition cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>Advanced Migration Strategy & Constraints</span>
            <span className="text-[10px] font-mono text-slate-500 font-normal">(Optional)</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </button>

        {showAdvanced && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-3 text-xs animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">Migration Methodology</label>
                <select
                  value={wizardState.migrationStrategy || 'rehost'}
                  onChange={(e) => onChange((p) => ({ ...p, migrationStrategy: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="rehost">Rehost (Lift & Shift VM Mobility)</option>
                  <option value="replatform">Replatform (Managed DBs & Storage Attachments)</option>
                  <option value="modernize">Modernize (Cloud-Native & Container Hybrid)</option>
                  <option value="mixed">Mixed Enterprise Wave Strategy</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">Workload Criticality Tier</label>
                <select
                  value={wizardState.workloadCriticality || 'mission-critical'}
                  onChange={(e) => onChange((p) => ({ ...p, workloadCriticality: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
                >
                  <option value="mission-critical">Tier 1: Mission-Critical (Near-Zero Downtime)</option>
                  <option value="high">Tier 2: Business Core (Scheduled Cutover)</option>
                  <option value="medium">Tier 3: Standard Enterprise Application</option>
                  <option value="low">Tier 4: Dev / Test / Elastic Sandboxes</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-end pt-2">
        <button
          type="button"
          onClick={handleContinue}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] cursor-pointer"
        >
          <span>Continue to Source Infrastructure</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
