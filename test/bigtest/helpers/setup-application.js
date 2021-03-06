import setupStripesCore from '@folio/stripes-core/test/bigtest/helpers/setup-application';

import mirageOptions from '../network';

export function setupApplication({
  scenarios,
  hasAllPerms = true,
} = {}) {
  setupStripesCore({
    mirageOptions,
    scenarios,
    stripesConfig: {
      hasAllPerms,
    },
  });
}
