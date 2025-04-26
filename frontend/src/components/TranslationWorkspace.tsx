import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTranslation } from '../store/slices/translationSlice';
import { checkCompliance } from '../store/slices/complianceSlice';
import { RootState } from '../store';
import { ComplianceCheckResult, TranslationResponse } from '../types';

// Define language options
const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'tr', name: 'Turkish' },
  { code: 'ru', name: 'Russian' }
];

// Define compliance frameworks
const COMPLIANCE_FRAMEWORKS = [
  { id: 'gdpr', name: 'GDPR (EU)', description: 'General Data Protection Regulation' },
  { id: 'hipaa', name: 'HIPAA (US)', description: 'Health Insurance Portability and Accountability Act' },
  { id: 'ccpa', name: 'CCPA (California)', description: 'California Consumer Privacy Act' },
  { id: 'kvkk', name: 'KVKK (Turkey)', description: 'Turkish Personal Data Protection Law' },
  { id: 'lgpd', name: 'LGPD (Brazil)', description: 'Lei Geral de Proteção de Dados' },
  { id: 'pipl', name: 'PIPL (China)', description: 'Personal Information Protection Law' },
  { id: 'appi', name: 'APPI (Japan)', description: 'Act on Protection of Personal Information' },
  { id: 'finra', name: 'FINRA/SEC (US)', description: 'Financial Industry Regulatory Authority' }
];

// Interface for the component props
interface TranslationWorkspaceProps {
  onSaveTranslation?: (data: {
    sourceText: string;
    translatedText: string;
    sourceLang: string;
    targetLang: string;
    complianceFramework: string;
    isCompliant: boolean;
    complianceScore: number;
  }) => void;
}

const TranslationWorkspace: React.FC<TranslationWorkspaceProps> = ({ onSaveTranslation }) => {
  // State for form inputs
  const [sourceText, setSourceText] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('fr');
  const [selectedFramework, setSelectedFramework] = useState('gdpr');
  
  // Redux hooks
  const dispatch = useDispatch();
  const { currentTranslation, isLoading: isTranslating } = useSelector((state: RootState) => state.translation);
  const { checkResult, isLoading: isCheckingCompliance } = useSelector((state: RootState) => state.compliance);
  
  // Handle translation
  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    
    try {
      const resultAction = await dispatch(createTranslation({
        sourceText,
        sourceLang,
        targetLang,
        context: { complianceFramework: selectedFramework }
      }) as any);
      
      if (createTranslation.fulfilled.match(resultAction)) {
        const translationResult = resultAction.payload as TranslationResponse;
        
        if (translationResult) {
          const complianceAction = await dispatch(checkCompliance({
            text: translationResult.translated_text,
            templateId: parseInt(selectedFramework)
          }) as any);
          
          if (onSaveTranslation && complianceAction.payload) {
            onSaveTranslation({
              sourceText,
              translatedText: translationResult.translated_text,
              sourceLang,
              targetLang,
              complianceFramework: selectedFramework,
              isCompliant: complianceAction.payload.is_compliant,
              complianceScore: complianceAction.payload.validation_result?.score || 0
            });
          }
        }
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
  };
  
  // Handle manual compliance check
  const handleCheckCompliance = async () => {
    if (!currentTranslation) return;
    
    try {
      await dispatch(checkCompliance({
        text: currentTranslation.translated_text,
        templateId: parseInt(selectedFramework)
      }) as any);
    } catch (error) {
      console.error('Compliance check error:', error);
    }
  };
  
  // Get the translated text from the current translation
  const getTranslatedText = () => {
    if (currentTranslation) {
      return currentTranslation.translated_text;
    }
    return '';
  };
  
  return (
    <div className="card shadow-sm">
      <div className="card-header bg-white">
        <h5 className="mb-0">Translation & Compliance Workspace</h5>
      </div>
      <div className="card-body">
        <div className="row mb-4">
          <div className="col-md-6 mb-3 mb-md-0">
            <h6>Source Text</h6>
            <textarea 
              className="form-control mb-2" 
              rows={6} 
              placeholder="Enter text to translate..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              disabled={isTranslating}
            ></textarea>
            <div className="d-flex justify-content-between">
              <select 
                className="form-select w-auto"
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                disabled={isTranslating}
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <button 
                className="btn btn-primary"
                onClick={handleTranslate}
                disabled={isTranslating || !sourceText.trim()}
              >
                {isTranslating ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Translating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-language me-1"></i> Translate
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="col-md-6">
            <h6>Translation</h6>
            <textarea 
              className="form-control mb-2" 
              rows={6} 
              placeholder="Translation will appear here..."
              value={getTranslatedText()}
              readOnly={isTranslating}
            ></textarea>
            <div className="d-flex justify-content-between">
              <select 
                className="form-select w-auto"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                disabled={isTranslating}
              >
                {LANGUAGES.filter(lang => lang.code !== sourceLang).map(lang => (
                  <option key={lang.code} value={lang.code}>{lang.name}</option>
                ))}
              </select>
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigator.clipboard.writeText(getTranslatedText())}
                disabled={!getTranslatedText()}
              >
                <i className="fas fa-copy me-1"></i> Copy
              </button>
            </div>
          </div>
        </div>
        
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border">
              <div className="card-header bg-light">
                <h6 className="mb-0">Compliance Check</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Select Compliance Framework</label>
                    <select 
                      className="form-select"
                      value={selectedFramework}
                      onChange={(e) => setSelectedFramework(e.target.value)}
                      disabled={isCheckingCompliance}
                    >
                      {COMPLIANCE_FRAMEWORKS.map(framework => (
                        <option key={framework.id} value={framework.id}>
                          {framework.name} - {framework.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3 d-flex align-items-end">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={handleCheckCompliance}
                      disabled={isCheckingCompliance || !getTranslatedText()}
                    >
                      {isCheckingCompliance ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Checking...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-check-circle me-1"></i> Check Compliance
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {checkResult && (
                  <div className="mt-3">
                    <div className={`alert ${checkResult.is_compliant ? 'alert-success' : 'alert-warning'}`}>
                      <div className="d-flex align-items-center mb-2">
                        <div className={`badge ${checkResult.is_compliant ? 'bg-success' : 'bg-warning text-dark'} me-2`}>
                          {checkResult.is_compliant ? '100%' : '75%'}
                        </div>
                        <h6 className="mb-0">
                          {checkResult.is_compliant 
                            ? `Compliant with ${COMPLIANCE_FRAMEWORKS.find(f => f.id === selectedFramework)?.name}` 
                            : `Non-compliant with ${COMPLIANCE_FRAMEWORKS.find(f => f.id === selectedFramework)?.name}`}
                        </h6>
                      </div>
                      
                      {checkResult.suggestions && checkResult.suggestions.length > 0 && (
                        <div>
                          <h6>Suggestions:</h6>
                          <ul className="mb-0">
                            {checkResult.suggestions.map((suggestion, index) => (
                              <li key={index}>{suggestion}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-end">
          <button 
            className="btn btn-success"
            disabled={!getTranslatedText() || Boolean(checkResult && checkResult.is_compliant === false)}
          >
            <i className="fas fa-save me-1"></i> Save Translation
          </button>
        </div>
      </div>
    </div>
  );
};

export default TranslationWorkspace; 