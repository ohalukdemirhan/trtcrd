export interface User {
  id: number;
  email: string;
  full_name: string;
  company_name?: string;
  role: string;
  is_active: boolean;
  subscription?: {
    tier: string;
    monthly_requests_limit: number;
    current_requests_count: number;
    is_active: boolean;
  };
  created_at: string;
  updated_at: string;
} 