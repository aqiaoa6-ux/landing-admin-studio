import cors from "cors";
import express from "express";
import fs from "node:fs";
import path from "node:path";
import jwt from "jsonwebtoken";
import multer from "multer";
import { readSiteConfig, writeSiteConfig } from "./config-store";
import { DEFAULT_SITE_CONFIG, type SiteConfig } from "../shared/site-config";
import { distDir, ensureStorageDirs, uploadsDir } from "./storage-paths";

const jwtSecret = process.env.ADMIN_JWT_SECRET ?? "landing-admin-secret";
const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
const adminPassword = process.env.ADMIN_PASSWORD ?? "888888";

ensureStorageDirs();

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));
app.use("/uploads", express.static(uploadsDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const suffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname || "") || ".png";
    cb(null, `${suffix}${ext}`);
  },
});

const upload = multer({ storage });

function signToken(): string {
  return jwt.sign({ username: adminUsername }, jwtSecret, { expiresIn: "12h" });
}

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const authHeader = req.headers.authorization ?? "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  try {
    jwt.verify(token, jwtSecret);
    next();
  } catch {
    res.status(401).json({ ok: false, message: "未登录或登录已过期" });
  }
}

function sanitizeConfig(input: Partial<SiteConfig> | null | undefined): SiteConfig {
  const safeInput = input ?? {};
  return {
    ...DEFAULT_SITE_CONFIG,
    ...safeInput,
    hero: { ...DEFAULT_SITE_CONFIG.hero, ...safeInput.hero },
    sections: {
      brands: { ...DEFAULT_SITE_CONFIG.sections.brands, ...safeInput.sections?.brands },
      support: { ...DEFAULT_SITE_CONFIG.sections.support, ...safeInput.sections?.support },
      cases: { ...DEFAULT_SITE_CONFIG.sections.cases, ...safeInput.sections?.cases },
      contact: { ...DEFAULT_SITE_CONFIG.sections.contact, ...safeInput.sections?.contact },
    },
    theme: { ...DEFAULT_SITE_CONFIG.theme, ...safeInput.theme },
    navItems: Array.isArray(safeInput.navItems) ? safeInput.navItems : DEFAULT_SITE_CONFIG.navItems,
    contacts: Array.isArray(safeInput.contacts) ? safeInput.contacts : DEFAULT_SITE_CONFIG.contacts,
    brands: Array.isArray(safeInput.brands) ? safeInput.brands : DEFAULT_SITE_CONFIG.brands,
    supportItems: Array.isArray(safeInput.supportItems) ? safeInput.supportItems : DEFAULT_SITE_CONFIG.supportItems,
    cases: Array.isArray(safeInput.cases) ? safeInput.cases : DEFAULT_SITE_CONFIG.cases,
  };
}

app.get("/api/site-config", (_req, res) => {
  res.json(readSiteConfig());
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body as { username?: string; password?: string };

  if (username !== adminUsername || password !== adminPassword) {
    res.status(401).json({ ok: false, message: "账号或密码错误" });
    return;
  }

  res.json({ ok: true, token: signToken() });
});

app.post("/api/admin/logout", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/admin/site-config", requireAuth, (_req, res) => {
  res.json(readSiteConfig());
});

app.put("/api/admin/site-config", requireAuth, (req, res) => {
  const nextConfig = sanitizeConfig(req.body as SiteConfig);
  writeSiteConfig(nextConfig);
  res.json({ ok: true, updatedAt: Date.now() });
});

app.post("/api/admin/upload", requireAuth, upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ ok: false, message: "未收到文件" });
    return;
  }

  res.json({
    ok: true,
    url: `/uploads/${req.file.filename}`,
  });
});

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/") || req.path.startsWith("/uploads/")) {
      next();
      return;
    }
    res.sendFile(path.join(distDir, "index.html"));
  });
}

const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`Landing admin server running at http://localhost:${port}`);
  console.log(`Admin account: ${adminUsername}`);
  console.log(`Data root: ${process.env.DATA_ROOT ?? path.resolve(process.cwd())}`);
});
