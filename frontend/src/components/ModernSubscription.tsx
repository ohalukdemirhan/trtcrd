import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { AppDispatch } from '../store';
import { createCheckoutSession } from '../store/slices/subscriptionSlice';

// Static subscription plans data
const SUBSCRIPTION_PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 49,
    period: 'month',
    description: 'Perfect for individuals and small teams',
    features: [
      '10,000 words per month',
      '5 compliance frameworks',
      'Basic API access',
      'Email support',
      '1 user'
    ],
    popular: false,
    buttonText: 'Get Started'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    period: 'month',
    description: 'Ideal for growing businesses',
    features: [
      '50,000 words per month',
      '10 compliance frameworks',
      'Full API access',
      'Priority email support',
      '5 users'
    ],
    popular: true,
    buttonText: 'Try Professional'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 249,
    period: 'month',
    description: 'For large organizations with complex needs',
    features: [
      'Unlimited words',
      'All compliance frameworks',
      'Advanced API access',
      '24/7 dedicated support',
      'Unlimited users',
      'Custom integrations',
      'Dedicated account manager'
    ],
    popular: false,
    buttonText: 'Contact Sales'
  }
];

// Static FAQ data
const FAQ_ITEMS = [
  {
    question: 'How does billing work?',
    answer: 'We offer monthly and annual billing options. Annual plans come with a 20% discount. You can upgrade, downgrade, or cancel your subscription at any time.'
  },
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you\'ll be charged the prorated amount for the remainder of your billing cycle. When you downgrade, the new rate will apply at the start of your next billing cycle.'
  },
  {
    question: 'What happens if I exceed my word limit?',
    answer: 'If you exceed your monthly word limit, you\'ll be charged a small fee per additional word. We\'ll notify you when you reach 80% of your limit so you can decide whether to upgrade your plan or pay for the additional usage.'
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes, we offer a 14-day free trial on all plans. No credit card required. You can try all features and decide which plan works best for your needs.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual enterprise plans.'
  }
];

interface ModernSubscriptionProps {
  currentPlan?: string;
  onSelectPlan?: (planId: string) => void;
  onContactSales?: () => void;
}

const ModernSubscription: React.FC<ModernSubscriptionProps> = ({
  currentPlan = '',
  onSelectPlan,
  onContactSales
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscription, checkoutUrl, isLoading, error } = useSelector(
    (state: RootState) => state.subscription
  );
  
  const [billingPeriod, setBillingPeriod] = useState<'month' | 'year'>('month');
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  
  // Redirect to checkout URL if available
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [checkoutUrl]);
  
  // Toggle FAQ item
  const toggleFaq = (index: number) => {
    if (selectedFaq === index) {
      setSelectedFaq(null);
    } else {
      setSelectedFaq(index);
    }
  };
  
  // Calculate price based on billing period
  const calculatePrice = (basePrice: number) => {
    if (billingPeriod === 'year') {
      return Math.round(basePrice * 12 * 0.8); // 20% discount for annual billing
    }
    return basePrice;
  };
  
  // Handle plan selection
  const handleSelectPlan = (planId: string) => {
    if (planId === 'enterprise' && onContactSales) {
      onContactSales();
    } else {
      // For other plans, create a checkout session
      dispatch(createCheckoutSession({
        tier: planId,
        paymentProvider: 'stripe'
      }));
    }
  };
  
  return (
    <div className="container py-5">
      <div className="row justify-content-center mb-5">
        <div className="col-lg-8 text-center">
          <h2 className="display-5 fw-bold mb-3">Choose the Right Plan for Your Needs</h2>
          <p className="lead text-muted mb-5">
            Get access to our powerful translation and compliance tools with a plan that fits your business.
          </p>
          
          <div className="d-flex justify-content-center mb-5">
            <div className="btn-group" role="group" aria-label="Billing period toggle">
              <button 
                type="button" 
                className={`btn ${billingPeriod === 'month' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setBillingPeriod('month')}
              >
                Monthly
              </button>
              <button 
                type="button" 
                className={`btn ${billingPeriod === 'year' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setBillingPeriod('year')}
              >
                Yearly <span className="badge bg-success ms-1">Save 20%</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row row-cols-1 row-cols-md-3 mb-5 g-4">
        {SUBSCRIPTION_PLANS.map((plan) => (
          <div className="col" key={plan.id}>
            <div className={`card h-100 shadow-sm ${plan.popular ? 'border-primary' : ''}`}>
              {plan.popular && (
                <div className="card-header bg-primary text-white text-center py-2">
                  <span className="badge bg-white text-primary">Most Popular</span>
                </div>
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">{plan.name}</h5>
                <p className="text-muted mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <span className="display-4 fw-bold">${calculatePrice(plan.price)}</span>
                  <span className="text-muted">/{billingPeriod}</span>
                </div>
                
                <ul className="list-unstyled mb-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="mb-2">
                      <i className="fas fa-check text-success me-2"></i> {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <button 
                    className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline-primary'} w-100`}
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? 'Current Plan' : plan.buttonText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h4 className="mb-0">Frequently Asked Questions</h4>
            </div>
            <div className="card-body">
              <div className="accordion" id="subscriptionFaq">
                {FAQ_ITEMS.map((item, index) => (
                  <div className="accordion-item" key={index}>
                    <h2 className="accordion-header">
                      <button 
                        className={`accordion-button ${selectedFaq === index ? '' : 'collapsed'}`}
                        type="button"
                        onClick={() => toggleFaq(index)}
                      >
                        {item.question}
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${selectedFaq === index ? 'show' : ''}`}>
                      <div className="accordion-body">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row justify-content-center mt-5">
        <div className="col-lg-8 text-center">
          <div className="card bg-primary text-white shadow">
            <div className="card-body py-5">
              <h3 className="mb-3">Need a Custom Solution?</h3>
              <p className="mb-4">
                Contact our sales team to discuss your specific requirements and get a tailored solution for your organization.
              </p>
              <button 
                className="btn btn-light"
                onClick={() => onContactSales && onContactSales()}
              >
                <i className="fas fa-envelope me-2"></i> Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernSubscription; 