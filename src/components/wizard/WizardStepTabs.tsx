import React, { useState, useEffect } from 'react';
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
  ArrowRight,
  Sliders,
  Plus,
  Edit2
} from 'lucide-react';
import { WizardState, ArchitectureTemplateChoice } from '../../types/wizardStateAdapter';
import { CANONICAL_TEMPLATES, sanitizeWizardStateForTemplate } from '../../utils/architectureCompatibilityRules';
import { getAdminControlState, AdminTemplateDef } from '../../utils/adminParameterControls';
import { useCustomization } from '../../context/CustomizationContext';

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
  onOpenAdminStudio?: () => void;
}

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
  onApplyTemplate,
  onOpenAdminStudio
}) => {
  const { isAdmin } = useCustomization();
  const [templates, setTemplates] = useState<AdminTemplateDef[]>(() => {
    return getAdminControlState().templates;
  });

  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail?.templates) {
        setTemplates(e.detail.templates);
      }
    };
    window.addEventListener('zaboraa:admin-params-changed', handleUpdate);
    return () => window.removeEventListener('zaboraa:admin-params-changed', handleUpdate);
  }, []);

  const getProviderBadge = (provider: string) => {
    if (provider.includes('Azure')) return 'Azure';
    if (provider.includes('Google') || provider.includes('GCP')) return 'Google Cloud';
    if (provider.includes('AWS') || provider.includes('Amazon')) return 'AWS';
    if (provider.includes('Nutanix')) return 'Nutanix';
    return 'Hybrid';
  };

  return (
    <div className="space-y-4">
      {/* Quick-Start Architectural Templates Bar */}
      <div className="p-3 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-white tracking-tight">
              Quick-Start Cloud Architecture Templates
            </span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline">
              {templates.length} Active Templates
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-400 font-mono hidden md:inline">
              Loads preconfigured validated starting points · Fully customizable
            </span>
            {isAdmin && onOpenAdminStudio && (
              <button
                type="button"
                onClick={onOpenAdminStudio}
                className="px-2.5 py-1 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-[10px] font-mono font-bold flex items-center gap-1 cursor-pointer transition shadow"
                title="Open Admin Parameter & Template Studio"
              >
                <Sliders className="w-3 h-3 text-emerald-400" />
                <span>Admin Studio</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Responsive Grid of Templates */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {templates.map((tmpl) => {
            const isSelected = wizardState.templateChoice === tmpl.id;
            const provBadge = getProviderBadge(tmpl.provider);

            return (
              <div
                key={tmpl.id}
                onClick={() => onApplyTemplate(tmpl.id as ArchitectureTemplateChoice)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-500 shadow-md shadow-cyan-500/20 ring-1 ring-cyan-500/40'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-semibold px-1.5 py-0.2 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                      {provBadge}
                    </span>
                    <div className="flex items-center gap-1">
                      {isAdmin && onOpenAdminStudio && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenAdminStudio();
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-cyan-300 transition"
                          title="Edit this template in Admin Studio"
                        >
                          <Edit2 className="w-2.5 h-2.5" />
                        </button>
                      )}
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      )}
                    </div>
                  </div>
                  <div className="font-bold text-xs text-white leading-tight truncate">
                    {tmpl.title}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 leading-snug">
                    {tmpl.subtitle || `${tmpl.nodeSku} · ${tmpl.interconnect}`}
                  </div>
                </div>
              </div>
            );
          })}

          {/* If Admin, show Add Template card right here */}
          {isAdmin && onOpenAdminStudio && (
            <button
              type="button"
              onClick={onOpenAdminStudio}
              className="p-2.5 rounded-xl border border-dashed border-emerald-600/50 hover:border-emerald-500 bg-emerald-950/20 hover:bg-emerald-950/40 text-emerald-300 flex flex-col items-center justify-center gap-1 cursor-pointer transition"
              title="Add or remove architecture templates"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span className="text-[11px] font-bold">Add Template</span>
            </button>
          )}
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
