import React, { useState, useEffect, useMemo } from 'react';
import {
  Sliders,
  ShieldCheck,
  Server,
  Cloud,
  Check,
  RotateCcw,
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  Database,
  Network,
  Shield,
  Save,
  X,
  Search,
  Filter,
  ArrowRight,
  Settings,
  Copy,
  Info
} from 'lucide-react';
import {
  AdminTemplateDef,
  AdminBlueprintParameterMap,
  BLUEPRINT_PARAMETERS_REGISTRY,
  ParameterControlMeta,
  ParameterStatus,
  getAdminControlState,
  saveAdminControlState,
  addAdminTemplate,
  updateAdminTemplate,
  deleteAdminTemplate,
  toggleParameterControl,
  resetAdminControlState,
  DEFAULT_ADMIN_TEMPLATES
} from '../utils/adminParameterControls';

interface AdminParameterControlStudioProps {
  onClose?: () => void;
}

export const AdminParameterControlStudio: React.FC<AdminParameterControlStudioProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'parameters' | 'templates'>('parameters');
  const [templates, setTemplates] = useState<AdminTemplateDef[]>([]);
  const [parameterControls, setParameterControls] = useState<AdminBlueprintParameterMap>({});
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Template Form Modal state
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Template Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formBadge, setFormBadge] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formProvider, setFormProvider] = useState<string>('Microsoft Azure');
  const [formTargetPlatform, setFormTargetPlatform] = useState<'avs-gen2' | 'nc2-azure' | 'gcve' | 'vmc-aws' | 'hybrid-mesh'>('avs-gen2');
  const [formSourcePlatform, setFormSourcePlatform] = useState<'vmware' | 'nutanix' | 'hyperv' | 'baremetal'>('vmware');
  const [formDescription, setFormDescription] = useState('');
  const [formNodeSku, setFormNodeSku] = useState('AV64');
  const [formRecommendedNodes, setFormRecommendedNodes] = useState<number>(4);
  const [formInterconnect, setFormInterconnect] = useState('Azure ExpressRoute FastPath (10 Gbps)');
  const [formStorage, setFormStorage] = useState('Azure NetApp Files (ANF NFS Datastore)');
  const [formStorageTB, setFormStorageTB] = useState<number>(120);
  const [formFirewall, setFormFirewall] = useState('Palo Alto Networks VM-Series');
  const [formLandingZone, setFormLandingZone] = useState('Azure Virtual WAN Hub-and-Spoke');
  const [formDrEngine, setFormDrEngine] = useState('VMware Site Recovery Manager (SRM) + vSphere Replication');
  const [formDrRpoMinutes, setFormDrRpoMinutes] = useState<number>(15);
  const [formDrRtoMinutes, setFormDrRtoMinutes] = useState<number>(30);
  const [formMigrationTool, setFormMigrationTool] = useState('VMware HCX Enterprise');

  // Load state on mount & listen to storage events
  const refreshState = () => {
    const loaded = getAdminControlState();
    setTemplates(loaded.templates);
    setParameterControls(loaded.parameterControls);
  };

  useEffect(() => {
    refreshState();

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setTemplates(e.detail.templates);
        setParameterControls(e.detail.parameterControls);
      }
    };

    window.addEventListener('zaboraa:admin-params-changed', handleUpdate);
    return () => window.removeEventListener('zaboraa:admin-params-changed', handleUpdate);
  }, []);

  const triggerNotice = (msg: string) => {
    setSaveNotice(msg);
    setTimeout(() => setSaveNotice(null), 3500);
  };

  const handleStatusChange = (paramKey: string, nextStatus: ParameterStatus) => {
    const nextControls = {
      ...parameterControls,
      [paramKey]: nextStatus
    };
    setParameterControls(nextControls);
    toggleParameterControl(paramKey, nextStatus);
    const paramMeta = BLUEPRINT_PARAMETERS_REGISTRY.find(p => p.key === paramKey);
    const statusLabel = nextStatus === 'hidden' ? 'REMOVED / HIDDEN' : nextStatus.toUpperCase();
    triggerNotice(`Parameter "${paramMeta?.label || paramKey}" updated to ${statusLabel}`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset ALL blueprint parameters and templates back to system factory defaults? This will erase custom additions and restore original validated templates.')) {
      const reset = resetAdminControlState();
      setTemplates(reset.templates);
      setParameterControls(reset.parameterControls);
      triggerNotice('Restored factory default blueprint parameters & templates successfully!');
    }
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingTemplateId(null);
    setFormTitle('New Cloud Architecture Template');
    setFormBadge('Enterprise Baseline');
    setFormSubtitle('Custom Hybrid Cloud Architecture');
    setFormProvider('Microsoft Azure');
    setFormTargetPlatform('avs-gen2');
    setFormSourcePlatform('vmware');
    setFormDescription('Tailored private cloud datacenter migration and hybrid cloud transit topology.');
    setFormNodeSku('AV64');
    setFormRecommendedNodes(4);
    setFormInterconnect('Azure ExpressRoute FastPath (10 Gbps)');
    setFormStorage('Azure NetApp Files (ANF NFS Datastore)');
    setFormStorageTB(100);
    setFormFirewall('Palo Alto Networks VM-Series');
    setFormLandingZone('Azure Virtual WAN Hub-and-Spoke');
    setFormDrEngine('VMware Site Recovery Manager (SRM)');
    setFormDrRpoMinutes(15);
    setFormDrRtoMinutes(30);
    setFormMigrationTool('VMware HCX Enterprise');
    setIsTemplateModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (tmpl: AdminTemplateDef) => {
    setEditingTemplateId(tmpl.id);
    setFormTitle(tmpl.title);
    setFormBadge(tmpl.badge || '');
    setFormSubtitle(tmpl.subtitle || '');
    setFormProvider(tmpl.provider || 'Microsoft Azure');
    setFormTargetPlatform(tmpl.targetPlatform || 'avs-gen2');
    setFormSourcePlatform(tmpl.sourcePlatform || 'vmware');
    setFormDescription(tmpl.description || '');
    setFormNodeSku(tmpl.nodeSku || 'AV64');
    setFormRecommendedNodes(tmpl.recommendedNodes || 4);
    setFormInterconnect(tmpl.interconnect || '');
    setFormStorage(tmpl.storage || '');
    setFormStorageTB(tmpl.storageTB || 100);
    setFormFirewall(tmpl.firewall || '');
    setFormLandingZone(tmpl.landingZone || '');
    setFormDrEngine(tmpl.drEngine || '');
    setFormDrRpoMinutes(tmpl.drRpoMinutes || 15);
    setFormDrRtoMinutes(tmpl.drRtoMinutes || 30);
    setFormMigrationTool(tmpl.recommendedMigrationTool || 'VMware HCX Enterprise');
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTemplateId) {
      // Update existing template
      updateAdminTemplate(editingTemplateId, {
        title: formTitle.trim(),
        badge: formBadge.trim() || 'Architecture',
        subtitle: formSubtitle.trim() || undefined,
        provider: formProvider,
        targetPlatform: formTargetPlatform,
        sourcePlatform: formSourcePlatform,
        targetProvider:
          formTargetPlatform === 'gcve' ? 'gcp' :
          formTargetPlatform === 'vmc-aws' ? 'aws' :
          formTargetPlatform === 'hybrid-mesh' ? 'hybrid' : 'azure',
        description: formDescription.trim(),
        nodeSku: formNodeSku.trim(),
        recommendedNodes: Number(formRecommendedNodes) || 4,
        interconnect: formInterconnect.trim(),
        storage: formStorage.trim(),
        storageTB: Number(formStorageTB) || 100,
        firewall: formFirewall.trim(),
        landingZone: formLandingZone.trim(),
        drEngine: formDrEngine.trim(),
        drRpoMinutes: Number(formDrRpoMinutes) || 15,
        drRtoMinutes: Number(formDrRtoMinutes) || 30,
        recommendedMigrationTool: formMigrationTool.trim()
      });
      triggerNotice(`Updated template "${formTitle}" successfully!`);
    } else {
      // Create new template
      const newId = `custom-template-${Date.now()}`;
      const newTemplate: AdminTemplateDef = {
        id: newId,
        title: formTitle.trim(),
        badge: formBadge.trim() || 'Custom',
        subtitle: formSubtitle.trim() || undefined,
        provider: formProvider,
        targetPlatform: formTargetPlatform,
        sourcePlatform: formSourcePlatform,
        targetProvider:
          formTargetPlatform === 'gcve' ? 'gcp' :
          formTargetPlatform === 'vmc-aws' ? 'aws' :
          formTargetPlatform === 'hybrid-mesh' ? 'hybrid' : 'azure',
        description: formDescription.trim(),
        sourceTech: `${formSourcePlatform.toUpperCase()} Datacenter`,
        targetTech: `${formProvider} SDDC`,
        nodeSku: formNodeSku.trim(),
        recommendedNodes: Number(formRecommendedNodes) || 4,
        interconnect: formInterconnect.trim(),
        security: formFirewall.trim(),
        storage: formStorage.trim(),
        storageTB: Number(formStorageTB) || 100,
        firewall: formFirewall.trim(),
        landingZone: formLandingZone.trim(),
        drEngine: formDrEngine.trim(),
        drRpoMinutes: Number(formDrRpoMinutes) || 15,
        drRtoMinutes: Number(formDrRtoMinutes) || 30,
        recommendedMigrationTool: formMigrationTool.trim(),
        isCustom: true,
        enabled: true
      };
      addAdminTemplate(newTemplate);
      triggerNotice(`Added new template "${formTitle}" to blueprint generator!`);
    }

    setIsTemplateModalOpen(false);
    refreshState();
  };

  const handleDeleteTemplate = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete template "${title}"? It will be removed from the Blueprint Generator.`)) {
      deleteAdminTemplate(id);
      refreshState();
      triggerNotice(`Deleted template "${title}"`);
    }
  };

  // Filter parameters by category and search
  const filteredParameters = useMemo(() => {
    return BLUEPRINT_PARAMETERS_REGISTRY.filter((p) => {
      const matchesCategory =
        categoryFilter === 'all' ||
        (categoryFilter === 'scope' && p.step === 1) ||
        (categoryFilter === 'source' && p.step === 2) ||
        (categoryFilter === 'transit' && p.step === 3) ||
        (categoryFilter === 'security' && p.step === 4) ||
        (categoryFilter === 'target' && p.step === 5);

      const matchesSearch =
        searchQuery.trim() === '' ||
        p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.key.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Statistics
  const paramStats = useMemo(() => {
    let mandatory = 0;
    let optional = 0;
    let hidden = 0;
    BLUEPRINT_PARAMETERS_REGISTRY.forEach((p) => {
      const status = parameterControls[p.key] || p.defaultStatus;
      if (status === 'mandatory') mandatory++;
      else if (status === 'optional') optional++;
      else if (status === 'hidden') hidden++;
    });
    return { total: BLUEPRINT_PARAMETERS_REGISTRY.length, mandatory, optional, hidden };
  }, [parameterControls]);

  return (
    <div className="space-y-6 text-xs text-slate-200">
      {/* Studio Header Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Admin Blueprint Customization Studio
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono font-semibold">
              Live Governance
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed max-w-2xl">
            Modify or completely remove parameters from the Blueprint Generator, configure mandatory requirements, and add, modify, or delete baseline cloud architecture templates.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {saveNotice && (
            <span className="text-[11px] text-emerald-300 bg-emerald-950/90 border border-emerald-500/60 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-mono animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {saveNotice}
            </span>
          )}
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer transition"
            title="Reset all parameters and templates to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Defaults</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Studio Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 rounded-xl gap-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('parameters')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'parameters'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          <span>Blueprint Parameters Control ({paramStats.total})</span>
          {paramStats.hidden > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-950 border border-rose-500/50 text-rose-300 text-[10px] font-mono">
              {paramStats.hidden} Removed
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
            activeTab === 'templates'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Architecture Templates Manager ({templates.length})</span>
        </button>
      </div>

      {/* TAB 1: BLUEPRINT PARAMETERS CUSTOMIZATION */}
      {activeTab === 'parameters' && (
        <div className="space-y-4">
          {/* Summary Metric Counter Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Parameters</span>
              <span className="text-xl font-bold text-white font-mono">{paramStats.total}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-400 font-mono uppercase block">Mandatory Required</span>
              <span className="text-xl font-bold text-emerald-300 font-mono">{paramStats.mandatory}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30">
              <span className="text-[10px] text-cyan-400 font-mono uppercase block">Optional Available</span>
              <span className="text-xl font-bold text-cyan-300 font-mono">{paramStats.optional}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/30">
              <span className="text-[10px] text-rose-400 font-mono uppercase block">Removed / Hidden</span>
              <span className="text-xl font-bold text-rose-300 font-mono">{paramStats.hidden}</span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Steps' },
                { id: 'scope', label: 'Step 1: Scope' },
                { id: 'source', label: 'Step 2: Source' },
                { id: 'transit', label: 'Step 3: Landing Zone' },
                { id: 'security', label: 'Step 4: Security' },
                { id: 'target', label: 'Step 5: Target & DR' }
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    categoryFilter === c.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parameter..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:border-cyan-500 outline-none"
              />
            </div>
          </div>

          {/* Parameters List */}
          <div className="space-y-3">
            {filteredParameters.map((param) => {
              const currentStatus: ParameterStatus =
                parameterControls[param.key] || param.defaultStatus;

              return (
                <div
                  key={param.key}
                  className={`p-4 rounded-xl border transition-all ${
                    currentStatus === 'hidden'
                      ? 'bg-slate-950/40 border-rose-900/40 opacity-75'
                      : currentStatus === 'mandatory'
                      ? 'bg-slate-950/90 border-emerald-500/40'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-xs">{param.label}</span>
                        <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-400">
                          Step {param.step}: {param.stepName}
                        </span>
                        {currentStatus === 'mandatory' && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold">
                            Mandatory Required
                          </span>
                        )}
                        {currentStatus === 'optional' && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            Optional
                          </span>
                        )}
                        {currentStatus === 'hidden' && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                            Removed from Generator
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{param.description}</p>
                      {currentStatus === 'hidden' && (
                        <p className="text-[10px] text-rose-300/80 font-mono flex items-center gap-1 mt-0.5">
                          <EyeOff className="w-3 h-3 text-rose-400" />
                          <span>Behavior when hidden: {param.impactIfHidden}</span>
                        </p>
                      )}
                    </div>

                    {/* 3-State Action Selector: Mandatory / Optional / Remove (Hidden) */}
                    <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0 self-start md:self-auto">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(param.key, 'mandatory')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                          currentStatus === 'mandatory'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Enforce parameter as mandatory in wizard"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>Mandatory</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(param.key, 'optional')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                          currentStatus === 'optional'
                            ? 'bg-cyan-600 text-white shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title="Include parameter as optional"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Optional</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(param.key, 'hidden')}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 ${
                          currentStatus === 'hidden'
                            ? 'bg-rose-600 text-white shadow'
                            : 'text-slate-400 hover:text-rose-400'
                        }`}
                        title="Completely remove parameter from Blueprint Generator"
                      >
                        <EyeOff className="w-3 h-3" />
                        <span>Remove / Hide</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ARCHITECTURE TEMPLATES MANAGER */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Cloud Blueprint Templates ({templates.length})
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Add, modify, or remove the starting baseline architecture templates shown on the Blueprint Generator page.
              </p>
            </div>
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Template</span>
            </button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {templates.map((tmpl) => (
              <div
                key={tmpl.id}
                className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{tmpl.title}</span>
                        {tmpl.isCustom && (
                          <span className="px-1.5 py-0.2 rounded bg-cyan-950 border border-cyan-500/40 text-[9px] font-mono text-cyan-300">
                            Custom Admin
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span className="text-cyan-400">{tmpl.provider}</span>
                        <span>·</span>
                        <span>{tmpl.badge}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(tmpl)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 hover:text-white transition cursor-pointer"
                        title="Modify template specifications"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(tmpl.id, tmpl.title)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 border border-slate-700 hover:border-rose-700 text-slate-400 hover:text-rose-300 transition cursor-pointer"
                        title="Delete this template"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>

                  {/* Template Blueprint Parameters Pill Matrix */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] font-mono">
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Node Hardware:</span>
                      <span className="text-white font-semibold truncate block">
                        {tmpl.recommendedNodes}x {tmpl.nodeSku}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">External Storage:</span>
                      <span className="text-white font-semibold truncate block">
                        {tmpl.storageTB} TB {tmpl.storage}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">Firewall & Transit:</span>
                      <span className="text-white font-semibold truncate block">
                        {tmpl.firewall || tmpl.security}
                      </span>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block">DR Replication:</span>
                      <span className="text-white font-semibold truncate block">
                        {tmpl.drEngine}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Interconnect: {tmpl.interconnect}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(tmpl)}
                    className="text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                  >
                    <span>Edit Specs</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CREATE / EDIT TEMPLATE MODAL */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {editingTemplateId ? 'Modify Architecture Template' : 'Add New Architecture Template'}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Customize default node SKUs, storage attachment, perimeter firewalls, and DR parameters.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTemplateModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplateForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Template Title:</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. VMware to AVS"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Badge / Tagline:</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Azure VMware Solution"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Subtitle / Key Specs Summary:</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="e.g. AV64 + Direct vNet + ANF + HCX"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Cloud Provider:</label>
                  <select
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Microsoft Azure">Microsoft Azure</option>
                    <option value="Google Cloud">Google Cloud</option>
                    <option value="Amazon Web Services">Amazon Web Services</option>
                    <option value="Multi-Cloud">Multi-Cloud / Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target Platform:</label>
                  <select
                    value={formTargetPlatform}
                    onChange={(e) => setFormTargetPlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="avs-gen2">Azure VMware Solution (AVS Gen 2)</option>
                    <option value="nc2-azure">Nutanix NC2 on Azure</option>
                    <option value="gcve">Google Cloud VMware Engine (GCVE)</option>
                    <option value="vmc-aws">VMware Cloud on AWS (VMC)</option>
                    <option value="hybrid-mesh">Hybrid Mesh / Multi-Cloud</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Source Platform:</label>
                  <select
                    value={formSourcePlatform}
                    onChange={(e) => setFormSourcePlatform(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  >
                    <option value="vmware">VMware vSphere (ESXi)</option>
                    <option value="nutanix">Nutanix AOS / AHV</option>
                    <option value="hyperv">Microsoft Hyper-V</option>
                    <option value="baremetal">Bare-Metal / Physical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Description:</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Architectural overview of this deployment pathway..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Default Node SKU:</label>
                  <input
                    type="text"
                    value={formNodeSku}
                    onChange={(e) => setFormNodeSku(e.target.value)}
                    placeholder="e.g. AV64, AN36P, ve1-standard-72, i4i.metal"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Recommended Node Count:</label>
                  <input
                    type="number"
                    min={3}
                    max={64}
                    value={formRecommendedNodes}
                    onChange={(e) => setFormRecommendedNodes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Dedicated Interconnect:</label>
                  <input
                    type="text"
                    value={formInterconnect}
                    onChange={(e) => setFormInterconnect(e.target.value)}
                    placeholder="e.g. Azure ExpressRoute FastPath (10 Gbps)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Landing Zone Fabric:</label>
                  <input
                    type="text"
                    value={formLandingZone}
                    onChange={(e) => setFormLandingZone(e.target.value)}
                    placeholder="e.g. Azure Virtual WAN Hub-and-Spoke"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">External Storage Datastore:</label>
                  <input
                    type="text"
                    value={formStorage}
                    onChange={(e) => setFormStorage(e.target.value)}
                    placeholder="e.g. Azure NetApp Files (ANF NFS Datastore)"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Default Storage Capacity (TB):</label>
                  <input
                    type="number"
                    min={10}
                    value={formStorageTB}
                    onChange={(e) => setFormStorageTB(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Perimeter Firewall (NVA):</label>
                  <input
                    type="text"
                    value={formFirewall}
                    onChange={(e) => setFormFirewall(e.target.value)}
                    placeholder="e.g. Palo Alto Networks VM-Series"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Migration Tool Appliance:</label>
                  <input
                    type="text"
                    value={formMigrationTool}
                    onChange={(e) => setFormMigrationTool(e.target.value)}
                    placeholder="e.g. VMware HCX Enterprise / Nutanix Move"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">DR Replication Engine:</label>
                  <input
                    type="text"
                    value={formDrEngine}
                    onChange={(e) => setFormDrEngine(e.target.value)}
                    placeholder="e.g. VMware SRM + vSphere Replication"
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target RPO (Minutes):</label>
                  <input
                    type="number"
                    min={0}
                    value={formDrRpoMinutes}
                    onChange={(e) => setFormDrRpoMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Target RTO (Minutes):</label>
                  <input
                    type="number"
                    min={0}
                    value={formDrRtoMinutes}
                    onChange={(e) => setFormDrRtoMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingTemplateId ? 'Save Changes' : 'Create Template'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
