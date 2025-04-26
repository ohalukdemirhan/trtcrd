import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Card, Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

// Import icons as images to avoid JSX issues
const GoogleIcon = () => (
  <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" alt="Google" width={20} height={20} />
);

const MicrosoftIcon = () => (
  <img src="https://cdn-icons-png.flaticon.com/512/732/732221.png" alt="Microsoft" width={18} height={18} />
);

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { login, error: authError, loading: authLoading } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const [formErrors, setFormErrors] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors when user corrects the field
        if (formErrors[name as keyof typeof formErrors]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = (): boolean => {
        let valid = true;
        const newErrors = { ...formErrors };

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
            valid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setFormErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;
        
        setIsLoading(true);
        
        try {
            await login(formData.email, formData.password);
            
            // If remember me is checked, store the email
            if (formData.rememberMe) {
                localStorage.setItem('rememberedEmail', formData.email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }
            
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        setIsLoading(true);
        
        // TODO: Implement social login
        console.log(`Logging in with ${provider}`);
        setIsLoading(false);
    };

    const handleForgotPassword = () => {
        navigate('/forgot-password');
    };

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={8} lg={5}>
                    <Card className="shadow border-0">
                        <Card.Body className="p-4 p-md-5">
                            <div className="text-center mb-4">
                                <h2 className="fw-bold mb-1">Welcome Back</h2>
                                <p className="text-muted">Sign in to your TrtCrd account</p>
                            </div>
                            
                            {(authError || Object.values(formErrors).some(error => error)) && (
                                <Alert variant="danger">
                                    {authError || Object.values(formErrors).find(error => error)}
                                </Alert>
                            )}
                            
                            {/* Social login buttons are commented out for MVP focus */}
                            {/* <div className="mb-4">
                                <div className="d-grid gap-2">
                                    <Button 
                                        variant="outline-secondary" 
                                        className="d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => handleSocialLogin('Google')}
                                        disabled={isLoading || authLoading}
                                    >
                                        <GoogleIcon />
                                        <span>Continue with Google</span>
                                    </Button>
                                    <Button 
                                        variant="outline-secondary" 
                                        className="d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => handleSocialLogin('Microsoft')}
                                        disabled={isLoading || authLoading}
                                    >
                                        <MicrosoftIcon />
                                        <span>Continue with Microsoft</span>
                                    </Button>
                                </div>
                            </div> */}
                            
                            <div className="position-relative my-4">
                                <hr />
                                <div className="position-absolute top-50 start-50 translate-middle px-3 bg-white">
                                    <small className="text-muted">Or sign in with email</small>
                                </div>
                            </div>
                            
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.email}
                                        disabled={isLoading || authLoading}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Form.Group className="mb-3">
                                    <div className="d-flex justify-content-between">
                                        <Form.Label>Password</Form.Label>
                                        <Button 
                                            variant="link" 
                                            className="p-0 text-decoration-none"
                                            onClick={handleForgotPassword}
                                            size="sm"
                                            disabled={isLoading || authLoading}
                                        >
                                            Forgot password?
                                        </Button>
                                    </div>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        isInvalid={!!formErrors.password}
                                        disabled={isLoading || authLoading}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formErrors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                
                                <Form.Group className="mb-4">
                                    <Form.Check
                                        type="checkbox"
                                        id="rememberMe"
                                        name="rememberMe"
                                        checked={formData.rememberMe}
                                        onChange={handleChange}
                                        label="Remember me"
                                        disabled={isLoading || authLoading}
                                    />
                                </Form.Group>
                                
                                <div className="d-grid">
                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        size="lg" 
                                        disabled={isLoading || authLoading}
                                    >
                                        {(isLoading || authLoading) ? (
                                            <>
                                                <Spinner as="span" animation="border" size="sm" className="me-2" />
                                                Signing in...
                                            </>
                                        ) : (
                                            'Sign In'
                                        )}
                                    </Button>
                                </div>
                            </Form>
                            
                            <div className="text-center mt-4">
                                <p className="mb-0">
                                    Don't have an account? <Link to="/register">Sign Up</Link>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login; 