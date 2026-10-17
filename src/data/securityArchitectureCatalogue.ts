/**
 * Security Architecture Catalogue
 * Multi-Vendor Firewall Models, NSX Distributed Firewall,
 * External Application Publishing (VAP), and Load Balancers.
 */

export interface FirewallModelSpec {
  vendor: 'Palo Alto Networks' | 'Fortinet' | 'Check Point' | 'Cisco' | 'Microsoft Azure' | 'Amazon Web Services' | 'Google Cloud' | 'Custom / Unlisted';
  model: string;
  displayName: string;
  throughputGbps: number;
  maxSessions: string;
  ipsecVpnThroughputGbps: number;
  recommendedDeploymentTopology: 'Active/Passive' | 'Active/Active ECMP' | 'Gateway Load Balancer (GWLB)' | 'Azure Route Server (ARS)' | 'Native Managed Fabric';
  supportedClouds: Array<'azure' | 'aws' | 'gcp' | 'on-prem'>;
  suitableTiers: Array<'external' | 'internal' | 'both'>;
  verified: boolean;
  notes: string;
}

export const FIREWALL_MODEL_CATALOGUE: FirewallModelSpec[] = [
  // Palo Alto Networks
  {
    vendor: 'Palo Alto Networks',
    model: 'VM-100',
    displayName: 'Palo Alto VM-100 (2 Cores, 6.5GB RAM)',
    throughputGbps: 2.0,
    maxSessions: '250,000',
    ipsecVpnThroughputGbps: 1.0,
    recommendedDeploymentTopology: 'Active/Passive',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['internal', 'both'],
    verified: true,
    notes: 'Entry-level VM-Series virtual firewall for branch or internal segmentation'
  },
  {
    vendor: 'Palo Alto Networks',
    model: 'VM-300',
    displayName: 'Palo Alto VM-300 (4 Cores, 9GB RAM)',
    throughputGbps: 4.0,
    maxSessions: '800,000',
    ipsecVpnThroughputGbps: 2.5,
    recommendedDeploymentTopology: 'Active/Active ECMP',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'Standard enterprise NVA for external perimeter and cross-VNet inspection'
  },
  {
    vendor: 'Palo Alto Networks',
    model: 'VM-500',
    displayName: 'Palo Alto VM-500 (8 Cores, 16GB RAM)',
    throughputGbps: 8.0,
    maxSessions: '2,000,000',
    ipsecVpnThroughputGbps: 5.0,
    recommendedDeploymentTopology: 'Active/Active ECMP',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'both'],
    verified: true,
    notes: 'High-throughput enterprise gateway with PAN-OS App-ID and threat prevention'
  },
  {
    vendor: 'Palo Alto Networks',
    model: 'VM-700',
    displayName: 'Palo Alto VM-700 (16 Cores, 56GB RAM)',
    throughputGbps: 16.0,
    maxSessions: '10,000,000',
    ipsecVpnThroughputGbps: 10.0,
    recommendedDeploymentTopology: 'Gateway Load Balancer (GWLB)',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'both'],
    verified: true,
    notes: 'Ultra high-performance carrier and large-scale cloud interconnect tier'
  },
  {
    vendor: 'Palo Alto Networks',
    model: 'PA-3410',
    displayName: 'Palo Alto PA-3410 (Physical 1RU Appliance)',
    throughputGbps: 11.5,
    maxSessions: '2,100,000',
    ipsecVpnThroughputGbps: 6.2,
    recommendedDeploymentTopology: 'Active/Passive',
    supportedClouds: ['on-prem'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'On-premises datacenter edge appliance with dedicated hardware offload'
  },

  // Fortinet
  {
    vendor: 'Fortinet',
    model: 'FortiGate-VM02',
    displayName: 'FortiGate-VM02 (2 vCPU, 4GB RAM)',
    throughputGbps: 3.5,
    maxSessions: '500,000',
    ipsecVpnThroughputGbps: 2.0,
    recommendedDeploymentTopology: 'Active/Passive',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['internal', 'both'],
    verified: true,
    notes: 'FortiOS virtual appliance for lightweight segmentation'
  },
  {
    vendor: 'Fortinet',
    model: 'FortiGate-VM04',
    displayName: 'FortiGate-VM04 (4 vCPU, 8GB RAM)',
    throughputGbps: 7.5,
    maxSessions: '1,500,000',
    ipsecVpnThroughputGbps: 4.5,
    recommendedDeploymentTopology: 'Active/Active ECMP',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'Balanced mid-tier cloud firewall with FortiGuard IPS and SSL inspection'
  },
  {
    vendor: 'Fortinet',
    model: 'FortiGate-VM08',
    displayName: 'FortiGate-VM08 (8 vCPU, 16GB RAM)',
    throughputGbps: 15.0,
    maxSessions: '3,000,000',
    ipsecVpnThroughputGbps: 9.0,
    recommendedDeploymentTopology: 'Active/Active ECMP',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'both'],
    verified: true,
    notes: 'Enterprise high-scale firewall for transit hub routing and deep packet inspection'
  },
  {
    vendor: 'Fortinet',
    model: 'FortiGate-600F',
    displayName: 'FortiGate-600F (Physical Enterprise Appliance)',
    throughputGbps: 70.0,
    maxSessions: '8,000,000',
    ipsecVpnThroughputGbps: 33.0,
    recommendedDeploymentTopology: 'Active/Passive',
    supportedClouds: ['on-prem'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'Campus core and high-speed datacenter perimeter with NP7 processor'
  },

  // Check Point
  {
    vendor: 'Check Point',
    model: 'CloudGuard-4Core',
    displayName: 'Check Point CloudGuard (4 Cores, 8GB RAM)',
    throughputGbps: 4.0,
    maxSessions: '1,000,000',
    ipsecVpnThroughputGbps: 2.0,
    recommendedDeploymentTopology: 'Active/Passive',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'Check Point Gaia OS virtual appliance with SandBlast Threat Prevention'
  },
  {
    vendor: 'Check Point',
    model: 'CloudGuard-8Core',
    displayName: 'Check Point CloudGuard (8 Cores, 16GB RAM)',
    throughputGbps: 8.5,
    maxSessions: '2,500,000',
    ipsecVpnThroughputGbps: 4.5,
    recommendedDeploymentTopology: 'Active/Active ECMP',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'both'],
    verified: true,
    notes: 'High-availability multi-cloud inspection gateway'
  },

  // Cisco
  {
    vendor: 'Cisco',
    model: 'Secure-FTDv-4Core',
    displayName: 'Cisco Secure Firewall Threat Defense Virtual (4 Cores)',
    throughputGbps: 3.5,
    maxSessions: '750,000',
    ipsecVpnThroughputGbps: 1.8,
    recommendedDeploymentTopology: 'Active/Passive',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'Cisco FTDv managed by Cisco Defense Orchestrator or FMC'
  },
  {
    vendor: 'Cisco',
    model: 'Secure-FTDv-8Core',
    displayName: 'Cisco Secure Firewall Threat Defense Virtual (8 Cores)',
    throughputGbps: 7.0,
    maxSessions: '1,800,000',
    ipsecVpnThroughputGbps: 3.6,
    recommendedDeploymentTopology: 'Active/Active ECMP',
    supportedClouds: ['azure', 'aws', 'gcp', 'on-prem'],
    suitableTiers: ['external', 'both'],
    verified: true,
    notes: 'Scalable cloud inspection appliance with Snort 3 engine'
  },

  // Native Hyperscaler Firewalls
  {
    vendor: 'Microsoft Azure',
    model: 'Azure-Firewall-Premium',
    displayName: 'Azure Firewall Premium (IDPS & TLS Inspection)',
    throughputGbps: 30.0,
    maxSessions: 'Unlimited (Elastic Scale)',
    ipsecVpnThroughputGbps: 10.0,
    recommendedDeploymentTopology: 'Native Managed Fabric',
    supportedClouds: ['azure'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'Hyperscaler cloud-native stateful firewall with built-in high availability'
  },
  {
    vendor: 'Amazon Web Services',
    model: 'AWS-Network-Firewall',
    displayName: 'AWS Network Firewall (Stateful + Suricata Rules)',
    throughputGbps: 45.0,
    maxSessions: 'Unlimited (Elastic Scale)',
    ipsecVpnThroughputGbps: 15.0,
    recommendedDeploymentTopology: 'Native Managed Fabric',
    supportedClouds: ['aws'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'Managed VPC perimeter service deployed via AWS Transit Gateway endpoints'
  },
  {
    vendor: 'Google Cloud',
    model: 'GCP-Firewall-Plus',
    displayName: 'Google Cloud Firewall Plus (Cloud IDS / IPS)',
    throughputGbps: 40.0,
    maxSessions: 'Unlimited (Elastic Scale)',
    ipsecVpnThroughputGbps: 12.0,
    recommendedDeploymentTopology: 'Native Managed Fabric',
    supportedClouds: ['gcp'],
    suitableTiers: ['external', 'internal', 'both'],
    verified: true,
    notes: 'Distributed kernel-level inspection with Palo Alto Networks threat intelligence'
  }
];

export interface LoadBalancerSpec {
  id: string;
  name: string;
  vendor: string;
  type: 'L4' | 'L7' | 'L4/L7';
  sslOffloading: boolean;
  supportedEnvironments: Array<'avs' | 'vmc' | 'gcve' | 'nc2' | 'on-prem' | 'native'>;
  description: string;
}

export const LOAD_BALANCER_CATALOGUE: LoadBalancerSpec[] = [
  {
    id: 'vmware-avi',
    name: 'VMware NSX Advanced Load Balancer (Avi Networks)',
    vendor: 'VMware / Broadcom',
    type: 'L4/L7',
    sslOffloading: true,
    supportedEnvironments: ['avs', 'vmc', 'gcve', 'on-prem'],
    description: 'Software-defined application delivery controller with elastic service engines and analytics'
  },
  {
    id: 'nsx-native-lb',
    name: 'VMware NSX Native Load Balancer',
    vendor: 'VMware / Broadcom',
    type: 'L4/L7',
    sslOffloading: true,
    supportedEnvironments: ['avs', 'vmc', 'gcve', 'on-prem'],
    description: 'Integrated Tier-1 Gateway load balancer supporting server pools, health monitors, and SNAT'
  },
  {
    id: 'azure-app-gw',
    name: 'Azure Application Gateway v2 (with optional WAF)',
    vendor: 'Microsoft Azure',
    type: 'L7',
    sslOffloading: true,
    supportedEnvironments: ['avs', 'nc2', 'native'],
    description: 'Managed web traffic load balancer with URL-based routing, cookie affinity, and SSL termination'
  },
  {
    id: 'aws-alb-nlb',
    name: 'AWS Application Load Balancer / NLB',
    vendor: 'Amazon Web Services',
    type: 'L4/L7',
    sslOffloading: true,
    supportedEnvironments: ['vmc', 'native'],
    description: 'Elastic load balancing across target groups, EC2 instances, and connected private IP targets'
  },
  {
    id: 'gcp-cloud-lb',
    name: 'Google Cloud Application Load Balancer',
    vendor: 'Google Cloud',
    type: 'L7',
    sslOffloading: true,
    supportedEnvironments: ['gcve', 'native'],
    description: 'Global and regional proxy load balancer with Cloud Armor integration'
  },
  {
    id: 'f5-bigip-ltm',
    name: 'F5 BIG-IP Local Traffic Manager (LTM)',
    vendor: 'F5 Networks',
    type: 'L4/L7',
    sslOffloading: true,
    supportedEnvironments: ['avs', 'vmc', 'gcve', 'nc2', 'on-prem'],
    description: 'Enterprise virtual ADC appliance with iRules programmable traffic steering'
  },
  {
    id: 'citrix-adc',
    name: 'Citrix ADC (NetScaler VPX)',
    vendor: 'Citrix Systems',
    type: 'L4/L7',
    sslOffloading: true,
    supportedEnvironments: ['avs', 'vmc', 'gcve', 'nc2', 'on-prem'],
    description: 'High-performance application delivery and SSL offload for web and virtual desktop tiers'
  }
];

export interface ApplicationPublishingSpec {
  id: string;
  name: string;
  defaultProtocol: 'HTTPS' | 'TCP' | 'Custom';
  defaultPort: number;
  description: string;
}

export const PUBLISHING_PLATFORM_CATALOGUE: ApplicationPublishingSpec[] = [
  {
    id: 'customer-vap',
    name: 'Customer VAP (Virtual Access Platform / Custom Ingress Gateway)',
    defaultProtocol: 'HTTPS',
    defaultPort: 443,
    description: 'Configurable enterprise ingress gateway / publishing platform specified by customer'
  },
  {
    id: 'citrix-gateway',
    name: 'Citrix NetScaler Gateway / Unified Access Gateway',
    defaultProtocol: 'HTTPS',
    defaultPort: 443,
    description: 'Secure reverse proxy and multi-factor authentication portal for external enterprise users'
  },
  {
    id: 'azure-app-proxy',
    name: 'Microsoft Entra Application Proxy',
    defaultProtocol: 'HTTPS',
    defaultPort: 443,
    description: 'Cloud reverse-proxy connectors enabling zero-trust remote access without inbound firewall holes'
  },
  {
    id: 'cloudflare-zero-trust',
    name: 'Cloudflare Zero Trust / Cloudflare Tunnel',
    defaultProtocol: 'HTTPS',
    defaultPort: 443,
    description: 'Encrypted outbound tunnel connecting private services directly to Cloudflare global network'
  },
  {
    id: 'f5-apm',
    name: 'F5 BIG-IP Access Policy Manager (APM)',
    defaultProtocol: 'HTTPS',
    defaultPort: 443,
    description: 'Context-aware access management, single sign-on, and web application isolation'
  },
  {
    id: 'custom-platform',
    name: 'Custom / Unlisted Publishing Platform',
    defaultProtocol: 'HTTPS',
    defaultPort: 443,
    description: 'Custom ingress gateway or proprietary reverse proxy appliance'
  }
];

export interface TrafficFlowDefinition {
  flowId: 'internet-ingress-egress' | 'app-to-app' | 'east-west-workload' | 'mgmt-shared-services' | 'intercloud-hybrid';
  flowName: string;
  category: 'North-South' | 'East-West' | 'Hybrid Transit';
  description: string;
  defaultControls: Array<'external-firewall' | 'internal-firewall' | 'nsx-dfw' | 'waf' | 'publishing-platform' | 'load-balancer'>;
}

export const DEFAULT_TRAFFIC_FLOW_DEFINITIONS: TrafficFlowDefinition[] = [
  {
    flowId: 'internet-ingress-egress',
    flowName: 'Internet Ingress & Egress',
    category: 'North-South',
    description: 'Public web inbound traffic and outbound Internet access from cloud/SDDC workloads.',
    defaultControls: ['external-firewall', 'waf']
  },
  {
    flowId: 'internal-app-to-app',
    flowName: 'Internal Application-to-Application',
    category: 'East-West',
    description: 'Tier-to-tier communication (e.g. Web to App, App to Database) traversing virtual networks/VLANs.',
    defaultControls: ['internal-firewall', 'load-balancer']
  },
  {
    flowId: 'east-west-workload',
    flowName: 'East-West Workload Microsegmentation',
    category: 'East-West',
    description: 'Intra-subnet host-to-host or VM-to-VM traffic within the same SDDC segment.',
    defaultControls: ['nsx-dfw']
  },
  {
    flowId: 'mgmt-shared-services',
    flowName: 'Management & Shared Services',
    category: 'Hybrid Transit',
    description: 'Administrative access, vCenter, Active Directory, DNS, NTP, and Backup traffic.',
    defaultControls: ['internal-firewall']
  },
  {
    flowId: 'intercloud-hybrid',
    flowName: 'Inter-Cloud & Datacenter Transit',
    category: 'Hybrid Transit',
    description: 'Traffic between On-Premises HQ/DC and Cloud SDDC over ExpressRoute, Direct Connect, or HCX.',
    defaultControls: ['external-firewall', 'internal-firewall']
  }
];
