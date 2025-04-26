import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Carousel, Container, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import 'animate.css';

// Flag for mock data and demo mode visibility
const showDemoIndicators = process.env.NODE_ENV === 'development' || process.env.REACT_APP_SHOW_MOCK_INDICATORS === 'true';

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: 'Dr. Sarah Johnson',
    role: 'Healthcare Administrator',
    image: 'https://randomuser.me/api/portraits/women/32.jpg',
    text: 'TrtCrd has revolutionized our patient communication. The HIPAA compliance checks give me peace of mind when translating sensitive medical documents.',
  },
  {
    id: 2,
    name: 'Alex Rivera',
    role: 'Legal Consultant',
    image: 'https://randomuser.me/api/portraits/men/54.jpg',
    text: 'As someone who frequently deals with international clients, TrtCrd ensures my documents meet GDPR requirements across multiple languages.',
  },
  {
    id: 3,
    name: 'Michelle Chang',
    role: 'E-commerce Director',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    text: 'Our privacy policies need to comply with CCPA for California customers. TrtCrd makes it easy to create and verify translated versions.',
  },
];

// Pricing plans
const pricingPlans = [
  {
    name: 'Basic',
    price: 29,
    limit: 10000, // 10k words
    features: ['GDPR compliance checks', 'Up to 10 languages', 'Email support'],
  },
  {
    name: 'Professional',
    price: 79,
    limit: 50000, // 50k words
    features: ['GDPR & HIPAA compliance checks', 'Up to 30 languages', 'Priority support', 'API access'],
  },
  {
    name: 'Enterprise',
    price: 149,
    limit: 150000, // 150k words
    features: ['All compliance frameworks', 'All available languages', '24/7 dedicated support', 'Advanced analytics'],
  },
];

const HomePage: React.FC = () => {
  // State for counters
  const [gdprCount, setGdprCount] = useState<number>(0);
  const [hipaaCount, setHipaaCount] = useState<number>(0);
  const [ccpaCount, setCcpaCount] = useState<number>(0);
  
  // State for pricing calculator
  const [wordsPerMonth] = useState<number>(10000);
  const [selectedPlan] = useState<string>('Basic');
  
  // Simulate increasing compliance counters
  useEffect(() => {
    const interval = setInterval(() => {
      setGdprCount((prev: number) => prev + Math.floor(Math.random() * 5));
      setHipaaCount((prev: number) => prev + Math.floor(Math.random() * 3));
      setCcpaCount((prev: number) => prev + Math.floor(Math.random() * 2));
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Calculate monthly cost based on words and plan
  const calculateMonthlyCost = () => {
    const plan = pricingPlans.find(p => p.name === selectedPlan);
    if (!plan) return 0;
    
    if (wordsPerMonth <= plan.limit) {
      return plan.price;
    }
    
    const extraWords = wordsPerMonth - plan.limit;
    const extraWordsCost = Math.ceil(extraWords / 1000) * (plan.price / 10);
    
    return plan.price + extraWordsCost;
  };
  
  return (
    <div className="min-vh-100 d-flex flex-column">
      <main className="flex-grow-1">
        {/* Dev Mode Notice */}
        {showDemoIndicators && (
          <Alert variant="info" className="mb-0 text-center">
            <small>
              <strong>Development Mode:</strong> This page currently displays sample data for demonstration purposes.
            </small>
          </Alert>
        )}
        
        {/* Hero Section */}
        <section className="bg-primary text-white py-5">
          <Container>
            <Row className="align-items-center">
              <Col lg={6}>
                <h1 className="display-4 fw-bold mb-4 animate__animated animate__fadeIn">
                  Secure & Compliant Translations
                </h1>
                <p className="lead mb-4 animate__animated animate__fadeIn animate__delay-1s">
                  Transform your content while maintaining compliance with GDPR, HIPAA, and CCPA regulations.
                </p>
                <Link 
                  to="/register" 
                  className="btn btn-light btn-lg transition-all duration-300 hover:scale-105"
                >
                  Get Started Free
                </Link>
              </Col>
              <Col lg={6} className="mt-4 mt-lg-0">
                <img
                  src="/hero-image.svg"
                  alt="Translation Service"
                  className="img-fluid transition-transform duration-300 hover:scale-105"
                />
              </Col>
            </Row>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-5">
          <Container>
            <h2 className="text-center mb-5">Why Choose TrtCrd?</h2>
            <Row className="g-4">
              <Col md={4}>
                <div className="text-center transition-transform duration-300 hover:scale-105">
                  <h3>GDPR Compliant</h3>
                  <p>Ensure your translations meet EU data protection standards.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center transition-transform duration-300 hover:scale-105">
                  <h3>HIPAA Ready</h3>
                  <p>Secure handling of protected health information.</p>
                </div>
              </Col>
              <Col md={4}>
                <div className="text-center transition-transform duration-300 hover:scale-105">
                  <h3>CCPA Certified</h3>
                  <p>California privacy requirements built-in.</p>
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        <Container>
          <Row className="my-5">
            {/* Testimonials Section */}
            <Col md={12}>
              <h2 className="text-center mb-4">What Our Users Say</h2>
              {showDemoIndicators && (
                <div className="text-center mb-3">
                  <Badge bg="secondary">Sample Testimonials</Badge>
                </div>
              )}
              <div className="d-flex flex-wrap justify-content-around">
                {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="card mb-4" style={{ width: '18rem' }}>
                    <img src={testimonial.image} className="card-img-top" alt={testimonial.name} />
                    <div className="card-body">
                      <h5 className="card-title">{testimonial.name}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">{testimonial.role}</h6>
                      <p className="card-text">{testimonial.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Col>

            {/* Stats Section */}
            <Col md={12} className="text-center my-5">
              <h3>Trust by Companies Worldwide</h3>
              {showDemoIndicators && (
                <div className="mb-2">
                  <Badge bg="secondary">Sample Statistics</Badge>
                </div>
              )}
              <div className="d-flex justify-content-around mt-4">
                <div>
                  <h4>{gdprCount.toLocaleString()}</h4>
                  <p>GDPR Compliant Translations</p>
                </div>
                <div>
                  <h4>{hipaaCount.toLocaleString()}</h4>
                  <p>HIPAA Verified Documents</p>
                </div>
                <div>
                  <h4>{ccpaCount.toLocaleString()}</h4>
                  <p>CCPA Compliant Translations</p>
                </div>
              </div>
            </Col>

            {/* Pricing Section */}
            <Col md={12}>
              <h2 className="text-center mb-4">Pricing Plans</h2>
              <div className="d-flex flex-wrap justify-content-around">
                {pricingPlans.map(plan => (
                  <div key={plan.name} className="card mb-4" style={{ width: '18rem' }}>
                    <div className="card-body">
                      <h5 className="card-title">{plan.name}</h5>
                      <h6 className="card-subtitle mb-2">${plan.price}/month</h6>
                      <p className="card-text">Up to {plan.limit.toLocaleString()} words</p>
                      <ul className="list-unstyled">
                        {plan.features.map((feature, index) => (
                          <li key={index}>✓ {feature}</li>
                        ))}
                      </ul>
                      <Link to="/register" className="btn btn-primary">Choose {plan.name}</Link>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </main>

      {/* Footer */}
      <footer className="bg-light py-4">
        <Container>
          <div className="text-center">
            <p className="mb-0">© 2024 TrtCrd. All rights reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};

export default HomePage; 