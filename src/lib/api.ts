import type { SiteConfig } from "../../shared/site-config";

const ADMIN_TOKEN_KEY = "landing-admin-token";

async function request<T>(url: string, init?: RequestInit, auth = false): Promise<T> {
  const headers = new Headers(init?.headers);

  if (!headers.has("Content-Type") && !(init?.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...init, headers });
  const payload = (await response.json().catch(() => ({}))) as { message?: string };

  if (!response.ok) {
    throw new Error(payload.message ?? "请求失败");
  }

  return payload as T;
}

export const authStorage = {
  getToken: () => localStorage.getItem(ADMIN_TOKEN_KEY),
  setToken: (token: string) => localStorage.setItem(ADMIN_TOKEN_KEY, token),
  clearToken: () => localStorage.removeItem(ADMIN_TOKEN_KEY),
};

export const api = {
  getSiteConfig: () => request<SiteConfig>("/api/site-config"),
  login: (username: string, password: string) =>
    request<{ ok: boolean; token: string }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),
  logout: () => request<{ ok: boolean }>("/api/admin/logout", { method: "POST" }, true),
  getAdminSiteConfig: () => request<SiteConfig>("/api/admin/site-config", undefined, true),
  saveAdminSiteConfig: (config: SiteConfig) =>
    request<{ ok: boolean; updatedAt: number }>(
      "/api/admin/site-config",
      {
        method: "PUT",
        body: JSON.stringify(config),
      },
      true,
    ),
  uploadAsset: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request<{ ok: boolean; url: string }>(
      "/api/admin/upload",
      {
        method: "POST",
        body: formData,
      },
      true,
    );
  },
};
