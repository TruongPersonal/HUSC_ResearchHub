export type NavItem = { href: string; label: string; exact?: boolean };

export const normPath = (p: string) => (p !== "/" ? p.replace(/\/+$/, "") : "/");

export function pickActiveHref(items: NavItem[], pathname: string) {
  const current = normPath(pathname);
  // Ưu tiên các item có exact
  const exactHit = items.find(({ href, exact }) => exact && normPath(href) === current);
  if (exactHit) return exactHit.href;

  // Không exact → match prefix dài nhất
  const byLen = [...items].sort((a, b) => b.href.length - a.href.length);
  const hit = byLen.find(({ href, exact }) => {
    if (exact) return false;
    const h = normPath(href);
    return current === h || current.startsWith(h + "/");
  });

  return hit?.href ?? null;
}
