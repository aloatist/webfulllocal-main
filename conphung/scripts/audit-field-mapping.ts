/**
 * Audit Script: Compare field mapping between HomepageConfig schema and Block registry
 * 
 * This script identifies:
 * 1. Missing fields in convertSectionToBlockFields()
 * 2. Missing fields in convertBlockToSection()
 * 3. Missing fields in block registry
 * 4. Fields that exist in schema but not mapped
 */

// Hero Section Analysis
const heroSchemaFields = [
  'eyebrow', 'mainTitle', 'subtitle', 'description', 'backgroundImage',
  'phone', 'address', 'openingHours', 'primaryCta', 'secondaryCta', 'usps',
  'isVisible', 'visibility', 'styles'
];

const heroBlockRegistryFields = [
  'eyebrow', 'title', 'subtitle', 'description', 'backgroundImage',
  'primaryCtaText', 'primaryCtaLink', 'secondaryCtaText', 'secondaryCtaLink',
  'phone', 'address', 'openingHours'
];

const heroSyncFields = [
  'eyebrow', 'title', 'subtitle', 'description', 'backgroundImage',
  'phone', 'address', 'openingHours', 'primaryCtaText', 'primaryCtaLink',
  'secondaryCtaText', 'secondaryCtaLink'
];

const heroRenderFields = [
  'eyebrow', 'mainTitle', 'subtitle', 'description', 'backgroundImage',
  'phone', 'address', 'openingHours', 'primaryCta', 'secondaryCta'
];

// Analysis Results
const analysis = {
  hero: {
    schemaFields: heroSchemaFields,
    blockRegistryFields: heroBlockRegistryFields,
    syncFields: heroSyncFields,
    renderFields: heroRenderFields,
    missingInSync: ['usps'], // Missing in convertSectionToBlockFields
    missingInRender: ['usps'], // Missing in convertBlockToSection
    missingInRegistry: ['usps'],
  },
  // Add other sections...
};

console.log('=== FIELD MAPPING AUDIT REPORT ===\n');
console.log('HERO SECTION:');
console.log('Missing in sync (Settings → Blocks):', analysis.hero.missingInSync);
console.log('Missing in render (Blocks → Settings):', analysis.hero.missingInRender);
console.log('Missing in registry:', analysis.hero.missingInRegistry);

export default analysis;



