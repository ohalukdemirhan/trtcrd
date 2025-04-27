import axios, { AxiosInstance, AxiosError } from 'axios';
import {
    User,
    Translation,
    TranslationResponse,
    ComplianceTemplate,
    ComplianceCheckResult,
    Subscription,
    UsageStats,
} from '../types';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || '/api/v1',
});

// Add Authorization header if token exists
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Handle errors globally
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

class ApiService {
    public api: AxiosInstance;

    constructor() {
        this.api = api;
    }

    // Auth endpoints
    async login(email: string, password: string): Promise<{ access_token: string }> {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);
        
        try {
            const response = await this.api.post('/auth/login', formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });
            
            // Set the token in the default headers
            if (response.data.access_token) {
                this.api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
            }
            
            return response.data;
        } catch (error) {
            console.error('Login request error:', error);
            throw error;
        }
    }

    async register(email: string, password: string, fullName?: string, companyName?: string): Promise<User> {
        const response = await this.api.post('/auth/register', {
            email,
            password,
            full_name: fullName,
            company_name: companyName,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        });
        return response.data;
    }

    // Translation endpoints
    async createTranslation(
        sourceText: string,
        sourceLang: string,
        targetLang: string,
        context?: Record<string, any>
    ): Promise<TranslationResponse> {
        const response = await this.api.post('/translations', {
            source_text: sourceText,
            source_lang: sourceLang,
            target_lang: targetLang,
            context: context
        });
        return response.data;
    }

    async getTranslation(id: number): Promise<TranslationResponse> {
        const response = await this.api.get(`/translations/${id}`);
        return response.data;
    }

    async listTranslations(skip = 0, limit = 100): Promise<Translation[]> {
        const response = await this.api.get('/translations', {
            params: { skip, limit },
        });
        return response.data;
    }

    // Compliance endpoints
    async listComplianceTemplates(): Promise<ComplianceTemplate[]> {
        const response = await this.api.get('/compliance/templates');
        return response.data;
    }

    async getComplianceTemplate(id: number): Promise<ComplianceTemplate> {
        const response = await this.api.get(`/compliance/templates/${id}`);
        return response.data;
    }

    async checkCompliance(
        text: string,
        templateId: number
    ): Promise<ComplianceCheckResult> {
        const response = await this.api.post('/compliance/check', {
            text,
            template_id: templateId,
        });
        return response.data;
    }

    async getGdprTemplate(): Promise<ComplianceTemplate> {
        const response = await this.api.get('/compliance/presets/gdpr');
        return response.data;
    }

    async getKvkkTemplate(): Promise<ComplianceTemplate> {
        const response = await this.api.get('/compliance/presets/kvkk');
        return response.data;
    }

    // Subscription endpoints
    async getCurrentSubscription(): Promise<Subscription> {
        const response = await this.api.get('/subscriptions/current');
        return response.data;
    }

    async getUsageStats(): Promise<UsageStats> {
        const response = await this.api.get('/subscriptions/usage');
        return response.data;
    }

    async createCheckoutSession(
        tier: string,
        paymentProvider: 'stripe' | 'paddle'
    ): Promise<{ checkout_url: string; session_id?: string; transaction_id?: string }> {
        const response = await this.api.post('/subscriptions/create-checkout-session', {
            tier,
            payment_provider: paymentProvider,
        });
        return response.data;
    }
}

export const apiService = new ApiService(); 