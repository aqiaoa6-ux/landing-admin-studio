import { useEffect, useState } from "react";
import { ImagePlus, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { BrandItem, CaseItem, ContactItem, SiteConfig, SupportItem } from "../../shared/site-config";
import { LandingPreview } from "../components/LandingPreview";
import { api, authStorage } from "../lib/api";
import { useSiteStore } from "../store/site-store";

type ListKey = "contacts" | "brands" | "supportItems" | "cases";

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e5)}`;
}

export function AdminPage(): JSX.Element {
  const navigate = useNavigate();
  const { config, loading, setConfig, patchConfig: updateStoreConfig, setLoading } = useSiteStore();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authStorage.getToken()) {
      navigate("/admin/login");
      return;
    }

    let mounted = true;

    async function load(): Promise<void> {
      setLoading(true);
      try {
        const result = await api.getAdminSiteConfig();
        if (mounted) setConfig(result);
      } catch (err) {
        authStorage.clearToken();
        if (mounted) {
          setError(err instanceof Error ? err.message : "加载后台数据失败");
          navigate("/admin/login");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void load();
    return () => {
      mounted = false;
    };
  }, [navigate, setConfig, setLoading]);

  function patchConfig(updater: (current: SiteConfig) => SiteConfig): void {
    updateStoreConfig(updater);
  }

  function updateListItem<T extends ContactItem | BrandItem | SupportItem | CaseItem>(
    key: ListKey,
    id: string,
    field: keyof T,
    value: string,
  ): void {
    patchConfig((current) => ({
      ...current,
      [key]: (current[key] as Array<ContactItem | BrandItem | SupportItem | CaseItem>).map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    }) as SiteConfig);
  }

  function removeListItem(key: ListKey, id: string): void {
    patchConfig((current) => ({
      ...current,
      [key]: (current[key] as Array<ContactItem | BrandItem | SupportItem | CaseItem>).filter(
        (item) => item.id !== id,
      ),
    }) as SiteConfig);
  }

  function addListItem(key: ListKey): void {
    const items = {
      contacts: { id: createId("contact"), label: "新联系方式", value: "", url: "", type: "custom" },
      brands: { id: createId("brand"), name: "新品牌", logoUrl: "", linkUrl: "" },
      supportItems: { id: createId("support"), title: "新扶持项", description: "", iconName: "Sparkles" },
      cases: {
        id: createId("case"),
        title: "新案例",
        amountText: "累计佣金 0",
        durationText: "0 天",
        description: "",
        imageUrl: "",
      },
    } as const;

    patchConfig(
      (current) =>
        ({
          ...current,
          [key]: [
            ...(current[key] as Array<ContactItem | BrandItem | SupportItem | CaseItem>),
            items[key],
          ],
        }) as SiteConfig,
    );
  }

  async function uploadImage(file: File, onDone: (url: string) => void): Promise<void> {
    try {
      setMessage("上传中...");
      const result = await api.uploadAsset(file);
      onDone(result.url);
      setMessage("上传成功");
    } catch (err) {
      setError(err instanceof Error ? err.message : "上传失败");
    }
  }

  async function handleSave(): Promise<void> {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const result = await api.saveAdminSiteConfig(config);
      setMessage(`保存成功，更新时间 ${new Date(result.updatedAt).toLocaleString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout(): Promise<void> {
    try {
      await api.logout();
    } finally {
      authStorage.clearToken();
      navigate("/admin/login");
    }
  }

  return (
    <div className="admin-page">
      <aside className="admin-editor">
        <div className="admin-toolbar">
          <div>
            <span className="login-kicker">内容管理后台</span>
            <h1>落地页配置中心</h1>
          </div>
          <div className="toolbar-actions">
            <button className="ghost-button" onClick={() => void handleLogout()} type="button">
              <LogOut size={16} />
              退出
            </button>
            <button className="primary-button" disabled={saving} onClick={() => void handleSave()} type="button">
              <Save size={16} />
              {saving ? "保存中..." : "保存配置"}
            </button>
          </div>
        </div>

        {loading ? <div className="loading-state">正在读取后台配置...</div> : null}
        {message ? <div className="success-inline">{message}</div> : null}
        {error ? <div className="error-inline">{error}</div> : null}

        <section className="panel-section card-surface">
          <h2>基础信息</h2>
          <div className="form-grid">
            <label><span>站点名称</span><input value={config.siteName} onChange={(e) => patchConfig((c) => ({ ...c, siteName: e.target.value }))} /></label>
            <label><span>主标题</span><input value={config.hero.title} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, title: e.target.value } }))} /></label>
            <label><span>副标题</span><input value={config.hero.subtitle} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, subtitle: e.target.value } }))} /></label>
            <label><span>邀请码</span><input value={config.hero.inviteCode} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, inviteCode: e.target.value } }))} /></label>
          </div>
          <label className="full-width"><span>首屏描述</span><textarea value={config.hero.description} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, description: e.target.value } }))} /></label>
          <div className="form-grid">
            <label><span>主联系按钮文案</span><input value={config.hero.primaryContactLabel} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, primaryContactLabel: e.target.value } }))} /></label>
            <label><span>主联系展示值</span><input value={config.hero.primaryContactValue} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, primaryContactValue: e.target.value } }))} /></label>
            <label><span>主联系链接</span><input value={config.hero.primaryContactUrl} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, primaryContactUrl: e.target.value } }))} /></label>
            <label><span>副联系按钮文案</span><input value={config.hero.secondaryContactLabel} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, secondaryContactLabel: e.target.value } }))} /></label>
            <label><span>副联系展示值</span><input value={config.hero.secondaryContactValue} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, secondaryContactValue: e.target.value } }))} /></label>
            <label><span>副联系链接</span><input value={config.hero.secondaryContactUrl} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, secondaryContactUrl: e.target.value } }))} /></label>
          </div>
          <label className="full-width"><span>首屏图片链接</span><input value={config.hero.heroImageUrl} onChange={(e) => patchConfig((c) => ({ ...c, hero: { ...c.hero, heroImageUrl: e.target.value } }))} /></label>
          <label className="upload-button"><ImagePlus size={16} />上传首屏图<input accept="image/*" hidden type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadImage(file, (url) => patchConfig((c) => ({ ...c, hero: { ...c.hero, heroImageUrl: url } }))); }} /></label>
        </section>

        <section className="panel-section card-surface">
          <h2>板块文案</h2>
          <div className="repeat-card">
            <strong>品牌矩阵</strong>
            <div className="form-grid">
              <label><span>角标</span><input value={config.sections.brands.eyebrow} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, brands: { ...c.sections.brands, eyebrow: e.target.value } } }))} /></label>
              <label><span>主标题</span><input value={config.sections.brands.title} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, brands: { ...c.sections.brands, title: e.target.value } } }))} /></label>
            </div>
            <label className="full-width"><span>描述</span><textarea value={config.sections.brands.description} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, brands: { ...c.sections.brands, description: e.target.value } } }))} /></label>
          </div>
          <div className="repeat-card">
            <strong>代理扶持</strong>
            <div className="form-grid">
              <label><span>角标</span><input value={config.sections.support.eyebrow} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, support: { ...c.sections.support, eyebrow: e.target.value } } }))} /></label>
              <label><span>主标题</span><input value={config.sections.support.title} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, support: { ...c.sections.support, title: e.target.value } } }))} /></label>
            </div>
            <label className="full-width"><span>描述</span><textarea value={config.sections.support.description} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, support: { ...c.sections.support, description: e.target.value } } }))} /></label>
          </div>
          <div className="repeat-card">
            <strong>佣金案例</strong>
            <div className="form-grid">
              <label><span>角标</span><input value={config.sections.cases.eyebrow} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, cases: { ...c.sections.cases, eyebrow: e.target.value } } }))} /></label>
              <label><span>主标题</span><input value={config.sections.cases.title} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, cases: { ...c.sections.cases, title: e.target.value } } }))} /></label>
            </div>
            <label className="full-width"><span>描述</span><textarea value={config.sections.cases.description} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, cases: { ...c.sections.cases, description: e.target.value } } }))} /></label>
          </div>
          <div className="repeat-card">
            <strong>联系我们</strong>
            <div className="form-grid">
              <label><span>角标</span><input value={config.sections.contact.eyebrow} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, contact: { ...c.sections.contact, eyebrow: e.target.value } } }))} /></label>
              <label><span>主标题</span><input value={config.sections.contact.title} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, contact: { ...c.sections.contact, title: e.target.value } } }))} /></label>
            </div>
            <label className="full-width"><span>描述</span><textarea value={config.sections.contact.description} onChange={(e) => patchConfig((c) => ({ ...c, sections: { ...c.sections, contact: { ...c.sections.contact, description: e.target.value } } }))} /></label>
          </div>
        </section>

        <section className="panel-section card-surface">
          <div className="section-row"><h2>联系方式</h2><button className="mini-button" onClick={() => addListItem("contacts")} type="button"><Plus size={14} />新增</button></div>
          {config.contacts.map((item) => (
            <div className="repeat-card" key={item.id}>
              <div className="section-row"><strong>{item.label}</strong><button className="danger-button" onClick={() => removeListItem("contacts", item.id)} type="button"><Trash2 size={14} /></button></div>
              <div className="form-grid">
                <label><span>名称</span><input value={item.label} onChange={(e) => updateListItem<ContactItem>("contacts", item.id, "label", e.target.value)} /></label>
                <label><span>展示值</span><input value={item.value} onChange={(e) => updateListItem<ContactItem>("contacts", item.id, "value", e.target.value)} /></label>
                <label><span>跳转链接</span><input value={item.url} onChange={(e) => updateListItem<ContactItem>("contacts", item.id, "url", e.target.value)} /></label>
                <label><span>类型</span><input value={item.type} onChange={(e) => updateListItem<ContactItem>("contacts", item.id, "type", e.target.value)} /></label>
              </div>
            </div>
          ))}
        </section>

        <section className="panel-section card-surface">
          <div className="section-row"><h2>品牌配置</h2><button className="mini-button" onClick={() => addListItem("brands")} type="button"><Plus size={14} />新增</button></div>
          {config.brands.map((item) => (
            <div className="repeat-card" key={item.id}>
              <div className="section-row"><strong>{item.name}</strong><button className="danger-button" onClick={() => removeListItem("brands", item.id)} type="button"><Trash2 size={14} /></button></div>
              <div className="form-grid">
                <label><span>品牌名</span><input value={item.name} onChange={(e) => updateListItem<BrandItem>("brands", item.id, "name", e.target.value)} /></label>
                <label><span>跳转链接</span><input value={item.linkUrl} onChange={(e) => updateListItem<BrandItem>("brands", item.id, "linkUrl", e.target.value)} /></label>
                <label className="full-width"><span>Logo 图链接</span><input value={item.logoUrl} onChange={(e) => updateListItem<BrandItem>("brands", item.id, "logoUrl", e.target.value)} /></label>
              </div>
              <label className="upload-button"><ImagePlus size={16} />上传品牌图<input accept="image/*" hidden type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadImage(file, (url) => updateListItem<BrandItem>("brands", item.id, "logoUrl", url)); }} /></label>
            </div>
          ))}
        </section>

        <section className="panel-section card-surface">
          <div className="section-row"><h2>扶持活动</h2><button className="mini-button" onClick={() => addListItem("supportItems")} type="button"><Plus size={14} />新增</button></div>
          {config.supportItems.map((item) => (
            <div className="repeat-card" key={item.id}>
              <div className="section-row"><strong>{item.title}</strong><button className="danger-button" onClick={() => removeListItem("supportItems", item.id)} type="button"><Trash2 size={14} /></button></div>
              <div className="form-grid">
                <label><span>标题</span><input value={item.title} onChange={(e) => updateListItem<SupportItem>("supportItems", item.id, "title", e.target.value)} /></label>
                <label><span>图标名</span><input value={item.iconName} onChange={(e) => updateListItem<SupportItem>("supportItems", item.id, "iconName", e.target.value)} /></label>
              </div>
              <label className="full-width"><span>描述</span><textarea value={item.description} onChange={(e) => updateListItem<SupportItem>("supportItems", item.id, "description", e.target.value)} /></label>
            </div>
          ))}
        </section>

        <section className="panel-section card-surface">
          <div className="section-row"><h2>佣金案例</h2><button className="mini-button" onClick={() => addListItem("cases")} type="button"><Plus size={14} />新增</button></div>
          {config.cases.map((item) => (
            <div className="repeat-card" key={item.id}>
              <div className="section-row"><strong>{item.title}</strong><button className="danger-button" onClick={() => removeListItem("cases", item.id)} type="button"><Trash2 size={14} /></button></div>
              <div className="form-grid">
                <label><span>标题</span><input value={item.title} onChange={(e) => updateListItem<CaseItem>("cases", item.id, "title", e.target.value)} /></label>
                <label><span>金额文案</span><input value={item.amountText} onChange={(e) => updateListItem<CaseItem>("cases", item.id, "amountText", e.target.value)} /></label>
                <label><span>时长文案</span><input value={item.durationText} onChange={(e) => updateListItem<CaseItem>("cases", item.id, "durationText", e.target.value)} /></label>
                <label className="full-width"><span>案例图片</span><input value={item.imageUrl} onChange={(e) => updateListItem<CaseItem>("cases", item.id, "imageUrl", e.target.value)} /></label>
              </div>
              <label className="full-width"><span>案例描述</span><textarea value={item.description} onChange={(e) => updateListItem<CaseItem>("cases", item.id, "description", e.target.value)} /></label>
              <label className="upload-button"><ImagePlus size={16} />上传案例图<input accept="image/*" hidden type="file" onChange={(e) => { const file = e.target.files?.[0]; if (file) void uploadImage(file, (url) => updateListItem<CaseItem>("cases", item.id, "imageUrl", url)); }} /></label>
            </div>
          ))}
        </section>

        <section className="panel-section card-surface">
          <h2>主题与页脚</h2>
          <div className="form-grid">
            <label><span>主色</span><input value={config.theme.primary} onChange={(e) => patchConfig((c) => ({ ...c, theme: { ...c.theme, primary: e.target.value } }))} /></label>
            <label><span>深色背景</span><input value={config.theme.secondary} onChange={(e) => patchConfig((c) => ({ ...c, theme: { ...c.theme, secondary: e.target.value } }))} /></label>
            <label><span>高亮色</span><input value={config.theme.accent} onChange={(e) => patchConfig((c) => ({ ...c, theme: { ...c.theme, accent: e.target.value } }))} /></label>
          </div>
          <label className="full-width"><span>页脚文案</span><textarea value={config.footerText} onChange={(e) => patchConfig((c) => ({ ...c, footerText: e.target.value }))} /></label>
        </section>
      </aside>

      <main className="admin-preview">
        <div className="preview-sticky">
          <div className="preview-title">
            <span className="login-kicker">实时预览</span>
            <h2>前台效果</h2>
          </div>
          <LandingPreview compact config={config} />
        </div>
      </main>
    </div>
  );
}
