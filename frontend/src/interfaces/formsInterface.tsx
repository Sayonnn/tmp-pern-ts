
export interface TextInputProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  hidden?: boolean;
}

export interface PasswordInputProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  hidden?: boolean;
}

export interface LoginButtonProps {
  loading?: boolean;
  label?: string;
}

export interface GoogleButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}