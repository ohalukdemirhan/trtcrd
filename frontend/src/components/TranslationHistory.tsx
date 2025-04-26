import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTranslations } from '../store/slices/translationSlice';
import { RootState } from '../store';
import { Translation } from '../types';

// Helper function to get language name from code
const getLanguageName = (code: string): string => {
  const languages: Record<string, string> = {
    'en': 'English',
    'fr': 'French',
    'de': 'German',
    'es': 'Spanish',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ar': 'Arabic',
    'zh': 'Chinese',
    'ja': 'Japanese',
    'tr': 'Turkish',
    'ru': 'Russian'
  };
  return languages[code] || code;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Helper function to count words in a text
const countWords = (text: string): number => {
  return text.split(/\s+/).filter(Boolean).length;
};

interface TranslationHistoryProps {
  onViewTranslation?: (id: number) => void;
  onDownloadTranslation?: (id: number) => void;
}

const TranslationHistory: React.FC<TranslationHistoryProps> = ({
  onViewTranslation,
  onDownloadTranslation
}) => {
  const dispatch = useDispatch();
  const { translations, isLoading } = useSelector((state: RootState) => state.translation);
  
  useEffect(() => {
    dispatch(fetchTranslations({}) as any);
  }, [dispatch]);
  
  if (!isLoading && (!translations || translations.length === 0)) {
    return (
      <div className="card shadow-sm">
        <div className="card-body text-center py-5">
          <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
          <h5>No translations yet</h5>
          <p className="text-muted">Your translation history will appear here.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title mb-3">Translation History</h5>
        
        {isLoading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading translations...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title/Content</th>
                  <th>Languages</th>
                  <th>Words</th>
                  <th>Compliance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {translations.map((translation: Translation) => (
                  <tr key={translation.id}>
                    <td>{formatDate(translation.created_at)}</td>
                    <td>
                      <div className="fw-bold text-truncate" style={{ maxWidth: '200px' }}>
                        {translation.source_text.substring(0, 30)}...
                      </div>
                    </td>
                    <td>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-light text-dark me-1">{getLanguageName(translation.source_language)}</span>
                        <i className="fas fa-arrow-right mx-1 text-muted"></i>
                        <span className="badge bg-light text-dark">{getLanguageName(translation.target_language)}</span>
                      </div>
                    </td>
                    <td>{countWords(translation.source_text)}</td>
                    <td>
                      {translation.compliance_status ? (
                        translation.compliance_status === 'compliant' ? (
                          <span className="badge bg-success">Compliant</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Non-compliant</span>
                        )
                      ) : (
                        <span className="badge bg-secondary">Not checked</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button 
                          className="btn btn-outline-primary" 
                          onClick={() => onViewTranslation && onViewTranslation(translation.id)}
                          title="View translation"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        <button 
                          className="btn btn-outline-secondary" 
                          onClick={() => onDownloadTranslation && onDownloadTranslation(translation.id)}
                          title="Download translation"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TranslationHistory; 