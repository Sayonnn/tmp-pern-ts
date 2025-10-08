
export interface TextInputProps {
  label?: string;
  name: string;
  type?: string;
  value: string;
  disabled?: boolean;
  maxLength?: number;
  inputMode?: string;
  pattern?: string;
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
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string | null;
  hidden?: boolean;
}

export interface LoginButtonProps {
  loading?: boolean;
  label?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export interface GoogleButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

export interface PrimaryLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export interface ForgotPasswordLinkProps {
  to?: string; 
  children?: React.ReactNode;
  className?: string;
}
