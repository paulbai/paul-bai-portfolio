const validOrigin = /^https:\/\/[^/?#\\\s]+\/?$/i;
const formatError =
  'PUBLIC_SITE_URL must be an absolute HTTPS origin without a path, query, fragment, credentials, or surrounding whitespace (for example, https://example.com).';

/**
 * @param {string | undefined} value
 * @param {{ required?: boolean }} [options]
 * @returns {string | undefined}
 */
export function validateSiteUrl(value, { required = false } = {}) {
  if (value === undefined || value === '') {
    if (required) throw new Error('PUBLIC_SITE_URL is required for deployment. ' + formatError);
    return undefined;
  }

  if (value.trim() !== value || !validOrigin.test(value)) throw new Error(formatError);

  let url;
  try {
    url = new URL(value);
  } catch {
    throw new Error(formatError);
  }

  if (
    url.protocol !== 'https:' ||
    !url.hostname ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(formatError);
  }

  return url.origin;
}

/**
 * @param {string | undefined} value
 * @returns {{ canonicalUrl: string | undefined, socialImageUrl: string }}
 */
export function siteMetadataUrls(value) {
  const origin = validateSiteUrl(value);
  return {
    canonicalUrl: origin ? `${origin}/` : undefined,
    socialImageUrl: origin ? `${origin}/og-v2.jpg` : '/og-v2.jpg'
  };
}

// The same validator is used by the layout and by the explicit deployment gate.
if (
  typeof process !== 'undefined' &&
  process.argv[1]?.replaceAll('\\', '/').endsWith('/scripts/validate-site-url.mjs')
) {
  try {
    const flags = process.argv.slice(2);
    if (flags.some((flag) => flag !== '--require')) {
      throw new Error('Usage: node scripts/validate-site-url.mjs [--require]');
    }
    validateSiteUrl(process.env.PUBLIC_SITE_URL, { required: flags.includes('--require') });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
