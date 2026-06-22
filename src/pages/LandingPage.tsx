import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { api } from "../lib/api";
import { useSiteStore } from "../store/site-store";
import { LandingPreview } from "../components/LandingPreview";

export function LandingPage(): JSX.Element {
  const { config, loading, setConfig, setLoading } = useSiteStore();
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement | null>(null);

  function closeMenu(): void {
    setMenuOpen(false);
  }

  function toggleMenu(): void {
    setMenuOpen((open) => !open);
  }

  useEffect(() => {
    let mounted = true;

    async function load(): Promise<void> {
      setLoading(true);
      setError("");
      try {
        const nextConfig = await api.getSiteConfig();
        if (mounted) setConfig(nextConfig);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "加载失败");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [setConfig, setLoading]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent): void {
      if (!menuOpen) return;
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (navRef.current?.contains(target)) return;
      closeMenu();
    }

    function handleEscape(event: KeyboardEvent): void {
      if (event.key === "Escape") closeMenu();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown, { passive: true });
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  return (
    <div className="page-shell">
      {menuOpen ? <button aria-label="关闭菜单" className="nav-backdrop" onClick={closeMenu} type="button" /> : null}
      <header className="top-nav" ref={navRef}>
        <a className="nav-logo" href="#top">
          {config.siteName}
        </a>
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          className="nav-menu-toggle"
          onClick={toggleMenu}
          type="button"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <nav className={menuOpen ? "nav-links nav-links--open" : "nav-links"}>
          {config.navItems.map((item) => (
            <a href={`#${item.anchor}`} key={`${item.anchor}-${item.label}`} onClick={closeMenu}>
              {item.label}
            </a>
          ))}
          <a className="nav-admin" href="/admin/login" onClick={closeMenu}>
            后台登录
          </a>
        </nav>
      </header>

      {loading ? (
        <div className="loading-state">正在加载最新落地页配置...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : (
        <LandingPreview config={config} />
      )}
    </div>
  );
}
