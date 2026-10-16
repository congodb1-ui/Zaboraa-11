import React from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Cloud,
  CheckCircle2,
  Cpu,
  Layers,
  Network,
  Shield,
  HardDrive,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import {
  WizardState,
  ArchitectureTemplateChoice
} from '../../types/wizardStateAdapter';
import { ArchitectureTemplateId } from '../../types/multiCloudBlueprint';

interface Step2SelectTemplateProps {
  wizardState: WizardState;
  onChange: (updater: (prev: WizardState) => WizardState) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface TemplateOption {
  id: ArchitectureTemplateChoice;
  canonicalTemplateId: ArchitectureTemplateId;
  title: string;
  provider: 'Microsoft Azure' | 'Google Cloud' | 'Amazon Web Services' | 'Multi-Cloud';
  badge: string;
  description: string;
  sourceTech: string;
  targetTech: string;
  nodeSku: string;
  recommendedNodes: number;
  interconnect: string;
  security: string;
  storage: string;
  tagColor: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'vmware-to-avs',
    canonicalTemplateId: 'avs',
    title: 'VMware to AVS',
    provider: 'Microsoft Azure',
    badge: 'Azure VMware Solution',
    description: 'Direct lift-and-shift of VMware vSphere workloads into Microsoft Azure bare-metal SDDC with native Azure vNet integration.',
    sourceTech: 'VMware vSphere 7.0/8.0 (ESXi)',
    targetTech: 'Azure VMware Solution (AVS Gen 2)',
    nodeSku: 'AV36P / AV64 Dedicated Bare-Metal',
    recommendedNodes: 4,
    interconnect: 'Azure ExpressRoute FastPath (10 Gbps)',
    security: 'Palo Alto VM-Series / Azure Firewall Premium',
    storage: 'Azure NetApp Files (ANF NFS Datastores)',
    tagColor: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/40'
  },
  {
    id: 'vmware-to-nc2',
    canonicalTemplateId: 'vmware-to-nc2',
    title: 'VMware to NC2 on Azure',
    provider: 'Microsoft Azure',
    badge: 'Nutanix Cloud Clusters',
    description: 'Cross-hypervisor migration from legacy VMware ESXi into Nutanix AHV running on dedicated Azure bare-metal infrastructure via Nutanix Move.',
    sourceTech: 'VMware vSphere (ESXi Clusters)',
    targetTech: 'Nutanix NC2 on Azure Bare-Metal',
    nodeSku: 'AN36P (36 cores, 768GB RAM, 19.2TB NVMe)',
    recommendedNodes: 4,
    interconnect: 'Azure ExpressRoute FastPath with Flow VPC',
    security: 'Nutanix Flow Security + Azure NVA',
    storage: 'Nutanix DSF (Distributed Storage Fabric)',
    tagColor: 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40'
  },
  {
    id: 'nutanix-to-nc2',
    canonicalTemplateId: 'nutanix-to-nc2',
    title: 'Nutanix to NC2 on Azure',
    provider: 'Microsoft Azure',
    badge: 'Hybrid Nutanix Mesh',
    description: 'Unified Nutanix-to-Nutanix extension: extend on-premises Prism Central and AHV clusters directly into Azure bare-metal instances.',
    sourceTech: 'On-Premises Nutanix AOS / AHV',
    targetTech: 'Nutanix NC2 on Azure (Prism Central)',
    nodeSku: 'AN36P / AN64 Dedicated Bare-Metal',
    recommendedNodes: 4,
    interconnect: 'Azure ExpressRoute FastPath Direct Peering',
    security: 'Nutanix Flow Network Microsegmentation',
    storage: 'Native AOS Multi-Cluster DSF',
    tagColor: 'border-teal-500/40 text-teal-300 bg-teal-950/40'
  },
  {
    id: 'vmware-to-gcve',
    canonicalTemplateId: 'gcve',
    title: 'VMware to GCVE',
    provider: 'Google Cloud',
    badge: 'Google Cloud VMware Engine',
    description: 'Enterprise VMware deployment directly on Google Cloud dedicated infrastructure with 100 Gbps private services access to BigQuery and Vertex AI.',
    sourceTech: 'VMware vSphere Private SDDC',
    targetTech: 'Google Cloud VMware Engine (GCVE)',
    nodeSku: 've1-standard-72 (72 cores, 768GB RAM)',
    recommendedNodes: 4,
    interconnect: 'Google Cloud Dedicated Interconnect (10G)',
    security: 'Google Cloud Armor & Next-Gen NVA',
    storage: 'Google Cloud NetApp Volumes (GCNV NFS)',
    tagColor: 'border-blue-500/40 text-blue-300 bg-blue-950/40'
  },
  {
    id: 'vmware-to-vmc',
    canonicalTemplateId: 'vmc-aws',
    title: 'VMware to VMC on AWS',
    provider: 'Amazon Web Services',
    badge: 'VMware Cloud on AWS',
    description: 'VMware enterprise SDDC integrated into AWS global infrastructure with 25 Gbps Connected VPC Elastic Network Interface (ENI) transport.',
    sourceTech: 'Enterprise vCenter & vSphere',
    targetTech: 'VMware Cloud on AWS (VMC)',
    nodeSku: 'i4i.metal (64 cores, 1024GB RAM, NVMe)',
    recommendedNodes: 3,
    interconnect: 'AWS Direct Connect Gateway (10G)',
    security: 'AWS Network Firewall & Fortinet FortiGate',
    storage: 'Amazon FSx for NetApp ONTAP (NFS)',
    tagColor: 'border-amber-500/40 text-amber-300 bg-amber-950/40'
  }
];

export const Step2SelectTemplate: React.FC<Step2SelectTemplateProps> = ({
  wizardState,
  onChange,
  onNext,
  onPrev
}) => {
  const selectedTemplate = wizardState.templateChoice || 'vmware-to-avs';

  const handleSelectTemplate = (template: TemplateOption) => {
    onChange((prev) => {
      // Map template selection to state parameters
      let targetPlatform: WizardState['targetPlatform'] = 'avs-gen2';
      let nodeSku = 'AV36P';
      let targetNodes = 4;
      let decoupledStorageProvider = 'Azure NetApp Files (ANF NFS Datastore)';
      let firewallProvider = 'Palo Alto Networks VM-Series';
      let connectivityCarrier = 'Direct Circuits with FastPath / Global Reach';
      let landingZone = 'Azure Virtual WAN Hub-and-Spoke';
      let drEngine = 'VMware SRM + vSphere Replication';
      let interconnectType = 'Azure ExpressRoute FastPath (10 Gbps)';
      let sourcePlatform = prev.sourcePlatform;
      let selectedPublicProviders: WizardState['selectedPublicProviders'] = ['azure'];
      let vdiPlatform: WizardState['vdiConfig']['platform'] = 'Azure Virtual Desktop (AVD)';
      let cloudNativeServices: string[] = [];

      if (template.id === 'vmware-to-avs') {
        targetPlatform = 'avs-gen2';
        nodeSku = 'AV64';
        targetNodes = 4;
        sourcePlatform = 'vmware';
        selectedPublicProviders = ['azure'];
        decoupledStorageProvider = 'Azure NetApp Files (ANF NFS Datastore)';
        interconnectType = 'Azure ExpressRoute FastPath (10 Gbps)';
        landingZone = 'Azure Virtual WAN Hub-and-Spoke';
        firewallProvider = 'Palo Alto Networks VM-Series';
        drEngine = 'VMware Site Recovery Manager (SRM) + vSphere Replication';
        vdiPlatform = 'Azure Virtual Desktop (AVD)';
        cloudNativeServices = [
          'Azure Virtual Network Peering & Transit',
          'Managed Azure Kubernetes (AKS)',
          'Azure SQL Managed Instance',
          'Azure Storage Accounts & Blob Data',
          'Azure Private Link & Private Endpoints'
        ];
      } else if (template.id === 'vmware-to-nc2') {
        targetPlatform = 'nc2-azure';
        nodeSku = 'AN36P';
        targetNodes = 4;
        sourcePlatform = 'vmware';
        selectedPublicProviders = ['azure'];
        decoupledStorageProvider = 'Native Nutanix DSF Storage';
        interconnectType = 'Azure ExpressRoute FastPath with Flow VPC';
        landingZone = 'Azure Virtual WAN Hub-and-Spoke';
        firewallProvider = 'Nutanix Flow Security + Azure NVA';
        drEngine = 'Nutanix Move Cross-Hypervisor';
        vdiPlatform = 'Nutanix Frame';
        cloudNativeServices = [
          'Azure Virtual Network Peering & Transit',
          'Azure Storage Accounts & Blob Data',
          'Azure Private Link & Private Endpoints'
        ];
      } else if (template.id === 'nutanix-to-nc2') {
        targetPlatform = 'nc2-azure';
        nodeSku = 'AN36P';
        targetNodes = 4;
        sourcePlatform = 'nutanix';
        selectedPublicProviders = ['azure'];
        decoupledStorageProvider = 'Native Nutanix DSF Storage';
        interconnectType = 'Azure ExpressRoute FastPath Direct Peering';
        landingZone = 'Azure Virtual WAN Hub-and-Spoke';
        firewallProvider = 'Nutanix Flow Network Microsegmentation';
        drEngine = 'Nutanix Protection Domains (NearSync & Metro)';
        vdiPlatform = 'Nutanix Frame';
        cloudNativeServices = [
          'Azure Virtual Network Peering & Transit',
          'Azure Storage Accounts & Blob Data',
          'Azure Private Link & Private Endpoints'
        ];
      } else if (template.id === 'vmware-to-gcve') {
        targetPlatform = 'gcve';
        nodeSku = 've1-standard-72';
        targetNodes = 4;
        sourcePlatform = 'vmware';
        selectedPublicProviders = ['gcp'];
        decoupledStorageProvider = 'Google Cloud NetApp Volumes (GCNV NFS Datastore)';
        interconnectType = 'Google Cloud Dedicated Interconnect (10G)';
        landingZone = 'Google Cloud Shared VPC + Cloud NCC';
        firewallProvider = 'Google Cloud Armor & Next-Gen NVA';
        drEngine = 'Zerto Continuous Data Protection (CDP)';
        vdiPlatform = 'Citrix DaaS';
        cloudNativeServices = [
          'Google Cloud Shared VPC & NCC',
          'Google Kubernetes Engine (GKE)',
          'Google Cloud SQL Managed Instance',
          'Google Cloud Storage (GCS)',
          'BigQuery & Vertex AI Analytics'
        ];
      } else if (template.id === 'vmware-to-vmc') {
        targetPlatform = 'vmc-aws';
        nodeSku = 'i4i.metal';
        targetNodes = 3;
        sourcePlatform = 'vmware';
        selectedPublicProviders = ['aws'];
        decoupledStorageProvider = 'Amazon FSx for NetApp ONTAP (NFS Datastore)';
        interconnectType = 'AWS Direct Connect Gateway (10G)';
        landingZone = 'AWS Transit Gateway (TGW) Hub';
        firewallProvider = 'Fortinet FortiGate-VM';
        drEngine = 'VMware Site Recovery Manager (SRM) + vSphere Replication';
        vdiPlatform = 'Amazon WorkSpaces';
        cloudNativeServices = [
          'AWS Transit Gateway (TGW) & Connected VPC',
          'Amazon Elastic Kubernetes Service (EKS)',
          'Amazon Aurora PostgreSQL / RDS',
          'Amazon S3 Object Storage & Glacier'
        ];
      }

      // Automatically purge cross-vendor incompatible settings
      return {
        ...prev,
        templateChoice: template.id,
        activeTemplate: template.canonicalTemplateId,
        sourcePlatform,
        selectedPublicProviders,
        targetPlatform,
        targetNodeSku: nodeSku,
        targetNodeCount: targetNodes,
        connectivityCarrier,
        landingZonePattern: landingZone,
        firewallProvider,
        interconnectConfig: {
          ...prev.interconnectConfig,
          type: interconnectType
        },
        cloudNativeConfig: {
          selectedServices: cloudNativeServices
        },
        vdiConfig: {
          ...prev.vdiConfig,
          platform: vdiPlatform
        },
        otherServicesConfig: {
          ...prev.otherServicesConfig,
          decoupledStorageProvider
        },
        drConfig: {
          ...prev.drConfig,
          engine: drEngine
        }
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-semibold tracking-wider uppercase">
          <span>Step 02 / 04</span>
          <span>·</span>
          <span>Architecture Template</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Select Your Architecture Template
        </h2>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          Choose the architectural pathway matching your migration origin and target cloud platform. This configures the bare-metal hardware classes, high-speed transit topology, and native service pairings.
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TEMPLATE_OPTIONS.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;

          return (
            <div
              key={tpl.id}
              onClick={() => handleSelectTemplate(tpl)}
              className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between group ${
                isSelected
                  ? 'bg-gradient-to-br from-slate-900 via-cyan-950/30 to-slate-900 border-cyan-500 shadow-xl shadow-cyan-500/10 ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border inline-block mb-1.5 ${tpl.tagColor}`}>
                      {tpl.badge}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition">
                      {tpl.title}
                    </h3>
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

                <p className="text-xs text-slate-300 leading-relaxed min-h-[48px]">
                  {tpl.description}
                </p>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 space-y-1.5 text-[11px] font-mono">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Source:</span>
                    <span className="text-slate-200 truncate max-w-[170px]">{tpl.sourceTech}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Target SDDC:</span>
                    <span className="text-cyan-300 truncate max-w-[170px]">{tpl.targetTech}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Node SKU:</span>
                    <span className="text-slate-200 truncate max-w-[170px]">{tpl.nodeSku}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Interconnect:</span>
                    <span className="text-slate-300 truncate max-w-[170px]">{tpl.interconnect}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-2 border border-slate-700 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Objectives</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <span>Continue to Select Components</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
