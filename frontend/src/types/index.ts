export type User = {
    id: number;
    email: string;
    full_name?: string;
    company_name?: string;
    role: 'admin' | 'user';
    is_active: boolean;
};

export type SubscriptionTier = 'free' | 'basic' | 'professional' | 'enterprise';

export type Subscription = {
    id: number;
    user_id: number;
    tier: SubscriptionTier;
    is_active: boolean;
    monthly_requests_limit: number;
    current_requests_count: number;
    payment_method?: string;
    stripe_customer_id?: string;
    paddle_customer_id?: string;
    created_at: string;
    updated_at: string;
};

export type Translation = {
    id: number;
    user_id: number;
    source_text: string;
    translated_text: string;
    source_lang: string;
    target_lang: string;
    context?: Record<string, any>;
    metadata?: Record<string, any>;
    created_at: string;
    updated_at: string;
};

export type ComplianceRule = {
    name: string;
    description?: string;
    rule_type: string;
    parameters: Record<string, any>;
};

export type ComplianceTemplate = {
    id: number;
    name: string;
    description?: string;
    category: string;
    rules: ComplianceRule[];
    version: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
};

export type ComplianceCheckResult = {
    is_compliant: boolean;
    validation_result: Record<string, any>;
    suggestions: string[];
    overallScore: number;
    checksPerformed: number;
    passedChecks: number;
    failedChecks: number;
};

export type TranslationResponse = {
    translation: Translation;
    compliance_check?: ComplianceCheckResult;
};

export type ApiError = {
    detail: string;
    error_code?: string;
    metadata?: Record<string, any>;
};

export type UsageStats = {
    current_requests: number;
    monthly_limit: number;
    remaining_requests: number;
    usage_percentage: number;
}; 