import React, { useState } from 'react';
import { LanguageChip } from './LanguageChip';
import { ComplianceStatus } from '../compliance/ComplianceStatus';
import { Button } from '../ui/Button';

// Mock data for languages and compliance templates
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
];

const COMPLIANCE_TEMPLATES = [
  { id: 'gdpr', name: 'GDPR' },
  { id: 'hipaa', name: 'HIPAA' },
  { id: 'ccpa', name: 'CCPA' },
  { id: 'kvkk', name: 'KVKK' },
];

interface TranslationWorkspaceProps {
  onTranslate?: (sourceText: string, sourceLang: string, targetLang: string, complianceTemplate?: string) => void;
  isLoading?: boolean;
  result?: {
    translatedText: string;
    isCompliant: boolean;
    complianceScore?: number;
    suggestions?: string[];
  };
}

/**
 * Main translation workspace with split-screen layout
 */
export const TranslationWorkspace: React.FC<TranslationWorkspaceProps> = ({
  onTranslate,
  isLoading = false,
  result,
}) => {
  // State for form inputs
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('es');
  const [checkCompliance, setCheckCompliance] = useState(false);
  const [complianceTemplate, setComplianceTemplate] = useState('gdpr');

  // Handle translation submission
  const handleTranslate = () => {
    if (onTranslate && sourceText.trim()) {
      onTranslate(
        sourceText,
        sourceLang,
        targetLang,
        checkCompliance ? complianceTemplate : undefined
      );
    }
  };

  return (
    <div className="w-full">
      {/* Main workspace container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source text panel */}
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Source Text</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {LANGUAGES.map((lang) => (
                <LanguageChip
                  key={lang.code}
                  code={lang.code}
                  name={lang.name}
                  selected={sourceLang === lang.code}
                  onClick={() => setSourceLang(lang.code)}
                />
              ))}
            </div>
            <textarea
              className="input h-64 resize-none"
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            />
          </div>
          
          {/* Compliance options */}
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="checkCompliance"
                checked={checkCompliance}
                onChange={(e) => setCheckCompliance(e.target.checked)}
                className="mr-2 h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="checkCompliance" className="text-sm font-medium">
                Check compliance
              </label>
            </div>
            
            {checkCompliance && (
              <div className="ml-6">
                <p className="text-sm mb-2">Select compliance template:</p>
                <div className="flex flex-wrap gap-2">
                  {COMPLIANCE_TEMPLATES.map((template) => (
                    <button
                      key={template.id}
                      className={`px-3 py-1 text-sm rounded-full ${
                        complianceTemplate === template.id
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                      }`}
                      onClick={() => setComplianceTemplate(template.id)}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Target text panel */}
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Target Text</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {LANGUAGES.map((lang) => (
                <LanguageChip
                  key={lang.code}
                  code={lang.code}
                  name={lang.name}
                  selected={targetLang === lang.code}
                  onClick={() => setTargetLang(lang.code)}
                />
              ))}
            </div>
            <div className="relative">
              {isLoading ? (
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
                </div>
              ) : result ? (
                <div className="space-y-4">
                  <textarea
                    className="input h-64 resize-none"
                    value={result.translatedText}
                    readOnly
                  />
                  {checkCompliance && (
                    <ComplianceStatus
                      isCompliant={result.isCompliant}
                      score={result.complianceScore}
                      suggestions={result.suggestions}
                    />
                  )}
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    Translation will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex justify-center mt-6">
        <Button
          variant="primary"
          size="lg"
          isLoading={isLoading}
          onClick={handleTranslate}
          disabled={!sourceText.trim() || isLoading}
          className="mr-4"
        >
          Translate
        </Button>
        <Button
          variant="neumorphic"
          size="lg"
          onClick={() => setSourceText('')}
          disabled={!sourceText.trim() || isLoading}
        >
          Clear
        </Button>
      </div>
    </div>
  );
}; 