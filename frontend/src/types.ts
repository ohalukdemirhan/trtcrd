export interface User {
  id: number;
  email: string;
  role: 'user' | 'admin';
  is_active: boolean;
  full_name?: string;
  company_name?: string;
}

export type ComplianceType = 'GDPR' | 'HIPAA' | 'CCPA';

export interface ComplianceCheckResult {
  is_compliant: boolean;
  validation_result: Record<string, any>;
  suggestions: string[];
  overallScore: number;
  checksPerformed: number;
  passedChecks: number;
  failedChecks: number;
}

export type ComplianceStatus = 'compliant' | 'warning' | 'violation';

export interface ComplianceRule {
  name: string;
  description?: string;
  rule_type: string;
  parameters: Record<string, any>;
}

export interface ComplianceTemplate {
  id: number;
  name: string;
  description?: string;
  category: string;
  rules: ComplianceRule[];
  version: string;
  status: 'Active' | 'Inactive';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ComplianceResult {
  type: ComplianceType;
  status: ComplianceStatus;
  message: string;
  details?: string;
}

export interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: Date;
  wordCount: number;
  compliance: {
    overall: ComplianceStatus;
    details: ComplianceResult[];
  };
}

export interface Translation {
  id: number;
  source_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  created_at: string;
  word_count: number;
  compliance_status?: ComplianceStatus;
  metadata?: Record<string, any>;
}

export interface TranslationResponse {
  id: number;
  source_text: string;
  translated_text: string;
  source_language: string;
  target_language: string;
  created_at: string;
  word_count: number;
  compliance_status?: ComplianceStatus;
  metadata?: Record<string, any>;
  status: 'completed' | 'in_progress' | 'failed';
  error?: string;
  compliance_check?: ComplianceCheckResult;
  translation?: Translation;
}

export interface Subscription {
  id: number;
  tier: string;
  status: 'active' | 'inactive' | 'cancelled';
  word_limit: number;
  monthly_requests_limit: number;
  current_requests_count: number;
  expires_at: string;
  created_at: string;
}

export interface UsageStats {
  total_words_translated: number;
  words_remaining: number;
  translations_this_month: number;
  compliance_checks_this_month: number;
  subscription_status: 'active' | 'inactive' | 'cancelled';
  current_requests: number;
  monthly_limit: number;
  usage_percentage: number;
} 