import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { api } from "../lib/api";
import { useSiteStore } from "../store/site-store";
import { LandingPreview } from "../components/LandingPreview";

export function LandingPage(): JSX.Element {
  const { config, loading, setConfig, setLoading } = useSiteStore();
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <div className="page-shell">
      <header className="top-nav">
        <a className="nav-logo" href="#top">
          {config.siteName}
        </a>
        <button
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          className="nav-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <nav className={menuOpen ? "nav-links nav-links--open" : "nav-links"}>
          {config.navItems.map((item) => (
            <a href={`#${item.anchor}`} key={`${item.anchor}-${item.label}`} onClick={() => setMenuOpen(false)}>
              {item.label}
            </a>
          ))}
          <a className="nav-admin" href="/admin/login" onClick={() => setMenuOpen(false)}>
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
