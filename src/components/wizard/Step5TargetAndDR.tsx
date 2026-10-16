import React, { useState } from 'react';
import {
  Cloud,
  HardDrive,
  Cpu,
  ShieldCheck,
  Sparkles,
  Save,
  FileSpreadsheet,
  Download,
  Printer,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Network,
  Maximize2,
  Layers,
  FileText
} from 'lucide-react';
import { WizardState } from '../../types/wizardStateAdapter';
import {
  TARGET_NODE_SKU_CATALOGUE,
  STORAGE_ATTACHMENT_CATALOGUE
} from '../../data/cloudCompatibilityCatalogue';
import {
  getCompatibilityForPlatform,
  validateWizardStep
} from '../../utils/architectureCompatibilityRules';

interface Step5TargetAndDRProps {
  wizardState: WizardState;
  onChange: (updater: (prev: WizardState) => WizardState) => void;
  onPrev: () => void;
  onGenerateAI: () => void;
  isGeneratingAI: boolean;
  generationStep: string;
  generationProgress: number;
  onSaveBlueprint: () => void;
  onExportJson: () => void;
  onExportExcel: () => void;
  onExport4K: () => void;
  onOpenDossier: () => void;
  hasGeneratedBlueprint: boolean;
  onScrollToBlueprint: () => void;
}

export const Step5TargetAndDR: React.FC<Step5TargetAndDRProps> = ({
  wizardState,
  onChange,
  onPrev,
  onGenerateAI,
  isGeneratingAI,
  generationStep,
  generationProgress,
  onSaveBlueprint,
  onExportExcel,
  onExport4K,
  onOpenDossier,
  hasGeneratedBlueprint,
  onScrollToBlueprint
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const compat = getCompatibilityForPlatform(wizardState.targetPlatform);
  const availableSkus = TARGET_NODE_SKU_CATALOGUE.filter(
    (sku) => sku.platform === wizardState.targetPlatform
  );

  const handleGenerateClick = () => {
    const check = validateWizardStep(5, wizardState);
    if (!check.isValid) {
      setValidationError(check.errors[0] || 'Please ensure target node count and interconnect are valid.');
      return;
    }
    setValidationError(null);
    onGenerateAI();
  };

  return (
    <div className="space-y-4">
      {/* Step Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1.5">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
          <span>Step 05 / 05</span>
          <span>·</span>
          <span>Target Platform & Disaster Recovery</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Target Bare-Metal SDDC, Migration Engine & DR
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          Select target cluster node sizing, decoupled datastore capacity, scenario-matched migration appliances, and business continuity replication SLAs.
        </p>
      </div>

      {validationError && (
        <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Part A: Target Platform & Sizing */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
          <Cloud className="w-4 h-4 text-cyan-400" />
          <span>Section A: Target Dedicated Bare-Metal SDDC</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400">Target Cloud Platform</label>
            <select
              value={wizardState.targetPlatform}
              onChange={(e) => {
                const targetPlat = e.target.value as any;
                onChange((p) => ({
                  ...p,
                  targetPlatform: targetPlat
                }));
              }}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-medium"
            >
              <option value="avs-gen2">Azure VMware Solution (AVS Gen 2)</option>
              <option value="nc2-azure">Nutanix NC2 on Azure (Bare-Metal)</option>
              <option value="gcve">Google Cloud VMware Engine (GCVE)</option>
              <option value="vmc-aws">VMware Cloud on AWS (VMC)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400">Target Node Class / SKU</label>
            <select
              value={wizardState.targetNodeSku}
              onChange={(e) => onChange((p) => ({ ...p, targetNodeSku: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
            >
              {availableSkus.length > 0 ? (
                availableSkus.map((sku) => (
                  <option key={sku.sku} value={sku.sku}>
                    {sku.sku} — {sku.ramGB}GB RAM, {sku.physicalCores} Cores, {sku.rawStorageTB}TB Raw
                  </option>
                ))
              ) : (
                <option value={wizardState.targetNodeSku}>{wizardState.targetNodeSku}</option>
              )}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 flex items-center justify-between">
              <span>Cluster Node Count</span>
              <span className="text-[10px] text-slate-500 font-mono">Min 3 Quorum</span>
            </label>
            <input
              type="number"
              min={3}
              max={64}
              value={wizardState.targetNodeCount}
              onChange={(e) => onChange((p) => ({
                ...p,
                targetNodeCount: Math.max(3, parseInt(e.target.value) || 3)
              }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono font-bold"
            />
          </div>
        </div>
      </div>

      {/* Part B: Production & Disaster Recovery (DR) */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Section B: Production Protection & Disaster Recovery (DR)</span>
          </div>
          <button
            type="button"
            onClick={() => onChange((p) => ({ ...p, drEnabled: !p.drEnabled }))}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-semibold border transition cursor-pointer ${
              wizardState.drEnabled
                ? 'bg-amber-950 border-amber-500 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
          >
            {wizardState.drEnabled ? 'DR: ACTIVE' : 'DR: DISABLED'}
          </button>
        </div>

        {wizardState.drEnabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div className="space-y-1">
              <label className="text-slate-400">Replication & Runbook Engine</label>
              <select
                value={wizardState.drConfig.engine}
                onChange={(e) => onChange((p) => ({
                  ...p,
                  drConfig: { ...p.drConfig, engine: e.target.value }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400"
              >
                {compat.allowedDrEngines.map((eng) => (
                  <option key={eng} value={eng}>
                    {eng}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Target Recovery Point Objective (RPO)</label>
              <select
                value={wizardState.drConfig.rpoMinutes}
                onChange={(e) => onChange((p) => ({
                  ...p,
                  drConfig: { ...p.drConfig, rpoMinutes: parseInt(e.target.value) || 15 }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value={0}>0 Minutes (Synchronous / Metro Availability)</option>
                <option value={5}>5 Minutes (NearSync Fast Replication)</option>
                <option value={15}>15 Minutes (Standard Production SLA)</option>
                <option value={60}>60 Minutes (Standard Batch)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400">Target Recovery Time Objective (RTO)</label>
              <select
                value={wizardState.drConfig.rtoMinutes}
                onChange={(e) => onChange((p) => ({
                  ...p,
                  drConfig: { ...p.drConfig, rtoMinutes: parseInt(e.target.value) || 30 }
                }))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-mono"
              >
                <option value={15}>15 Minutes (Automated Failover Bubble)</option>
                <option value={30}>30 Minutes (One-Click Orchestrated)</option>
                <option value={60}>60 Minutes (Standard Production SLA)</option>
                <option value={120}>2 Hours (Scheduled Cold Standby)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Part C: Migration Tooling & Part D: Interconnect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Migration Tool */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Section C: Migration Appliance</span>
          </div>
          <div className="space-y-1 text-xs">
            <label className="text-slate-400">Workload Migration Engine</label>
            <select
              value={wizardState.otherServicesConfig.migrationAppliance}
              onChange={(e) => onChange((p) => ({
                ...p,
                otherServicesConfig: {
                  ...p.otherServicesConfig,
                  migrationAppliance: e.target.value as any
                }
              }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-medium"
            >
              {compat.allowedMigrationTools.map((tool) => (
                <option key={tool} value={tool}>
                  {tool}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500">
              Filtered strictly by target cloud and hypervisor compatibility.
            </p>
          </div>
        </div>

        {/* Interconnect */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Network className="w-4 h-4 text-cyan-400" />
            <span>Section D: Dedicated Interconnect Circuit</span>
          </div>
          <div className="space-y-1 text-xs">
            <label className="text-slate-400">Carrier Interconnect Circuit</label>
            <select
              value={wizardState.interconnectConfig.type}
              onChange={(e) => onChange((p) => ({
                ...p,
                interconnectConfig: { ...p.interconnectConfig, type: e.target.value }
              }))}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-400 font-medium"
            >
              {compat.allowedInterconnects.map((circuit) => (
                <option key={circuit} value={circuit}>
                  {circuit}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-300">
              <input
                type="checkbox"
                checked={wizardState.interconnectConfig.layer2Extension}
                onChange={(e) => onChange((p) => ({
                  ...p,
                  interconnectConfig: {
                    ...p.interconnectConfig,
                    layer2Extension: e.target.checked
                  }
                }))}
                className="rounded text-cyan-500 bg-slate-950 border-slate-700"
              />
              <span>Enable Layer 2 Network Extension (VM IP Preservation)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prominent Generation Callout Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-2 border-cyan-500/60 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Synthesize Architecture & Render 3D Cloud Blueprint
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Generates a photorealistic 3D isometric diagram illustrating only your selected components, direct interconnect conduits, isolated security perimeter, and DR targets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {hasGeneratedBlueprint && (
              <button
                type="button"
                onClick={onScrollToBlueprint}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/40 transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>View Blueprint ↓</span>
              </button>
            )}

            <button
              type="button"
              disabled={isGeneratingAI}
              onClick={handleGenerateClick}
              className={`px-6 py-3 rounded-xl text-slate-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                isGeneratingAI
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-cyan-500/30 hover:scale-[1.02]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'Synthesizing 3D Blueprint...' : 'Generate 3D Blueprint'}</span>
            </button>
          </div>
        </div>

        {/* Real-time Progress Display */}
        {isGeneratingAI && (
          <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                {generationStep}
              </span>
              <span className="text-cyan-400 font-bold">{generationProgress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300"
                style={{ width: `${generationProgress}%` }}
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
          <span>Back to Security & Firewalls</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSaveBlueprint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save State</span>
          </button>
          <button
            type="button"
            onClick={onExportExcel}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>BOM Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
