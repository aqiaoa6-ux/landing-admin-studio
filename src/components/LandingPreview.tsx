import type { CSSProperties } from "react";
import {
  BadgeDollarSign,
  ChevronRight,
  Gift,
  Headset,
  Link2,
  MessageCircleMore,
  Send,
  Sparkles,
} from "lucide-react";
import type { SiteConfig } from "../../shared/site-config";
import { SectionTitle } from "./SectionTitle";

const iconMap = {
  Gift,
  BadgeDollarSign,
  Sparkles,
  Headset,
};

interface LandingPreviewProps {
  config: SiteConfig;
  compact?: boolean;
}

export function LandingPreview({ config, compact = false }: LandingPreviewProps): JSX.Element {
  const themeStyle = {
    ["--primary" as string]: config.theme.primary,
    ["--accent" as string]: config.theme.accent,
    ["--bg" as string]: config.theme.secondary,
  } as CSSProperties;

  return (
    <div className={`landing-shell ${compact ? "landing-shell--compact" : ""}`} style={themeStyle}>
      <section className="hero-section" id="top">
        <div className="hero-copy">
          <div className="brand-pill">{config.siteName}</div>
          <h1>{config.hero.title}</h1>
          <p className="hero-subtitle">{config.hero.subtitle}</p>
          <p className="hero-description">{config.hero.description}</p>
          <div className="hero-invite">邀请码 {config.hero.inviteCode}</div>
          <div className="hero-actions">
            <a className="primary-button" href={config.hero.primaryContactUrl || "#"} target="_blank" rel="noreferrer">
              <Send size={18} />
              {config.hero.primaryContactLabel}
            </a>
            <a className="ghost-button" href={config.hero.secondaryContactUrl || "#"} target="_blank" rel="noreferrer">
              <MessageCircleMore size={18} />
              {config.hero.secondaryContactLabel}
            </a>
          </div>
          <div className="hero-contact-meta">
            <span>{config.hero.primaryContactValue}</span>
            <span>{config.hero.secondaryContactValue}</span>
          </div>
        </div>
        <div className="hero-visual card-surface">
          <img src={config.hero.heroImageUrl} alt="招商视觉图" />
        </div>
      </section>

      <section className="content-section" id="brands">
        <SectionTitle
          eyebrow="品牌矩阵"
          title="多品牌统一承接，页面入口可随时替换"
          description="品牌卡支持后台增删改和跳转地址配置，适合不同阶段灵活投放。"
        />
        <div className="brand-grid">
          {config.brands.map((brand) => (
            <a className="brand-card card-surface" href={brand.linkUrl || "#"} key={brand.id} target="_blank" rel="noreferrer">
              <img src={brand.logoUrl} alt={brand.name} />
              <div>
                <strong>{brand.name}</strong>
                <span>点击进入品牌页</span>
              </div>
              <ChevronRight size={18} />
            </a>
          ))}
        </div>
      </section>

      <section className="content-section" id="support">
        <SectionTitle
          eyebrow="代理扶持"
          title="从起盘到放量，给到能直接使用的承接方案"
          description="不是只给招商话术，而是把素材、奖励、服务和后续转化一起交付。"
        />
        <div className="support-grid">
          {config.supportItems.map((item) => {
            const Icon = iconMap[item.iconName as keyof typeof iconMap] ?? Sparkles;
            return (
              <article className="support-card card-surface" key={item.id}>
                <div className="support-icon">
                  <Icon size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="content-section" id="cases">
        <SectionTitle
          eyebrow="佣金案例"
          title="把结果展示出来，信任转化更直接"
          description="佣金案例支持后台上传新图或替换文案，方便持续更新真实成交素材。"
        />
        <div className="case-grid">
          {config.cases.map((item) => (
            <article className="case-card card-surface" key={item.id}>
              <img src={item.imageUrl} alt={item.title} />
              <div className="case-meta">
                <span>{item.durationText}</span>
                <strong>{item.amountText}</strong>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-section card-surface" id="contact">
        <SectionTitle
          eyebrow="联系我们"
          title="联系方式、注册链接、邀请码全部后台可配"
          description="前台自动读取最新配置，保存后无需重新改代码。"
        />
        <div className="contact-grid">
          {config.contacts.map((item) => (
            <a className="contact-card" href={item.url || "#"} key={item.id} target="_blank" rel="noreferrer">
              <div>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <Link2 size={18} />
            </a>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <p>{config.footerText}</p>
      </footer>
    </div>
  );
}
