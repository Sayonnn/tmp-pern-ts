import { createContext } from "react";
import type { AppContextValue,AppConfig, AppProviderProps } from "../interfaces/globalInterface";

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: AppProviderProps) {
  const configs: AppConfig = {
    appName: import.meta.env.VITE_APP_NAME,
    appCoolName: import.meta.env.VITE_APP_COOL_NAME,
    appDescription: import.meta.env.VITE_APP_DESCRIPTION,
    appTagline: import.meta.env.VITE_APP_TAGLINE,
    appKeywords: import.meta.env.VITE_APP_KEYWORDS,
    appAuthor: import.meta.env.VITE_APP_AUTHOR,
    appUrl: import.meta.env.VITE_APP_URL,
    appImage: import.meta.env.VITE_APP_IMAGE,
  };

  return (
    <AppContext.Provider value={{ configs }}>
      {children}
    </AppContext.Provider>
  );
}
