import { describe, it, expect } from 'vitest';
import {
  CANONICAL_TEMPLATES,
  getCompatibilityForPlatform,
  sanitizeWizardStateForTemplate,
  validateWizardStep
} from '../utils/architectureCompatibilityRules';
import { createDefaultWizardState, WizardState } from '../types/wizardStateAdapter';

describe('Wizard & Architecture Compatibility Engine', () => {
  it('provides all 5 core hyperscaler templates plus hybrid paths', () => {
    const templateIds = CANONICAL_TEMPLATES.map((t) => t.id);
    expect(templateIds).toContain('vmware-to-avs');
    expect(templateIds).toContain('vmware-to-nc2');
    expect(templateIds).toContain('nutanix-to-nc2');
    expect(templateIds).toContain('vmware-to-gcve');
    expect(templateIds).toContain('vmware-to-vmc');
    expect(templateIds).toContain('custom-path');
  });

  it('filters incompatible migration tools strictly based on target platform', () => {
    const avsCompat = getCompatibilityForPlatform('avs-gen2');
    expect(avsCompat.allowedMigrationTools).toContain('VMware HCX Enterprise');
    expect(avsCompat.allowedMigrationTools).not.toContain('Nutanix Move');

    const nc2Compat = getCompatibilityForPlatform('nc2-azure');
    expect(nc2Compat.allowedMigrationTools).toContain('Nutanix Move');
    expect(nc2Compat.allowedMigrationTools).not.toContain('VMware HCX Enterprise');
  });

  it('clears stale migration tools and storage when switching from AVS to Nutanix NC2', () => {
    const initial = createDefaultWizardState();
    expect(initial.otherServicesConfig.migrationAppliance).toBe('VMware HCX Enterprise');
    expect(initial.otherServicesConfig.decoupledStorageProvider).toBe('Azure NetApp Files (ANF NFS Datastore)');

    const { state: updated, clearedNotices } = sanitizeWizardStateForTemplate(initial, 'nutanix-to-nc2');
    expect(updated.targetPlatform).toBe('nc2-azure');
    expect(updated.sourcePlatform).toBe('nutanix');
    expect(updated.otherServicesConfig.migrationAppliance).toBe('Nutanix Move');
    expect(updated.otherServicesConfig.decoupledStorageProvider).toBe('Native Nutanix Distributed Storage Fabric (DSF)');
    expect(clearedNotices.length).toBeGreaterThan(0);
  });

  it('validates Step 1 required objective and deployment scope', () => {
    const state = createDefaultWizardState();
    const validCheck = validateWizardStep(1, state);
    expect(validCheck.isValid).toBe(true);

    const invalidState: WizardState = {
      ...state,
      objective: '' as any
    };
    const invalidCheck = validateWizardStep(1, invalidState);
    expect(invalidCheck.isValid).toBe(false);
    expect(invalidCheck.errors[0]).toContain('objective');
  });

  it('validates Step 2 required customer name and valid CIDR', () => {
    const state = createDefaultWizardState();
    const validCheck = validateWizardStep(2, state);
    expect(validCheck.isValid).toBe(true);

    const invalidCidrState: WizardState = {
      ...state,
      sourceMgmtCidr: 'invalid-ip-format'
    };
    const invalidCheck = validateWizardStep(2, invalidCidrState);
    expect(invalidCheck.isValid).toBe(false);
    expect(invalidCheck.errors[0]).toContain('CIDR');
  });

  it('validates Step 5 minimum 3-node cluster quorum', () => {
    const state = createDefaultWizardState();
    const validCheck = validateWizardStep(5, state);
    expect(validCheck.isValid).toBe(true);

    const underSizedState: WizardState = {
      ...state,
      targetNodeCount: 2
    };
    const invalidCheck = validateWizardStep(5, underSizedState);
    expect(invalidCheck.isValid).toBe(false);
    expect(invalidCheck.errors[0]).toContain('minimum cluster quorum of at least 3');
  });
});
