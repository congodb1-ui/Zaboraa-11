import React from 'react';
import {
  Layers,
  Network,
  Shield,
  Cloud,
  ChevronRight,
  Sparkles,
  Server,
  Zap,
  Globe2,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { WizardState, ArchitectureTemplateChoice } from '../../types/wizardStateAdapter';
import { CANONICAL_TEMPLATES, sanitizeWizardStateForTemplate } from '../../utils/architectureCompatibilityRules';

export interface IndustryTemplatePreset {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  apply: (prevState: WizardState) => WizardState;
}

interface WizardStepTabsProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  wizardState: WizardState;
  onApplyTemplate: (templateChoice: ArchitectureTemplateChoice) => void;
  isCidrValid?: boolean;
}

const TEMPLATE_CARDS: Array<{
  id: ArchitectureTemplateChoice;
  title: string;
  subtitle: string;
  badge: string;
  providerBadge: string;
}> = [
  {
    id: 'vmware-to-avs',
    title: 'VMware to AVS',
    subtitle: 'AV64 + Direct vNet + ANF + HCX',
    badge: 'Flagship Gen 2',
    providerBadge: 'Azure'
  },
  {
    id: 'vmware-to-nc2',
    title: 'VMware to NC2 on Azure',
    subtitle: 'Nutanix AN36P + Move + Prism',
    badge: 'Cross-Hypervisor',
    providerBadge: 'Azure'
  },
  {
    id: 'nutanix-to-nc2',
    title: 'Nutanix to NC2 on Azure',
    badge: 'Native AHV',
    subtitle: 'AOS 6.8 + DSF + Metro Protection',
    providerBadge: 'Azure'
  },
  {
    id: 'vmware-to-gcve',
    title: 'VMware to GCVE',
    subtitle: 've1-standard-72 + GCNV + HCX',
    badge: 'Google Cloud',
    providerBadge: 'Google Cloud'
  },
  {
    id: 'vmware-to-vmc',
    title: 'VMware to VMC on AWS',
    subtitle: 'i4i.metal + FSx ONTAP + TGW',
    badge: 'AWS SDDC',
    providerBadge: 'AWS'
  },
  {
    id: 'custom-path',
    title: 'Hybrid Extension',
    subtitle: 'Datacenter Burst + L2 Network Stretch',
    badge: 'Hybrid Mesh',
    providerBadge: 'Hybrid'
  }
];

const WIZARD_STEPS = [
  { step: 1, label: 'Objective', detail: 'Strategy & Scope' },
  { step: 2, label: 'Source', detail: 'On-Prem Inventory' },
  { step: 3, label: 'Landing Zone', detail: 'Cloud Foundation & VDI' },
  { step: 4, label: 'Security & WAF', detail: 'NVA & Perimeter' },
  { step: 5, label: 'Target & DR', detail: 'SDDC Sizing & Runbooks' }
];

export const WizardStepTabs: React.FC<WizardStepTabsProps> = ({
  currentStep,
  onSelectStep,
  wizardState,
  onApplyTemplate
}) => {
  return (
    <div className="space-y-4">
      {/* Quick-Start Architectural Templates Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-tight">Quick-Start Cloud Architecture Templates</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
            Loads preconfigured validated starting points · Fully customizable in steps
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {TEMPLATE_CARDS.map((tmpl) => {
            const isSelected = wizardState.templateChoice === tmpl.id;
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => onApplyTemplate(tmpl.id)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-500 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                      {tmpl.providerBadge}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <div className="font-bold text-xs text-white leading-tight truncate">
                    {tmpl.title}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 leading-snug">
                    {tmpl.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5-Step Process Indicator Bar */}
      <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="grid grid-cols-5 gap-1.5 text-xs">
          {WIZARD_STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isCompleted = currentStep > s.step;

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => onSelectStep(s.step)}
                className={`p-2 rounded-xl text-left transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-cyan-950/60 border border-cyan-500 text-white shadow-sm'
                    : isCompleted
                    ? 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:border-slate-700'
                    : 'bg-slate-950/30 border border-transparent text-slate-500 hover:text-slate-400'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950'
                      : isCompleted
                      ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-400'
                      : 'bg-slate-800 text-slate-500'
                  }`}
                >
                  {isCompleted ? '✓' : `0${s.step}`}
                </div>

                <div className="hidden md:block min-w-0">
                  <div className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {s.label}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{s.detail}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
