import React, { createContext, useContext, useEffect, useState } from "react";
import { siteConfig as environmentConfig } from "../../config/site";
import { getPublicSiteSettings } from "../../infrastructure/content/contentRepository";

const SiteSettingsContext = createContext(environmentConfig);

export function SiteSettingsProvider({ children }) {
  const [config, setConfig] = useState(environmentConfig);

  useEffect(() => {
    let cancelled = false;
    getPublicSiteSettings()
      .then((databaseConfig) => {
        if (!cancelled) setConfig((current) => ({ ...current, ...databaseConfig }));
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={config}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
