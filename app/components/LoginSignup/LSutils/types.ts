// app/components/LoginSignup/LSutils/types.ts

export interface AuthFormProps {
  onSubmit: (data: any) => void | Promise<void>;
  isLoading?: boolean;
  onSocialLogin?: (provider: string) => void | Promise<void>;
}

export interface LoginFormProps extends AuthFormProps {
  onSwitchToSignup: () => void;
}

export interface SignupFormProps extends AuthFormProps {
  onSwitchToLogin: () => void;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}

export interface SocialButtonProps {
  provider: 'google' | 'facebook';
  disabled?: boolean;
  onClick?: () => void;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface User {
  email?: string;
  name?: string;
  provider?: string;
  [key: string]: any; // Allow any additional properties
}
