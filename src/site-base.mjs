/* Set by build.mjs from --base. Empty for a root deploy (the real domain),
   '/preview/royal-kings' when staging under fjmedia.ca/preview/.

   G64b exists because of exactly this: a build authored with root-absolute
   paths silently resolves every one of them against the WRONG root when it
   is served from a subdirectory, and the JS redirect strings — which no
   screenshot and no HTML link-checker can see — 404 only after a customer
   has already submitted the form. */
export const BASE = { prefix: '' };
export function setBase(p) { BASE.prefix = p || ''; }
