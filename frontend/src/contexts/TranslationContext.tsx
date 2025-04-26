import React, { createContext, useContext, useState, useEffect } from 'react';
import { ComplianceCheckResult, ComplianceResult, ComplianceStatus, ComplianceType, UsageStats } from '../types';
import { api } from '../services/api';

// Define language types (this is unique to this context)
export type Language = {
  code: string;
  name: string;
};

// Available languages
export const AVAILABLE_LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
];

// Re-export ComplianceResult for use in other components
export type { ComplianceResult };

// Translation history item with Language type
export interface LocalTranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  timestamp: Date;
  wordCount: number;
  compliance: {
    overall: ComplianceStatus;
    details: ComplianceResult[];
  };
}

interface TranslationContextType {
  sourceText: string;
  setSourceText: (text: string) => void;
  translatedText: string;
  sourceLanguage: Language;
  setSourceLanguage: (lang: Language) => void;
  targetLanguage: Language;
  setTargetLanguage: (lang: Language) => void;
  isTranslating: boolean;
  translate: () => Promise<void>;
  mode: 'translate' | 'compliance';
  setMode: (mode: 'translate' | 'compliance') => void;
  complianceResults: ComplianceResult[];
  checkCompliance: () => Promise<void>;
  isCheckingCompliance: boolean;
  translationHistory: LocalTranslationHistoryItem[];
  complianceScore: number;
  usageStats: UsageStats;
  isLoading: boolean;
  error: string | null;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState<Language>(AVAILABLE_LANGUAGES[0]);
  const [targetLanguage, setTargetLanguage] = useState<Language>(AVAILABLE_LANGUAGES[1]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [mode, setMode] = useState<'translate' | 'compliance'>('translate');
  const [complianceResults, setComplianceResults] = useState<ComplianceResult[]>([]);
  const [isCheckingCompliance, setIsCheckingCompliance] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<LocalTranslationHistoryItem[]>([]);
  const [complianceScore, setComplianceScore] = useState(85);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [usageStats, setUsageStats] = useState<UsageStats>({
    total_words_translated: 0,
    words_remaining: 10000,
    translations_this_month: 0,
    compliance_checks_this_month: 0,
    subscription_status: 'active',
    current_requests: 0,
    monthly_limit: 10000,
    usage_percentage: 0
  });

  const translate = async (): Promise<void> => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setError(null);
    setIsTranslating(true);
    try {
      const response = await api.createTranslation(
        sourceText,
        sourceLanguage.code,
        targetLanguage.code
      );
      
      if (!response?.translation) {
        throw new Error('Invalid response from translation service');
      }
      
      setTranslatedText(response.translation.translated_text);
      
      // Update translation history
      const newHistoryItem: LocalTranslationHistoryItem = {
        id: response.translation.id.toString(),
        sourceText: response.translation.source_text,
        translatedText: response.translation.translated_text,
        sourceLanguage,
        targetLanguage,
        timestamp: new Date(response.translation.created_at),
        wordCount: sourceText.split(/\s+/).length,
        compliance: {
          overall: response.compliance_check?.is_compliant ? 'compliant' : 'violation',
          details: (response.compliance_check?.validation_result as ComplianceResult[]) || []
        }
      };
      setTranslationHistory(prev => [...prev, newHistoryItem]);
    } catch (err) {
      setError('Translation failed. Please try again.');
      console.error('Translation error:', err);
    } finally {
      setIsLoading(false);
      setIsTranslating(false);
    }
  };

  const checkCompliance = async (): Promise<void> => {
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setError(null);
    setIsCheckingCompliance(true);
    try {
      // Mock compliance check for now
      await new Promise(resolve => setTimeout(resolve, 1000));
      const results: ComplianceResult[] = [
        {
          type: 'GDPR',
          status: 'compliant',
          message: 'No personal data detected'
        }
      ];
      setComplianceResults(results);
      setComplianceScore(95); // Mock score
    } catch (err) {
      setError('Compliance check failed');
    } finally {
      setIsLoading(false);
      setIsCheckingCompliance(false);
    }
  };

  // Update usage stats
  useEffect(() => {
    const updateUsageStats = async () => {
      try {
        // Mock usage stats
        const mockStats: UsageStats = {
          total_words_translated: 1000,
          words_remaining: 9000,
          translations_this_month: 50,
          compliance_checks_this_month: 75,
          subscription_status: 'active',
          current_requests: 50,
          monthly_limit: 100,
          usage_percentage: 50
        };
        setUsageStats(mockStats);
      } catch (error) {
        console.error('Failed to fetch usage stats:', error);
      }
    };
    updateUsageStats();
  }, []);

  return (
    <TranslationContext.Provider value={{
      sourceText,
      setSourceText,
      translatedText,
      sourceLanguage,
      setSourceLanguage,
      targetLanguage,
      setTargetLanguage,
      isTranslating,
      translate,
      mode,
      setMode,
      complianceResults,
      checkCompliance,
      isCheckingCompliance,
      translationHistory,
      complianceScore,
      usageStats,
      isLoading,
      error
    }}>
      {children}
    </TranslationContext.Provider>
  );
}; 