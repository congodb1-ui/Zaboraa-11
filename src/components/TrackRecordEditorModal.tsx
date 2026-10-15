import React, { useState, useEffect } from 'react';
import { useCustomization } from '../context/CustomizationContext';
import { CaseStudy } from '../types/siteData';
import {
  X,
  CheckCircle2,
  Trash2,
  Plus,
  ShieldCheck,
  Save,
  Briefcase,
  Layers,
  Sparkles,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export const TrackRecordEditorModal: React.FC = () => {
  const {
    isTrackRecordModalOpen,
    setIsTrackRecordModalOpen,
    activeEditCaseStudy,
    setActiveEditCaseStudy,
    addCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    siteConfig
  } = useCustomization();

  const isEditing = Boolean(activeEditCaseStudy);

  const [sector, setSector] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [verifiedBadge, setVerifiedBadge] = useState('VERIFIED');
  const [vms, setVms] = useState('');
  const [downtime, setDowntime] = useState('');
  const [costReduction, setCostReduction] = useState('');
  const [timeline, setTimeline] = useState('');
  const [solutions, setSolutions] = useState<string[]>([]);
  const [newSolutionInput, setNewSolutionInput] = useState('');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (activeEditCaseStudy) {
      setSector(activeEditCaseStudy.sector || 'Banking & Financial Services');
      setTitle(activeEditCaseStudy.title || '');
      setSubtitle(activeEditCaseStudy.subtitle || '');
      setSummary(activeEditCaseStudy.summary || '');
      setVerifiedBadge(activeEditCaseStudy.verifiedBadge || 'VERIFIED');
      setVms(activeEditCaseStudy.metrics?.vms || '1,200+ VMs');
      setDowntime(activeEditCaseStudy.metrics?.downtime || '0 Unplanned Downtime');
      setCostReduction(activeEditCaseStudy.metrics?.costReduction || '-30% TCO Savings');
      setTimeline(activeEditCaseStudy.metrics?.timeline || '90 Days');
      setSolutions(activeEditCaseStudy.architectureSolution || []);
    } else {
      // New case study template
      setSector('Global Enterprise Services');
      setTitle('Multi-Cloud SDDC Modernization & Zero-Downtime Migration');
      setSubtitle('Hybrid Hyperscaler Architecture');
      setSummary('Complete enterprise cloud migration delivering zero unplanned application downtime, regulatory data residency, and decoupled external storage economics.');
      setVerifiedBadge('VERIFIED');
      setVms('1,500+ VMs / 2.8 PB');
      setDowntime('0 Unplanned Downtime');
      setCostReduction('-35% Annual TCO');
      setTimeline('120 Days');
      setSolutions([
        'ExpressRoute FastPath and BGP route convergence across dual carrier meet-me rooms',
        'Decoupled external NFS datastores to reduce core host licensing requirements',
        'HCX Replication-Assisted vMotion (RAV) waves scheduled within maintenance windows',
        'Automated SRM disaster recovery runbooks with cross-region replication'
      ]);
    }
  }, [activeEditCaseStudy, isTrackRecordModalOpen]);

  if (!isTrackRecordModalOpen) return null;

  const handleAddSolution = () => {
    if (!newSolutionInput.trim()) return;
    setSolutions(prev => [...prev, newSolutionInput.trim()]);
    setNewSolutionInput('');
  };

  const handleRemoveSolution = (index: number) => {
    setSolutions(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a title for the track record.');
      return;
    }

    const payload: CaseStudy = {
      id: activeEditCaseStudy ? activeEditCaseStudy.id : `cs-${Date.now()}`,
      sector: sector.trim() || 'Enterprise Cloud Infrastructure',
      title: title.trim(),
      subtitle: subtitle.trim() || 'Verified Cloud Architecture',
      summary: summary.trim(),
      verifiedBadge: verifiedBadge.trim() || 'VERIFIED',
      metrics: {
        vms: vms.trim() || '1,000+ VMs',
        downtime: downtime.trim() || '0 Downtime',
        costReduction: costReduction.trim() || '-30% TCO',
        timeline: timeline.trim() || '90 Days'
      },
      architectureSolution: solutions.length > 0 ? solutions : ['Enterprise-grade architecture design and validated cutover.']
    };

    if (isEditing && activeEditCaseStudy) {
      updateCaseStudy(activeEditCaseStudy.id, payload);
      setNotification(`Updated "${payload.title}" successfully!`);
    } else {
      addCaseStudy(payload);
      setNotification(`Added new track record "${payload.title}"!`);
    }

    setTimeout(() => {
      setNotification(null);
      setIsTrackRecordModalOpen(false);
      setActiveEditCaseStudy(null);
    }, 1200);
  };

  const handleDelete = () => {
    if (!activeEditCaseStudy) return;
    if (window.confirm(`Are you sure you want to delete "${activeEditCaseStudy.title}"?`)) {
      deleteCaseStudy(activeEditCaseStudy.id);
      setIsTrackRecordModalOpen(false);
      setActiveEditCaseStudy(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div
        data-theme-container="dark"
        className="dark-card dark-feature-container relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-5 sm:p-7 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-xs text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isEditing ? 'Edit Enterprise Track Record' : 'Add New Enterprise Track Record'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 uppercase">
                  ADMIN ONLY
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Author and publish verified production case studies to the home page track record section.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsTrackRecordModalOpen(false);
              setActiveEditCaseStudy(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {notification && (
          <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center gap-2 shadow-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Section 1: Overview & Sector */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Client Sector / Industry Taxonomy
                </label>
                <input
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="e.g. Banking & Financial Services"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Verification Badge Text
                </label>
                <input
                  type="text"
                  value={verifiedBadge}
                  onChange={(e) => setVerifiedBadge(e.target.value)}
                  placeholder="e.g. VERIFIED PRODUCTION"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Case Study Headline / Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Global Tier-1 Banking SDDC Evacuation to Azure AVS"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 text-sm font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Executive Summary
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="Brief description of the enterprise business requirements, migration challenges, and architectural achievement."
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Section 2: Concrete Quantitative Metrics */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-slate-300 font-semibold flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Verified Quantitative Proof Metrics</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                  Workload Scale
                </label>
                <input
                  type="text"
                  value={vms}
                  onChange={(e) => setVms(e.target.value)}
                  placeholder="1,850+ VMs / 4.2 PB"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                  Cutover Downtime
                </label>
                <input
                  type="text"
                  value={downtime}
                  onChange={(e) => setDowntime(e.target.value)}
                  placeholder="0.0 ms Unplanned"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-emerald-400 font-mono text-xs font-bold focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                  Cost / TCO Impact
                </label>
                <input
                  type="text"
                  value={costReduction}
                  onChange={(e) => setCostReduction(e.target.value)}
                  placeholder="-34% Licensing TCO"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-xs font-bold focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-mono mb-1">
                  Delivery Window
                </label>
                <input
                  type="text"
                  value={timeline}
                  onChange={(e) => setTimeline(e.target.value)}
                  placeholder="4.5 Months"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-mono text-xs focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Engineering Solutions (Dynamic List) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Key Engineering Solutions ({solutions.length})</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">Bullet-Point Takeaways</span>
            </div>

            <div className="space-y-2">
              {solutions.map((sol, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 group"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <input
                    type="text"
                    value={sol}
                    onChange={(e) => {
                      const updated = [...solutions];
                      updated[idx] = e.target.value;
                      setSolutions(updated);
                    }}
                    className="flex-1 bg-transparent border-none text-slate-200 focus:outline-none focus:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSolution(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400 opacity-60 group-hover:opacity-100 transition-opacity"
                    title="Remove solution"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Solution Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newSolutionInput}
                onChange={(e) => setNewSolutionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSolution();
                  }
                }}
                placeholder="Add architectural solution point (press Enter)..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleAddSolution}
                className="px-3 py-2 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-600/60 text-cyan-200 font-semibold flex items-center gap-1 cursor-pointer transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {isEditing ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3.5 py-2 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-600/50 text-rose-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                <span>Delete Track Record</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsTrackRecordModalOpen(false);
                  setActiveEditCaseStudy(null);
                }}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Publish Track Record'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
