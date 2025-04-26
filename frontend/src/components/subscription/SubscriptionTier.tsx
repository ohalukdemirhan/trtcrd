import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface SubscriptionTierProps {
  name: string;
  price: string | number;
  period?: string;
  features: string[];
  isPopular?: boolean;
  isPremium?: boolean;
  isCurrent?: boolean;
  onSelect?: () => void;
}

/**
 * Subscription tier card with premium styling options
 */
export const SubscriptionTier: React.FC<SubscriptionTierProps> = ({
  name,
  price,
  period = 'month',
  features,
  isPopular = false,
  isPremium = false,
  isCurrent = false,
  onSelect,
}) => {
  return (
    <Card
      className={`relative p-6 flex flex-col h-full transition-transform hover:scale-105 ${
        isPremium ? 'bg-gradient-primary text-white' : ''
      }`}
    >
      {/* Popular badge */}
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="bg-gradient-primary text-white text-xs font-bold px-4 py-1 rounded-full shadow-md">
            Most Popular
          </div>
        </div>
      )}
      
      {/* Tier name */}
      <h3 className="text-xl font-bold mb-2 text-center">{name}</h3>
      
      {/* Price */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center">
          <span className="text-3xl font-bold">
            {typeof price === 'number' ? `$${price}` : price}
          </span>
          {period && price !== 'Custom' && (
            <span className="text-gray-500 ml-1">/{period}</span>
          )}
        </div>
      </div>
      
      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
      
      {/* Features */}
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <svg
              className="w-5 h-5 text-green-500 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      {/* Action button */}
      <div className="mt-auto">
        <Button
          variant={isPremium ? 'primary' : 'outline'}
          onClick={onSelect}
          disabled={isCurrent}
          fullWidth
        >
          {isCurrent ? 'Current Plan' : 'Select Plan'}
        </Button>
      </div>
    </Card>
  );
};
