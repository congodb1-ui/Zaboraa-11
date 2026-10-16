export interface AdminParameterConstraint {
  id: string;
  label: string;
  category: 'source' | 'destination' | 'dr' | 'interconnect' | 'security' | 'vdi';
  status: 'mandatory' | 'optional';
  description: string;
}

export interface AdminTemplateConfig {
  id: string;
  title: string;
  provider: 'Microsoft Azure' | 'Google Cloud' | 'Amazon Web Services' | 'Nutanix Mesh';
  badge: string;
  sourceTech: string;
  targetTech: string;
  nodeSku: string;
  recommendedNodes: number;
  interconnect: string;
  security: string;
  storage: string;
  enabled: boolean;
}

export interface AdminControlsState {
  parameters: AdminParameterConstraint[];
  templates: AdminTemplateConfig[];
  updatedAt: string;
}

export const DEFAULT_ADMIN_PARAMETERS: AdminParameterConstraint[] = [
  {
    id: 'sddcMgmtCidr',
    label: 'Target SDDC Management CIDR (/22)',
    category: 'destination',
    status: 'mandatory',
    description: 'Requires a verified non-overlapping IPv4 CIDR allocation before design finalization.'
  },
  {
    id: 'targetNodeCount',
    label: 'Target SDDC Node Count',
    category: 'destination',
    status: 'mandatory',
    description: 'Enforces minimum cluster quorum (3 nodes for VMC, 3-4 nodes for AVS / NC2 / GCVE).'
  },
  {
    id: 'drEngine',
    label: 'Disaster Recovery Replication Engine',
    category: 'dr',
    status: 'mandatory',
    description: 'Mandatory failover runbook engine selection when Disaster Recovery is in scope.'
  },
  {
    id: 'sourceMgmtCidr',
    label: 'Source Datacenter Management CIDR',
    category: 'source',
    status: 'optional',
    description: 'Optional on-premises subnet verification for pre-flight collision checks.'
  },
  {
    id: 'interconnectCircuit',
    label: 'Dedicated Cloud Interconnect Circuit',
    category: 'interconnect',
    status: 'mandatory',
    description: 'Mandates selection of dedicated line-rate circuit (ExpressRoute, Direct Connect, Interconnect).'
  },
  {
    id: 'securityFirewall',
    label: 'Landing Zone Perimeter NVA / Firewall',
    category: 'security',
    status: 'optional',
    description: 'Next-Gen Firewall NVA cluster in transit hub.'
  },
  {
    id: 'decoupledStorage',
    label: 'Decoupled External Storage Datastore',
    category: 'destination',
    status: 'optional',
    description: 'External NFS storage datastores (ANF, FSx ONTAP, GCNV).'
  },
  {
    id: 'vdiPlatform',
    label: 'Virtual Desktop Infrastructure (VDI)',
    category: 'destination',
    status: 'optional',
    description: 'Optional enterprise desktop delivery tier.'
  }
];

export const DEFAULT_ADMIN_TEMPLATES: AdminTemplateConfig[] = [
  {
    id: 'vmware-to-avs',
    title: 'VMware to AVS',
    provider: 'Microsoft Azure',
    badge: 'Azure VMware Solution',
    sourceTech: 'VMware vSphere 7.0/8.0 (ESXi)',
    targetTech: 'Azure VMware Solution (AVS Gen 2)',
    nodeSku: 'AV36P / AV64 Dedicated Bare-Metal',
    recommendedNodes: 4,
    interconnect: 'ExpressRoute FastPath (10 Gbps)',
    security: 'Palo Alto VM-Series / Azure Firewall Premium',
    storage: 'Azure NetApp Files (ANF NFS Datastores)',
    enabled: true
  },
  {
    id: 'vmware-to-nc2',
    title: 'VMware to NC2 on Azure',
    provider: 'Microsoft Azure',
    badge: 'Nutanix Cloud Clusters',
    sourceTech: 'VMware vSphere (ESXi Clusters)',
    targetTech: 'Nutanix NC2 on Azure Bare-Metal',
    nodeSku: 'AN36P (36 cores, 768GB RAM, 19.2TB NVMe)',
    recommendedNodes: 4,
    interconnect: 'ExpressRoute FastPath with Nutanix Flow VPC',
    security: 'Nutanix Flow Security + Azure NVA',
    storage: 'Nutanix DSF (Distributed Storage Fabric)',
    enabled: true
  },
  {
    id: 'nutanix-to-nc2',
    title: 'Nutanix to NC2 on Azure',
    provider: 'Microsoft Azure',
    badge: 'Hybrid Nutanix Mesh',
    sourceTech: 'On-Premises Nutanix AOS / AHV',
    targetTech: 'Nutanix NC2 on Azure (Prism Central)',
    nodeSku: 'AN36P / AN64 Dedicated Bare-Metal',
    recommendedNodes: 4,
    interconnect: 'ExpressRoute FastPath Direct Peering',
    security: 'Nutanix Flow Network Microsegmentation',
    storage: 'Native AOS Multi-Cluster DSF',
    enabled: true
  },
  {
    id: 'vmware-to-gcve',
    title: 'VMware to GCVE',
    provider: 'Google Cloud',
    badge: 'Google Cloud VMware Engine',
    sourceTech: 'VMware vSphere Private SDDC',
    targetTech: 'Google Cloud VMware Engine (GCVE)',
    nodeSku: 've1-standard-72 (72 cores, 768GB RAM)',
    recommendedNodes: 4,
    interconnect: 'Google Cloud Dedicated Interconnect (10G)',
    security: 'Google Cloud Armor & Next-Gen NVA',
    storage: 'Google Cloud NetApp Volumes (GCNV NFS)',
    enabled: true
  },
  {
    id: 'vmware-to-vmc',
    title: 'VMware to VMC on AWS',
    provider: 'Amazon Web Services',
    badge: 'VMware Cloud on AWS',
    sourceTech: 'Enterprise vCenter & vSphere',
    targetTech: 'VMware Cloud on AWS (VMC)',
    nodeSku: 'i4i.metal (64 cores, 1024GB RAM, NVMe)',
    recommendedNodes: 3,
    interconnect: 'AWS Direct Connect Gateway (10G)',
    security: 'AWS Network Firewall & Fortinet FortiGate',
    storage: 'Amazon FSx for NetApp ONTAP (NFS)',
    enabled: true
  }
];

const STORAGE_KEY = 'zaboraa_admin_param_controls';

export function getAdminParamControls(): AdminControlsState {
  if (typeof window === 'undefined') {
    return {
      parameters: DEFAULT_ADMIN_PARAMETERS,
      templates: DEFAULT_ADMIN_TEMPLATES,
      updatedAt: new Date().toISOString()
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        parameters: DEFAULT_ADMIN_PARAMETERS,
        templates: DEFAULT_ADMIN_TEMPLATES,
        updatedAt: new Date().toISOString()
      };
    }
    const parsed = JSON.parse(raw);
    return {
      parameters: Array.isArray(parsed.parameters) && parsed.parameters.length > 0 ? parsed.parameters : DEFAULT_ADMIN_PARAMETERS,
      templates: Array.isArray(parsed.templates) && parsed.templates.length > 0 ? parsed.templates : DEFAULT_ADMIN_TEMPLATES,
      updatedAt: parsed.updatedAt || new Date().toISOString()
    };
  } catch (err) {
    console.warn('Failed to parse admin parameter controls, using defaults:', err);
    return {
      parameters: DEFAULT_ADMIN_PARAMETERS,
      templates: DEFAULT_ADMIN_TEMPLATES,
      updatedAt: new Date().toISOString()
    };
  }
}

export function saveAdminParamControls(controls: AdminControlsState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      ...controls,
      updatedAt: new Date().toISOString()
    }));
  } catch (err) {
    console.warn('Failed to save admin parameter controls to localStorage:', err);
  }
}

export function resetAdminParamControls(): AdminControlsState {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
  return {
    parameters: DEFAULT_ADMIN_PARAMETERS,
    templates: DEFAULT_ADMIN_TEMPLATES,
    updatedAt: new Date().toISOString()
  };
}
