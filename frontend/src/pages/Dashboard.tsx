import React, { useState } from 'react';
import { Tabs, Tab, Card, Button, Form, Badge, Alert, Row, Col, ProgressBar } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTranslation, AVAILABLE_LANGUAGES, ComplianceResult } from '../contexts/TranslationContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status) {
    case 'compliant':
      return 'success';
    case 'warning':
      return 'warning';
    case 'violation':
      return 'danger';
    default:
      return 'primary';
  }
};

const ComplianceResultItem: React.FC<{ result: ComplianceResult }> = ({ result }) => {
  const statusColor = getStatusColor(result.status);
  
  return (
    <div className="mb-3">
      <Alert variant={statusColor}>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="fw-bold mb-1">{result.type}</div>
            <div>{result.message}</div>
            {result.details && <div className="text-muted mt-1">{result.details}</div>}
          </div>
          <Badge bg={statusColor} className="ms-2">
            {result.status}
          </Badge>
        </div>
      </Alert>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const {
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
    error
  } = useTranslation();

  const [activeTab, setActiveTab] = useState('editor');

  const handleSourceLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = AVAILABLE_LANGUAGES.find(lang => lang.code === e.target.value);
    if (selected) setSourceLanguage(selected);
  };

  const handleTargetLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = AVAILABLE_LANGUAGES.find(lang => lang.code === e.target.value);
    if (selected) setTargetLanguage(selected);
  };

  const handleSourceTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSourceText(e.target.value);
  };

  // Generate chart data for compliance score
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Compliance Score',
        data: usageStats && usageStats.usage_percentage ? 
          [
            Math.max(60, usageStats.usage_percentage - 10), 
            Math.max(65, usageStats.usage_percentage - 8),
            Math.max(70, usageStats.usage_percentage - 5),
            Math.max(75, usageStats.usage_percentage - 3),
            Math.max(80, usageStats.usage_percentage - 1),
            usageStats.usage_percentage
          ] : [85, 88, 92, 94, 96, complianceScore || 98],
        fill: false,
        backgroundColor: '#2A5C82',
        borderColor: '#2A5C82',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Monthly Compliance Score',
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
  };

  // GDPR rules mock data
  const gdprRules = [
    { id: 1, title: 'Personal Data Processing', description: 'Ensure that all personal data is processed lawfully, fairly, and transparently.' },
    { id: 2, title: 'Data Subject Rights', description: 'Include information about data subject rights such as access, rectification, and erasure.' },
    { id: 3, title: 'Consent Language', description: 'Ensure that consent language is clear, specific, and unambiguous.' },
    { id: 4, title: 'Data Transfer', description: 'Disclose any international data transfers and the safeguards in place.' },
    { id: 5, title: 'Data Retention', description: 'Specify for how long personal data will be stored and the criteria for determining this period.' },
  ];
    
  // HIPAA rules mock data
  const hipaaRules = [
    { id: 1, title: 'PHI Protection', description: 'Ensure protected health information (PHI) is properly secured.' },
    { id: 2, title: 'Authorization', description: 'Include clear authorization language for the use and disclosure of PHI.' },
    { id: 3, title: 'Minimum Necessary Standard', description: 'Ensure only the minimum necessary PHI is used or disclosed.' },
    { id: 4, title: 'Business Associate Agreements', description: 'Reference appropriate business associate agreements when applicable.' },
    { id: 5, title: 'Breach Notification', description: 'Include provisions for breach notification procedures.' },
  ];

  // CCPA rules mock data
  const ccpaRules = [
    { id: 1, title: 'Right to Know', description: 'Inform consumers about the personal information collected and its purpose.' },
    { id: 2, title: 'Right to Delete', description: 'Include language about the consumer\'s right to request deletion of personal information.' },
    { id: 3, title: 'Right to Opt-Out', description: 'Provide information about the right to opt-out of the sale of personal information.' },
    { id: 4, title: 'Non-Discrimination', description: 'Ensure non-discrimination for exercising CCPA rights.' },
    { id: 5, title: 'Categories of Information', description: 'Clearly list the categories of personal information collected and shared.' },
  ];

  const renderEditorTab = () => (
    <Row>
      <Col md={8}>
        <Card className="mb-4">
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Translation Editor</h5>
              </div>
              <div>
                <Button
                  variant={mode === 'translate' ? 'primary' : 'outline-primary'}
                  className="me-2"
                  onClick={() => setMode('translate')}
                >
                  Translate
                </Button>
                <Button 
                  variant={mode === 'compliance' ? 'primary' : 'outline-primary'}
                  onClick={() => setMode('compliance')}
                >
                  Check Compliance
                </Button>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Select Source Language</Form.Label>
              <Form.Select 
                value={sourceLanguage.code}
                onChange={handleSourceLanguageChange}
              >
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
        
            <Form.Group className="mb-3">
              <Form.Label>Source Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                value={sourceText}
                onChange={handleSourceTextChange}
                placeholder="Enter text to translate or check for compliance..."
              />
            </Form.Group>
            
            {mode === 'translate' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Select Target Language</Form.Label>
                  <Form.Select
                    value={targetLanguage.code}
                    onChange={handleTargetLanguageChange}
                  >
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                
                <Button 
                  variant="primary" 
                  onClick={() => translate()} 
                  disabled={isTranslating || !sourceText.trim()}
                  className="w-100"
                >
                  {isTranslating ? 'Translating...' : 'Translate'}
                </Button>
                
                {translatedText && (
                  <Form.Group className="mt-4">
                    <Form.Label>Translated Text</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={8}
                      value={translatedText}
                      readOnly
                    />
                  </Form.Group>
                )}
              </>
            )}
            
            {mode === 'compliance' && (
              <>
                <Button 
                  variant="primary" 
                  onClick={() => checkCompliance()} 
                  disabled={isCheckingCompliance || !sourceText.trim()}
                  className="w-100"
                >
                  {isCheckingCompliance ? 'Checking Compliance...' : 'Check Compliance'}
                </Button>
                
                {complianceResults.length > 0 && (
                  <div className="mt-4">
                    <h5>Compliance Results</h5>
                    {complianceResults.map((result, index) => (
                      <ComplianceResultItem key={index} result={result} />
                    ))}
                  </div>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Col>
      
      <Col md={4}>
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Usage Stats</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>Words Used</span>
                <span>
                  <strong>{usageStats.total_words_translated.toLocaleString()}</strong> / {usageStats.monthly_limit.toLocaleString()}
                </span>
              </div>
              <ProgressBar 
                now={usageStats.usage_percentage} 
                variant={usageStats.usage_percentage > 80 ? 'warning' : 'primary'} 
              />
            </div>
            
            <div className="mb-3">
              <div className="d-flex justify-content-between mb-1">
                <span>Compliance Score</span>
                <span>
                  <strong>{complianceScore}%</strong>
                </span>
              </div>
              <ProgressBar 
                now={complianceScore} 
                variant={complianceScore > 90 ? 'success' : complianceScore > 70 ? 'warning' : 'danger'} 
              />
            </div>
            
            <div className="text-center mt-4">
              <Button variant="outline-primary" size="sm">
                Upgrade Plan
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  const renderAnalyticsTab = () => (
    <Row>
      <Col md={8}>
        <Card className="mb-4">
          <Card.Header>
            <h5 className="mb-0">Compliance Score Trend</h5>
          </Card.Header>
          <Card.Body>
            <Line data={chartData} options={chartOptions} />
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card>
          <Card.Header>
            <h5 className="mb-0">Recent Activity</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <strong>Last Translation:</strong>
              <p className="mb-1 text-muted">
                {translationHistory[0]?.timestamp
                  ? new Date(translationHistory[0].timestamp).toLocaleDateString()
                  : 'No translations yet'}
              </p>
            </div>
            <div>
              <strong>Compliance Status:</strong>
              <p className="mb-0 text-muted">
                {complianceScore >= 90 ? 'Excellent' : complianceScore >= 70 ? 'Good' : 'Needs Improvement'}
              </p>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="dashboard py-4">
      <div className="container">
        <h1 className="mb-4">Translation Dashboard</h1>
        <div>
          <nav className="nav nav-tabs mb-4">
            <button
              className={`nav-link ${activeTab === 'editor' ? 'active' : ''}`}
              onClick={() => setActiveTab('editor')}
            >
              Translation Editor
            </button>
            <button
              className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              Analytics
            </button>
          </nav>
          <div className="tab-content">
            {activeTab === 'editor' && renderEditorTab()}
            {activeTab === 'analytics' && renderAnalyticsTab()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 