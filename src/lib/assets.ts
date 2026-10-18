/**
 * Resolves public asset paths.
 *
 * Production uses the local /public assets. The optional origin is used only
 * for preview builds where the preview branch is stored separately from the
 * production image assets. Keep it unset in production.
 */
const assetOrigin = (process.env.NEXT_PUBLIC_ASSET_ORIGIN ?? "").replace(/\/+$/, "");

export function assetSrc(src: string): string {
  if (/^(https?:)?\/\//i.test(src) || src.startsWith("data:")) return src;
  if (!assetOrigin) return src;
  return assetOrigin + (src.startsWith("/") ? src : "/" + src);
}
