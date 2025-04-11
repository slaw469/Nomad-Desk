export interface AuthFormProps {
  onSubmit: (data: any) => void;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  agreeToTerms: boolean;
}