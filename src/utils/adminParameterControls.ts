export interface AdminTemplateDef {
  id: string;
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
  isCustom?: boolean;
}

export interface AdminParamConstraints {
  sddcMgmtCidr: 'mandatory' | 'optional';
  decoupledStorage: 'mandatory' | 'optional';
  firewallNva: 'mandatory' | 'optional';
  cloudNative: 'mandatory' | 'optional';
  vdiConfig: 'mandatory' | 'optional';
  drConfig: 'mandatory' | 'optional';
}

export interface AdminControlStudioState {
  templates: AdminTemplateDef[];
  constraints: AdminParamConstraints;
  lastUpdated: string;
}

export const STORAGE_KEY_ADMIN_PARAM_CONTROLS = 'zaboraa_admin_param_controls';

export const DEFAULT_ADMIN_TEMPLATES: AdminTemplateDef[] = [
  {
    id: 'vmware-to-avs',
    title: 'VMware to AVS',
    provider: 'Microsoft Azure',
    badge: 'Azure VMware Solution',
    description: 'Direct lift-and-shift of VMware vSphere workloads into Microsoft Azure bare-metal SDDC with native Azure vNet integration.',
    sourceTech: 'VMware vSphere 7.0/8.0 (ESXi)',
    targetTech: 'Azure VMware Solution (AVS Gen 2)',
    nodeSku: 'AV64 / AV36P Dedicated Bare-Metal',
    recommendedNodes: 4,
    interconnect: 'Azure ExpressRoute FastPath (10 Gbps)',
    security: 'Palo Alto VM-Series / Azure Firewall Premium',
    storage: 'Azure NetApp Files (ANF NFS Datastores)'
  },
  {
    id: 'vmware-to-nc2',
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
    storage: 'Nutanix DSF (Distributed Storage Fabric)'
  },
  {
    id: 'nutanix-to-nc2',
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
    storage: 'Native AOS Multi-Cluster DSF'
  },
  {
    id: 'vmware-to-gcve',
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
    storage: 'Google Cloud NetApp Volumes (GCNV NFS)'
  },
  {
    id: 'vmware-to-vmc',
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
    storage: 'Amazon FSx for NetApp ONTAP (NFS)'
  }
];

export const DEFAULT_ADMIN_CONSTRAINTS: AdminParamConstraints = {
  sddcMgmtCidr: 'mandatory',
  decoupledStorage: 'optional',
  firewallNva: 'mandatory',
  cloudNative: 'optional',
  vdiConfig: 'optional',
  drConfig: 'optional'
};

export function getAdminControlState(): AdminControlStudioState {
  if (typeof window === 'undefined') {
    return {
      templates: DEFAULT_ADMIN_TEMPLATES,
      constraints: DEFAULT_ADMIN_CONSTRAINTS,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY_ADMIN_PARAM_CONTROLS);
    if (!raw) {
      return {
        templates: DEFAULT_ADMIN_TEMPLATES,
        constraints: DEFAULT_ADMIN_CONSTRAINTS,
        lastUpdated: new Date().toISOString()
      };
    }
    const parsed = JSON.parse(raw);
    return {
      templates: Array.isArray(parsed.templates) && parsed.templates.length > 0 ? parsed.templates : DEFAULT_ADMIN_TEMPLATES,
      constraints: parsed.constraints ? { ...DEFAULT_ADMIN_CONSTRAINTS, ...parsed.constraints } : DEFAULT_ADMIN_CONSTRAINTS,
      lastUpdated: parsed.lastUpdated || new Date().toISOString()
    };
  } catch (e) {
    console.warn('Failed to parse admin parameter controls from localStorage:', e);
    return {
      templates: DEFAULT_ADMIN_TEMPLATES,
      constraints: DEFAULT_ADMIN_CONSTRAINTS,
      lastUpdated: new Date().toISOString()
    };
  }
}

export function saveAdminControlState(state: Partial<AdminControlStudioState>): AdminControlStudioState {
  const current = getAdminControlState();
  const updated: AdminControlStudioState = {
    templates: state.templates || current.templates,
    constraints: state.constraints || current.constraints,
    lastUpdated: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_PARAM_CONTROLS, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('zaboraa:admin-params-changed', { detail: updated }));
    } catch (e) {
      console.error('Failed to save admin parameter controls to localStorage:', e);
    }
  }

  return updated;
}

export function resetAdminControlState(): AdminControlStudioState {
  const resetState: AdminControlStudioState = {
    templates: DEFAULT_ADMIN_TEMPLATES,
    constraints: DEFAULT_ADMIN_CONSTRAINTS,
    lastUpdated: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_PARAM_CONTROLS);
      window.dispatchEvent(new CustomEvent('zaboraa:admin-params-changed', { detail: resetState }));
    } catch (e) {
      console.error('Failed to reset admin parameter controls:', e);
    }
  }

  return resetState;
}
