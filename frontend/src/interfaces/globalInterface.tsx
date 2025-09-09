export interface AppProviderProps {
    children: React.ReactNode
}
export interface AppConfig {
  appName: string;
  appCoolName: string;
  appDescription: string;
  appTagline: string;
  appKeywords: string;
  appAuthor: string;
  appUrl: string;
  appImage: string;
}

export interface AppContextValue {
  configs: AppConfig;
}

