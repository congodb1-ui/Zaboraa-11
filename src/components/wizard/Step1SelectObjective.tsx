import React from 'react';
import {
  ArrowRight,
  Send,
  Building2,
  ShieldCheck,
  Zap,
  CheckCircle2,
  User,
  Calendar,
  Globe2,
  HardDrive
} from 'lucide-react';
import { WizardState, ArchitectureObjective } from '../../types/wizardStateAdapter';

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
  const selectedObjective = wizardState.objective || 'migrate-and-dr';

  const handleSelectObjective = (obj: ArchitectureObjective) => {
    onChange((prev) => {
      // Intelligently configure DR and Interconnect based on objective
      const isDrNeeded = obj === 'setup-dr' || obj === 'migrate-and-dr';
      return {
        ...prev,
        objective: obj,
        drEnabled: isDrNeeded,
        interconnectEnabled: true,
        footprintScope: obj === 'extend-dc' ? 'private-sddc' : 'hybrid-multi'
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
          <span>Step 01 / 04</span>
          <span>·</span>
          <span>Architecture Scope</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Select Your Architectural Objective
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Define the primary business outcome for this cloud architecture design. Your selection optimizes target sizing, connectivity recommendations, and resilience defaults.
        </p>
      </div>

      {/* Objective Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {OBJECTIVE_OPTIONS.map((opt) => {
          const isSelected = selectedObjective === opt.id;
          const Icon = opt.icon;

          return (
            <div
              key={opt.id}
              onClick={() => handleSelectObjective(opt.id)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2.5 rounded-xl border transition ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400/90 block">
                        {opt.badge}
                      </span>
                      <h3 className="text-base font-bold text-white tracking-tight">{opt.title}</h3>
                    </div>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition ${
                      isSelected
                        ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-4 h-4 fill-slate-950 text-cyan-400" />}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{opt.description}</p>

                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 font-mono mb-2">
                    <span className="text-slate-500 font-semibold">Typical use:</span> {opt.recommendedFor}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {opt.highlights.map((h, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300"
                      >
                        ✓ {h}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Metadata Section */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <Globe2 className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white">Project & Client Information</h3>
          <span className="text-[11px] text-slate-400 font-mono">Appears on generated blueprint & BOM</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Customer / Organization</span>
            </label>
            <input
              type="text"
              value={wizardState.customerName}
              onChange={(e) => onChange((prev) => ({ ...prev, customerName: e.target.value }))}
              placeholder="e.g. Acme Corporation"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 text-xs focus:outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>Lead Cloud Architect</span>
            </label>
            <input
              type="text"
              value={wizardState.architectName}
              onChange={(e) => onChange((prev) => ({ ...prev, architectName: e.target.value }))}
              placeholder="e.g. Wasim Sayyed"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 text-xs focus:outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Architecture Date</span>
            </label>
            <input
              type="date"
              value={wizardState.projectDate}
              onChange={(e) => onChange((prev) => ({ ...prev, projectDate: e.target.value }))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl text-slate-100 text-xs focus:outline-none transition font-mono"
            />
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-xs text-slate-400 font-mono">
          Selected Objective: <span className="text-cyan-400 font-bold">{OBJECTIVE_OPTIONS.find(o => o.id === selectedObjective)?.title}</span>
        </div>
        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Continue to Select Template</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
