import fs from "node:fs";
import path from "node:path";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "../shared/site-config";
import { dataDir, ensureStorageDirs } from "./storage-paths";

const configPath = path.join(dataDir, "site-config.json");

function ensureDir(): void {
  ensureStorageDirs();
}

export function getConfigPath(): string {
  ensureDir();
  return configPath;
}

export function readSiteConfig(): SiteConfig {
  const filePath = getConfigPath();

  if (!fs.existsSync(filePath)) {
    writeSiteConfig(DEFAULT_SITE_CONFIG);
    return DEFAULT_SITE_CONFIG;
  }

  const raw = fs.readFileSync(filePath, "utf8");

  try {
    const parsed = JSON.parse(raw) as SiteConfig;
    return {
      ...DEFAULT_SITE_CONFIG,
      ...parsed,
      hero: { ...DEFAULT_SITE_CONFIG.hero, ...parsed.hero },
      sections: {
        brands: { ...DEFAULT_SITE_CONFIG.sections.brands, ...parsed.sections?.brands },
        support: { ...DEFAULT_SITE_CONFIG.sections.support, ...parsed.sections?.support },
        cases: { ...DEFAULT_SITE_CONFIG.sections.cases, ...parsed.sections?.cases },
        contact: { ...DEFAULT_SITE_CONFIG.sections.contact, ...parsed.sections?.contact },
      },
      theme: { ...DEFAULT_SITE_CONFIG.theme, ...parsed.theme },
      navItems: parsed.navItems?.length ? parsed.navItems : DEFAULT_SITE_CONFIG.navItems,
      contacts: parsed.contacts?.length ? parsed.contacts : DEFAULT_SITE_CONFIG.contacts,
      brands: parsed.brands?.length ? parsed.brands : DEFAULT_SITE_CONFIG.brands,
      supportItems: parsed.supportItems?.length ? parsed.supportItems : DEFAULT_SITE_CONFIG.supportItems,
      cases: parsed.cases?.length ? parsed.cases : DEFAULT_SITE_CONFIG.cases,
    };
  } catch {
    writeSiteConfig(DEFAULT_SITE_CONFIG);
    return DEFAULT_SITE_CONFIG;
  }
}

export function writeSiteConfig(config: SiteConfig): void {
  const filePath = getConfigPath();
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2), "utf8");
}
