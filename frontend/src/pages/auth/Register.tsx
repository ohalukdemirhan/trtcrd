import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import PasswordStrengthMeter from '../../components/auth/PasswordStrengthMeter';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { register } from '../../store/slices/authSlice';

// Import icons as images to avoid JSX issues
const GoogleIcon = () => (
  <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" width={20} height={20} />
);

const MicrosoftIcon = () => (
  <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="Microsoft" width={18} height={18} />
);

const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    terms: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.terms) {
      setError('Please accept the terms and conditions');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await dispatch(
        register({
          email: formData.email,
          password: formData.password,
          full_name: formData.fullName,
          company_name: formData.companyName,
        })
      ).unwrap();
      
      navigate('/');
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate social login
    setTimeout(() => {
      console.log(`Logging in with ${provider}`);
      setIsLoading(false);
      // In a real app, this would redirect to OAuth flow
    }, 1000);
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="shadow border-0">
            <Card.Body className="p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-1">Create Your Account</h2>
                <p className="text-muted">Join TrtCrd for secure and compliant translations</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              {/* Social login buttons are commented out for MVP focus */}
              {/* <div className="mb-4">
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-secondary" 
                    className="d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleSocialLogin('Google')}
                    disabled={isLoading}
                  >
                    <GoogleIcon />
                    <span>Continue with Google</span>
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="d-flex align-items-center justify-content-center gap-2"
                    onClick={() => handleSocialLogin('Microsoft')}
                    disabled={isLoading}
                  >
                    <MicrosoftIcon />
                    <span>Continue with Microsoft</span>
                  </Button>
                </div>
              </div> */}
              
              <div className="position-relative my-4">
                <hr />
                <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white">
                  <small className="text-muted">Or register with email</small>
                </div>
              </div>
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Company Name (Optional)</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  
                  {/* <PasswordStrengthMeter password={formData.password} /> // Commented out for MVP focus */}
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    id="terms"
                    name="terms"
                    checked={formData.terms}
                    onChange={handleChange}
                    label={
                      <span>
                        I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                      </span>
                    }
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" className="me-2" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </div>
              </Form>
              
              <div className="text-center mt-4">
                <p className="mb-0">
                  Already have an account? <Link to="/login">Log In</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 