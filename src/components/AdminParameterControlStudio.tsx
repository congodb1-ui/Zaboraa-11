import React, { useState, useEffect } from 'react';
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
  Lock,
  Unlock,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Layers,
  Database,
  Network,
  Shield,
  Save,
  X
} from 'lucide-react';
import {
  AdminTemplateDef,
  AdminParamConstraints,
  getAdminControlState,
  saveAdminControlState,
  resetAdminControlState,
  DEFAULT_ADMIN_TEMPLATES
} from '../utils/adminParameterControls';

interface AdminParameterControlStudioProps {
  onClose?: () => void;
}

export const AdminParameterControlStudio: React.FC<AdminParameterControlStudioProps> = ({ onClose }) => {
  const [templates, setTemplates] = useState<AdminTemplateDef[]>([]);
  const [constraints, setConstraints] = useState<AdminParamConstraints>({
    sddcMgmtCidr: 'mandatory',
    decoupledStorage: 'optional',
    firewallNva: 'mandatory',
    cloudNative: 'optional',
    vdiConfig: 'optional',
    drConfig: 'optional'
  });
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Modal / Form state for Creating or Editing a Template
  const [editingTemplate, setEditingTemplate] = useState<AdminTemplateDef | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formProvider, setFormProvider] = useState<AdminTemplateDef['provider']>('Microsoft Azure');
  const [formBadge, setFormBadge] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSourceTech, setFormSourceTech] = useState('');
  const [formTargetTech, setFormTargetTech] = useState('');
  const [formNodeSku, setFormNodeSku] = useState('');
  const [formNodes, setFormNodes] = useState(4);
  const [formInterconnect, setFormInterconnect] = useState('');
  const [formSecurity, setFormSecurity] = useState('');
  const [formStorage, setFormStorage] = useState('');

  // Load state on mount and listen to changes
  useEffect(() => {
    const loaded = getAdminControlState();
    setTemplates(loaded.templates);
    setConstraints(loaded.constraints);

    const handleUpdate = (e: any) => {
      if (e.detail) {
        setTemplates(e.detail.templates);
        setConstraints(e.detail.constraints);
      }
    };

    window.addEventListener('zaboraa:admin-params-changed', handleUpdate);
    return () => window.removeEventListener('zaboraa:admin-params-changed', handleUpdate);
  }, []);

  const triggerNotice = (msg: string) => {
    setSaveNotice(msg);
    setTimeout(() => setSaveNotice(null), 3500);
  };

  const handleToggleConstraint = (key: keyof AdminParamConstraints) => {
    const updated: AdminParamConstraints = {
      ...constraints,
      [key]: constraints[key] === 'mandatory' ? 'optional' : 'mandatory'
    };
    setConstraints(updated);
    saveAdminControlState({ constraints: updated });
    triggerNotice(`Parameter '${key}' toggled to ${updated[key].toUpperCase()}`);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all templates and parameter constraints to system defaults? This will clear local overrides.')) {
      const reset = resetAdminControlState();
      setTemplates(reset.templates);
      setConstraints(reset.constraints);
      triggerNotice('Restored system defaults successfully!');
    }
  };

  const openCreateModal = () => {
    setIsCreatingNew(true);
    setEditingTemplate(null);
    setFormTitle('');
    setFormProvider('Microsoft Azure');
    setFormBadge('Custom Architecture');
    setFormDesc('');
    setFormSourceTech('VMware vSphere 8.0 Enterprise Plus');
    setFormTargetTech('Dedicated Cloud SDDC Cluster');
    setFormNodeSku('Standard Enterprise Bare-Metal Node');
    setFormNodes(4);
    setFormInterconnect('Dedicated High-Speed Cloud Peering (10 Gbps)');
    setFormSecurity('Next-Generation Firewall / Microsegmentation');
    setFormStorage('High-Performance Decoupled NFS Datastores');
  };

  const openEditModal = (tpl: AdminTemplateDef) => {
    setEditingTemplate(tpl);
    setIsCreatingNew(false);
    setFormTitle(tpl.title);
    setFormProvider(tpl.provider);
    setFormBadge(tpl.badge);
    setFormDesc(tpl.description);
    setFormSourceTech(tpl.sourceTech);
    setFormTargetTech(tpl.targetTech);
    setFormNodeSku(tpl.nodeSku);
    setFormNodes(tpl.recommendedNodes);
    setFormInterconnect(tpl.interconnect);
    setFormSecurity(tpl.security);
    setFormStorage(tpl.storage);
  };

  const handleSaveTemplateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (isCreatingNew) {
      const newTpl: AdminTemplateDef = {
        id: `custom-${Date.now()}`,
        title: formTitle.trim(),
        provider: formProvider,
        badge: formBadge.trim() || 'Custom',
        description: formDesc.trim() || 'Custom architected cloud pathway.',
        sourceTech: formSourceTech.trim(),
        targetTech: formTargetTech.trim(),
        nodeSku: formNodeSku.trim(),
        recommendedNodes: Number(formNodes) || 4,
        interconnect: formInterconnect.trim(),
        security: formSecurity.trim(),
        storage: formStorage.trim(),
        isCustom: true
      };

      const updated = [...templates, newTpl];
      setTemplates(updated);
      saveAdminControlState({ templates: updated });
      triggerNotice(`Created new template '${newTpl.title}'`);
    } else if (editingTemplate) {
      const updated = templates.map((t) => {
        if (t.id === editingTemplate.id) {
          return {
            ...t,
            title: formTitle.trim(),
            provider: formProvider,
            badge: formBadge.trim(),
            description: formDesc.trim(),
            sourceTech: formSourceTech.trim(),
            targetTech: formTargetTech.trim(),
            nodeSku: formNodeSku.trim(),
            recommendedNodes: Number(formNodes) || 4,
            interconnect: formInterconnect.trim(),
            security: formSecurity.trim(),
            storage: formStorage.trim()
          };
        }
        return t;
      });
      setTemplates(updated);
      saveAdminControlState({ templates: updated });
      triggerNotice(`Updated template '${formTitle}'`);
    }

    setEditingTemplate(null);
    setIsCreatingNew(false);
  };

  const handleDeleteTemplate = (id: string, title: string) => {
    if (window.confirm(`Delete template '${title}'?`)) {
      const updated = templates.filter((t) => t.id !== id);
      setTemplates(updated);
      saveAdminControlState({ templates: updated });
      triggerNotice(`Deleted template '${title}'`);
    }
  };

  const paramItems: { key: keyof AdminParamConstraints; label: string; desc: string; icon: any }[] = [
    {
      key: 'sddcMgmtCidr',
      label: 'SDDC Management CIDR (/22 or /21)',
      desc: 'Enforces non-overlapping private subnets for ESXi host management, vCenter, NSX-T, and HCX appliances.',
      icon: Network
    },
    {
      key: 'firewallNva',
      label: 'Landing Zone Perimeter Firewall / NVA',
      desc: 'Controls whether a Next-Gen Firewall (Palo Alto VM-Series, FortiGate, Azure Firewall) is mandatory for production topologies.',
      icon: Shield
    },
    {
      key: 'decoupledStorage',
      label: 'Decoupled External Storage (ANF / FSx / GCNV)',
      desc: 'Requires provisioning elastic external NFS datastores to decouple storage growth from compute node scaling.',
      icon: Database
    },
    {
      key: 'cloudNative',
      label: 'Cloud-Native PaaS Services Tier',
      desc: 'Requires architects to specify cloud-native integrations (AKS/GKE/EKS, Managed SQL, Private Endpoints, S3/Blob).',
      icon: Cloud
    },
    {
      key: 'drConfig',
      label: 'Disaster Recovery Replication & SLA',
      desc: 'Requires architects to select a DR replication engine (SRM, Zerto, Nutanix Metro) and define RPO/RTO SLAs.',
      icon: ShieldCheck
    },
    {
      key: 'vdiConfig',
      label: 'Virtual Desktop Infrastructure (VDI Fleet)',
      desc: 'Mandates definition of virtual desktop host pools (AVD, Horizon, Frame) and profile storage shares.',
      icon: Server
    }
  ];

  return (
    <div className="space-y-6 text-xs text-slate-200">
      {/* Studio Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Admin Parameter & Template Control Studio
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-500/40 text-[10px] text-cyan-300 font-mono">
              Enterprise Governance
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed max-w-2xl">
            Configure mandatory vs. optional parameters for the Architecture Wizard, customize baseline hyperscaler templates, and enforce enterprise governance.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 font-semibold text-xs cursor-pointer"
            title="Reset to factory defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Real-time Notification Banner */}
      {saveNotice && (
        <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono flex items-center gap-2 shadow-lg animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{saveNotice}</span>
        </div>
      )}

      {/* SECTION 1: PARAMETER MANDATORY VS. OPTIONAL CONSTRAINTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Parameter Governance & Required Inputs
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Stored in Browser LocalStorage
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {paramItems.map((item) => {
            const Icon = item.icon;
            const isMandatory = constraints[item.key] === 'mandatory';

            return (
              <div
                key={item.key}
                className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  isMandatory
                    ? 'bg-slate-950 border-amber-500/40 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800 opacity-90'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isMandatory ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="font-bold text-white text-xs">{item.label}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold border ${
                        isMandatory
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isMandatory ? 'MANDATORY' : 'OPTIONAL'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-900">
                  <span className="text-[10px] font-mono text-slate-500">
                    Wizard Sizing Rule: {isMandatory ? 'Validation Required' : 'May Be Skipped'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleConstraint(item.key)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition ${
                      isMandatory
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {isMandatory ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                    <span>Set as {isMandatory ? 'Optional' : 'Mandatory'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: ARCHITECTURE TEMPLATES MANAGEMENT */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              Architecture Template Definitions ({templates.length})
            </h4>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer transition shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Template</span>
          </button>
        </div>

        {/* Templates List */}
        <div className="space-y-2.5">
          {templates.map((tpl) => (
            <div
              key={tpl.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-xs">{tpl.title}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300">
                    {tpl.provider}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400">
                    {tpl.badge}
                  </span>
                  {tpl.isCustom && (
                    <span className="px-1.5 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-[9px] font-mono text-purple-300">
                      Custom Admin Template
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 max-w-2xl">{tpl.description}</p>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500 pt-1">
                  <span>Target: <strong className="text-slate-300">{tpl.targetTech}</strong></span>
                  <span>·</span>
                  <span>Node: <strong className="text-slate-300">{tpl.nodeSku}</strong> ({tpl.recommendedNodes} nodes)</span>
                  <span>·</span>
                  <span>Storage: <strong className="text-slate-300">{tpl.storage}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <button
                  type="button"
                  onClick={() => openEditModal(tpl)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Edit2 className="w-3 h-3 text-cyan-400" />
                  <span>Edit</span>
                </button>
                {tpl.isCustom && (
                  <button
                    type="button"
                    onClick={() => handleDeleteTemplate(tpl.id, tpl.title)}
                    className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs cursor-pointer transition"
                    title="Delete custom template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE / EDIT TEMPLATE MODAL */}
      {(isCreatingNew || editingTemplate) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 text-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">
                  {isCreatingNew ? 'Create New Architecture Template' : `Edit Template: ${editingTemplate?.title}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsCreatingNew(false);
                  setEditingTemplate(null);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplateForm} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Template Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. VMware to AVS Gen 2"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Cloud Provider</label>
                  <select
                    value={formProvider}
                    onChange={(e) => setFormProvider(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    <option value="Microsoft Azure">Microsoft Azure</option>
                    <option value="Google Cloud">Google Cloud</option>
                    <option value="Amazon Web Services">Amazon Web Services</option>
                    <option value="Multi-Cloud">Multi-Cloud</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Badge Label</label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. Azure VMware Solution"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Default Target Node SKU</label>
                  <input
                    type="text"
                    value={formNodeSku}
                    onChange={(e) => setFormNodeSku(e.target.value)}
                    placeholder="e.g. AV64 / AV36P Bare-Metal"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-300 font-semibold">Description</label>
                <textarea
                  rows={2}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Architectural pathway scope and deployment pattern..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Source Platform</label>
                  <input
                    type="text"
                    value={formSourceTech}
                    onChange={(e) => setFormSourceTech(e.target.value)}
                    placeholder="e.g. VMware vSphere 7.0/8.0 (ESXi)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Target Platform</label>
                  <input
                    type="text"
                    value={formTargetTech}
                    onChange={(e) => setFormTargetTech(e.target.value)}
                    placeholder="e.g. Azure VMware Solution (AVS Gen 2)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Interconnect Conduit</label>
                  <input
                    type="text"
                    value={formInterconnect}
                    onChange={(e) => setFormInterconnect(e.target.value)}
                    placeholder="e.g. Azure ExpressRoute FastPath (10 Gbps)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Security & NVA Perimeter</label>
                  <input
                    type="text"
                    value={formSecurity}
                    onChange={(e) => setFormSecurity(e.target.value)}
                    placeholder="e.g. Palo Alto VM-Series / Azure Firewall Premium"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Primary Decoupled Storage</label>
                  <input
                    type="text"
                    value={formStorage}
                    onChange={(e) => setFormStorage(e.target.value)}
                    placeholder="e.g. Azure NetApp Files (ANF NFS Datastores)"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold">Baseline Node Count</label>
                  <input
                    type="number"
                    min={3}
                    max={32}
                    value={formNodes}
                    onChange={(e) => setFormNodes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingNew(false);
                    setEditingTemplate(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Template</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
