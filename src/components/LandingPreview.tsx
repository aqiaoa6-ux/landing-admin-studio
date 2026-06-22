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
          eyebrow={config.sections.brands.eyebrow}
          title={config.sections.brands.title}
          description={config.sections.brands.description}
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
          eyebrow={config.sections.support.eyebrow}
          title={config.sections.support.title}
          description={config.sections.support.description}
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
          eyebrow={config.sections.cases.eyebrow}
          title={config.sections.cases.title}
          description={config.sections.cases.description}
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
          eyebrow={config.sections.contact.eyebrow}
          title={config.sections.contact.title}
          description={config.sections.contact.description}
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
