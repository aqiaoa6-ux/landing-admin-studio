export type ContactType = "telegram" | "whatsapp" | "wechat" | "link" | "custom";

export interface NavItem {
  label: string;
  anchor: string;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  description: string;
  inviteCode: string;
  primaryContactLabel: string;
  primaryContactValue: string;
  primaryContactUrl: string;
  secondaryContactLabel: string;
  secondaryContactValue: string;
  secondaryContactUrl: string;
  heroImageUrl: string;
}

export interface ContactItem {
  id: string;
  label: string;
  value: string;
  url: string;
  type: ContactType;
}

export interface BrandItem {
  id: string;
  name: string;
  logoUrl: string;
  linkUrl: string;
}

export interface SupportItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface CaseItem {
  id: string;
  title: string;
  amountText: string;
  durationText: string;
  description: string;
  imageUrl: string;
}

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
}

export interface SectionCopy {
  eyebrow: string;
  title: string;
  description: string;
}

export interface SectionConfig {
  brands: SectionCopy;
  support: SectionCopy;
  cases: SectionCopy;
  contact: SectionCopy;
}

export interface SiteConfig {
  siteName: string;
  navItems: NavItem[];
  hero: HeroConfig;
  sections: SectionConfig;
  contacts: ContactItem[];
  brands: BrandItem[];
  supportItems: SupportItem[];
  cases: CaseItem[];
  footerText: string;
  theme: ThemeConfig;
}

function makeImageUrl(prompt: string, imageSize: string): string {
  return `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteName: "星链招商工作室",
  navItems: [
    { label: "品牌矩阵", anchor: "brands" },
    { label: "代理扶持", anchor: "support" },
    { label: "佣金案例", anchor: "cases" },
    { label: "联系我们", anchor: "contact" },
  ],
  hero: {
    title: "做长期代理，不做一次性招商",
    subtitle: "独立后台可配置，页面内容随时改",
    description:
      "从引流素材、返佣机制到客服承接，一套招商落地页加后台配置系统，帮助团队快速上线、持续迭代、统一对外口径。",
    inviteCode: "XL888",
    primaryContactLabel: "Telegram 专属招商主管",
    primaryContactValue: "@starlink_agent",
    primaryContactUrl: "https://t.me/starlink_agent",
    secondaryContactLabel: "WhatsApp 商务合作",
    secondaryContactValue: "+852 5123 8899",
    secondaryContactUrl: "https://wa.me/85251238899",
    heroImageUrl: makeImageUrl(
      "premium blue ocean tech marketing landing page mockup with smartphone dashboard, luxury chinese recruitment campaign, glassmorphism cards, cinematic studio lighting, realistic 3d ui render",
      "portrait_16_9",
    ),
  },
  sections: {
    brands: {
      eyebrow: "品牌矩阵",
      title: "多品牌统一承接，页面入口可随时替换",
      description: "品牌卡支持后台增删改和跳转地址配置，适合不同阶段灵活投放。",
    },
    support: {
      eyebrow: "代理扶持",
      title: "从起盘到放量，给到能直接使用的承接方案",
      description: "不是只给招商话术，而是把素材、奖励、服务和后续转化一起交付。",
    },
    cases: {
      eyebrow: "佣金案例",
      title: "把结果展示出来，信任转化更直接",
      description: "佣金案例支持后台上传新图或替换文案，方便持续更新真实成交素材。",
    },
    contact: {
      eyebrow: "联系我们",
      title: "联系方式、注册链接、邀请码全部后台可配",
      description: "前台自动读取最新配置，保存后无需重新改代码。",
    },
  },
  contacts: [
    {
      id: "contact-telegram",
      label: "Telegram",
      value: "@starlink_agent",
      url: "https://t.me/starlink_agent",
      type: "telegram",
    },
    {
      id: "contact-whatsapp",
      label: "WhatsApp",
      value: "+852 5123 8899",
      url: "https://wa.me/85251238899",
      type: "whatsapp",
    },
    {
      id: "contact-wechat",
      label: "微信",
      value: "starlink888",
      url: "",
      type: "wechat",
    },
    {
      id: "contact-register",
      label: "注册链接",
      value: "立即注册",
      url: "https://example.com/register?code=XL888",
      type: "link",
    },
  ],
  brands: [
    {
      id: "brand-aurora",
      name: "Aurora",
      logoUrl: makeImageUrl(
        "luxury blue brand badge logo card with subtle metallic frame, realistic ui asset, no text clutter, elegant sportsbook identity",
        "square",
      ),
      linkUrl: "https://example.com/aurora",
    },
    {
      id: "brand-vertex",
      name: "Vertex",
      logoUrl: makeImageUrl(
        "futuristic navy brand logo card with glowing cyan edges, realistic product badge, clean premium marketing asset",
        "square",
      ),
      linkUrl: "https://example.com/vertex",
    },
    {
      id: "brand-solace",
      name: "Solace",
      logoUrl: makeImageUrl(
        "premium gradient brand identity card in blue and violet, realistic glossy logo tile, luxury affiliate brand visual",
        "square",
      ),
      linkUrl: "https://example.com/solace",
    },
  ],
  supportItems: [
    {
      id: "support-reward",
      title: "拉新补贴",
      description: "新代理开通后按阶段发放拉新奖励，降低前期启动压力。",
      iconName: "Gift",
    },
    {
      id: "support-commission",
      title: "高返佣比例",
      description: "按团队活跃与流水阶梯提升，持续做量收益更稳定。",
      iconName: "BadgeDollarSign",
    },
    {
      id: "support-material",
      title: "素材代运营",
      description: "招商海报、文案话术、转化链路都可直接复用，减少试错。",
      iconName: "Sparkles",
    },
    {
      id: "support-service",
      title: "1 对 1 承接",
      description: "独立招商主管跟进，注册、首充、留存和活动全程协助。",
      iconName: "Headset",
    },
  ],
  cases: [
    {
      id: "case-1",
      title: "团队代理 18 天",
      amountText: "累计佣金 68,800",
      durationText: "18 天回本",
      description: "通过现成素材投放与社群承接，首月快速跑通获客闭环。",
      imageUrl: makeImageUrl(
        "realistic smartphone screenshot style affiliate commission dashboard, blue finance app interface, chinese market, elegant report card, high detail",
        "portrait_4_3",
      ),
    },
    {
      id: "case-2",
      title: "个人代理 30 天",
      amountText: "累计佣金 126,500",
      durationText: "30 天突破 10W",
      description: "优化渠道结构后持续放大自然流量，佣金增长更平稳。",
      imageUrl: makeImageUrl(
        "mobile commission analytics screen with premium cyan gradients, realistic earnings report, detailed chinese app ui, financial growth visualization",
        "portrait_4_3",
      ),
    },
    {
      id: "case-3",
      title: "社群代理 45 天",
      amountText: "团队流水奖励 238,000",
      durationText: "45 天稳定放量",
      description: "活动+返佣联动，适合已有群资源的团队快速复制。",
      imageUrl: makeImageUrl(
        "luxury smartphone crm and promotion dashboard, realistic glassmorphism ui, blue dark campaign analytics, high-converting landing page asset",
        "portrait_4_3",
      ),
    },
  ],
  footerText: "Copyright © 2026 星链招商工作室. 页面内容和联系方式均可在后台实时修改。",
  theme: {
    primary: "#1d4ed8",
    secondary: "#0f172a",
    accent: "#38bdf8",
  },
};
