export interface AppProviderProps {
    children: React.ReactNode
}
export interface AppConfig {
  [key: string]: string;
}

export interface AppContextValue {
  configs: AppConfig;
}

