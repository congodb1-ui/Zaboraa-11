import React from 'react';
import {
  Sparkles,
  ArrowLeft,
  FileSpreadsheet,
  Download,
  Save,
  CheckCircle2,
  XCircle,
  Network,
  Shield,
  Cloud,
  Monitor,
  ShieldCheck,
  HardDrive,
  FileText,
  Building2,
  Layers,
  Zap,
  Maximize2
} from 'lucide-react';
import { WizardState } from '../../types/wizardStateAdapter';

interface Step4GenerateBlueprintProps {
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

export const Step4GenerateBlueprint: React.FC<Step4GenerateBlueprintProps> = ({
  wizardState,
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
  const objectiveLabels: Record<string, string> = {
    'migration-only': 'Migration Only (Datacenter Evacuation)',
    'extend-dc': 'Extend Production Data Center (Hybrid Cloud Burst)',
    'setup-dr': 'Setup DR Infrastructure (Business Continuity)',
    'migrate-and-dr': 'Migrate & Setup DR (Full Modernization)'
  };

  const templateLabels: Record<string, string> = {
    'vmware-to-avs': 'VMware to Azure VMware Solution (AVS)',
    'vmware-to-nc2': 'VMware to Nutanix NC2 on Azure',
    'nutanix-to-nc2': 'Nutanix to Nutanix NC2 on Azure',
    'vmware-to-gcve': 'VMware to Google Cloud VMware Engine (GCVE)',
    'vmware-to-vmc': 'VMware to VMware Cloud on AWS (VMC)',
    'custom-path': 'Custom Path (Multi-Cloud / Hybrid Mesh)'
  };

  const totalHosts = wizardState.clusters.reduce((acc, c) => acc + c.hostCount, 0);

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
          <span>Step 04 / 04</span>
          <span>·</span>
          <span>Generation & Action Center</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Review & Generate 3D Architecture Blueprint
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Verify your selected objective, template, and included components below. Generate the high-resolution 3D cloud architecture illustration rendered strictly to your selected services.
        </p>
      </div>

      {/* Prominent Generation Callout Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border-2 border-cyan-500/60 shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <h3 className="text-lg font-bold text-white tracking-tight">
                Ready to Render 3D Cloud Blueprint
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Produces a photorealistic 3D isometric diagram illustrating only your selected components, direct interconnect conduits, isolated security perimeter, cloud-native services, and DR targets.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {hasGeneratedBlueprint && (
              <button
                type="button"
                onClick={onScrollToBlueprint}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 border border-cyan-500/40 transition cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>View Generated Design ↓</span>
              </button>
            )}

            <button
              type="button"
              disabled={isGeneratingAI}
              onClick={onGenerateAI}
              className={`px-6 py-3.5 rounded-xl text-slate-950 font-bold text-sm flex items-center justify-center gap-2.5 shadow-xl transition-all cursor-pointer ${
                isGeneratingAI
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-400 hover:brightness-110 shadow-cyan-500/30 hover:scale-[1.02]'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
              <span>{isGeneratingAI ? 'Rendering 3D Illustration...' : 'Generate 3D Blueprint'}</span>
            </button>
          </div>
        </div>

        {/* Progress Display during generation */}
        {isGeneratingAI && (
          <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/40 space-y-2.5 animate-in fade-in duration-200">
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

      {/* Component Selection Breakdown (Shows only selected components) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white">Active Component Manifest</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {wizardState.customerName} · {wizardState.projectDate}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Objective & Template */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
              Core Direction
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Objective:</span>
                <span className="text-white font-bold text-right truncate max-w-[220px]">
                  {objectiveLabels[wizardState.objective] || wizardState.objective}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Template:</span>
                <span className="text-cyan-300 font-bold text-right truncate max-w-[220px]">
                  {templateLabels[wizardState.templateChoice] || wizardState.templateChoice}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Target SDDC:</span>
                <span className="text-slate-200 font-mono">
                  {wizardState.targetNodeCount}x {wizardState.targetNodeSku}
                </span>
              </div>
            </div>
          </div>

          {/* On-Premises Source */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              On-Premises Infrastructure
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Source Hypervisor:</span>
                <span className="text-white font-bold">{wizardState.sourcePlatform.toUpperCase()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Compute Fabric:</span>
                <span className="text-slate-200 font-mono">{totalHosts} Hosts ({wizardState.hardwareVendor})</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Management Subnet:</span>
                <span className="text-slate-300 font-mono">{wizardState.sourceMgmtCidr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Independent Section Status Rows */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-slate-300">Selected Infrastructure Sections</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {/* 1. Interconnect */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                wizardState.interconnectEnabled
                  ? 'bg-cyan-950/20 border-cyan-500/40 text-cyan-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <Network className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span>Interconnect & L2</span>
                  {wizardState.interconnectEnabled ? (
                    <span className="text-[9px] font-mono px-1 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">ON</span>
                  ) : (
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-500 border border-slate-800">OFF</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {wizardState.interconnectEnabled
                    ? `${wizardState.interconnectConfig.bandwidthGbps}G ${wizardState.interconnectConfig.type}`
                    : 'Excluded from design'}
                </div>
              </div>
            </div>

            {/* 2. Security & NVA */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                wizardState.securityNvaEnabled
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span>Security & NVA</span>
                  {wizardState.securityNvaEnabled ? (
                    <span className="text-[9px] font-mono px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">ON</span>
                  ) : (
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-500 border border-slate-800">OFF</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {wizardState.securityNvaEnabled
                    ? `${wizardState.securityNvaConfig.firewall}`
                    : 'Excluded from design'}
                </div>
              </div>
            </div>

            {/* 3. Cloud-Native Services */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                wizardState.cloudNativeEnabled
                  ? 'bg-indigo-950/20 border-indigo-500/40 text-indigo-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <Cloud className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span>Cloud-Native Services</span>
                  {wizardState.cloudNativeEnabled ? (
                    <span className="text-[9px] font-mono px-1 rounded bg-indigo-950 text-indigo-400 border border-indigo-800">ON</span>
                  ) : (
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-500 border border-slate-800">OFF</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {wizardState.cloudNativeEnabled
                    ? `${wizardState.cloudNativeConfig.selectedServices?.length || 0} Platform Services Active`
                    : 'Excluded from design'}
                </div>
              </div>
            </div>

            {/* 4. VDI Services */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                wizardState.vdiEnabled
                  ? 'bg-blue-950/20 border-blue-500/40 text-blue-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <Monitor className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span>VDI Services</span>
                  {wizardState.vdiEnabled ? (
                    <span className="text-[9px] font-mono px-1 rounded bg-blue-950 text-blue-400 border border-blue-800">ON</span>
                  ) : (
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-500 border border-slate-800">OFF</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {wizardState.vdiEnabled
                    ? `${wizardState.vdiConfig.desktopCount} Users · ${wizardState.vdiConfig.platform}`
                    : 'Excluded from design'}
                </div>
              </div>
            </div>

            {/* 5. Disaster Recovery */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                wizardState.drEnabled
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span>Disaster Recovery</span>
                  {wizardState.drEnabled ? (
                    <span className="text-[9px] font-mono px-1 rounded bg-amber-950 text-amber-400 border border-amber-800">ON</span>
                  ) : (
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-500 border border-slate-800">OFF</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {wizardState.drEnabled
                    ? `${wizardState.drConfig.rpoMinutes}-min RPO · ${wizardState.drConfig.engine.split(' ')[0]}`
                    : 'Excluded from design'}
                </div>
              </div>
            </div>

            {/* 6. Other Services */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                wizardState.otherServicesEnabled
                  ? 'bg-purple-950/20 border-purple-500/40 text-purple-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <HardDrive className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                  <span>Other Services</span>
                  {wizardState.otherServicesEnabled ? (
                    <span className="text-[9px] font-mono px-1 rounded bg-purple-950 text-purple-400 border border-purple-800">ON</span>
                  ) : (
                    <span className="text-[9px] font-mono px-1 rounded bg-slate-900 text-slate-500 border border-slate-800">OFF</span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 font-mono truncate">
                  {wizardState.otherServicesEnabled
                    ? `${wizardState.otherServicesConfig.decoupledStorageTB} TB Storage · ${wizardState.otherServicesConfig.migrationAppliance}`
                    : 'Excluded from design'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export & Action Utility Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-mono">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>Architecture Artifact Exports:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onSaveBlueprint}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Save className="w-3.5 h-3.5 text-cyan-400" />
            <span>Save State</span>
          </button>

          <button
            type="button"
            onClick={onExportExcel}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Excel BOM</span>
          </button>

          <button
            type="button"
            onClick={onExport4K}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>4K PNG</span>
          </button>

          <button
            type="button"
            onClick={onOpenDossier}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-1.5 cursor-pointer font-semibold"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Components</span>
        </button>

        <button
          type="button"
          disabled={isGeneratingAI}
          onClick={onGenerateAI}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate 3D Blueprint Now</span>
        </button>
      </div>
    </div>
  );
};
