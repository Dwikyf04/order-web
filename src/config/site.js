const env = import.meta.env;

export const siteConfig = Object.freeze({
  name: env.VITE_SITE_NAME || "TaHUtech",
  email: env.VITE_SITE_EMAIL || "",
  whatsapp: env.VITE_SITE_WHATSAPP || "",
  logoUrl: env.VITE_SITE_LOGO_URL || "/img/Baru.png",
});
