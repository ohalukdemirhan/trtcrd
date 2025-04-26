import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  // Calculate password strength
  const calculateStrength = (): { score: number; feedback: string } => {
    let score = 0;
    let feedback = '';

    if (password.length === 0) {
      return { score: 0, feedback: 'Enter password' };
    }

    // Length check
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;

    // Character variety checks
    if (/[A-Z]/.test(password)) score += 1;  // Has uppercase
    if (/[a-z]/.test(password)) score += 1;  // Has lowercase
    if (/[0-9]/.test(password)) score += 1;  // Has number
    if (/[^A-Za-z0-9]/.test(password)) score += 1;  // Has special char

    // Determine feedback based on score
    if (score <= 2) {
      feedback = 'Weak';
    } else if (score <= 4) {
      feedback = 'Moderate';
    } else {
      feedback = 'Strong';
    }

    return { score: Math.min(score, 6), feedback };
  };

  const { score, feedback } = calculateStrength();
  const strengthPercentage = (score / 6) * 100;

  // Determine color based on strength
  const getColor = () => {
    if (strengthPercentage <= 33) return 'bg-danger';
    if (strengthPercentage <= 66) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="mt-2">
      <div className="progress" style={{ height: '4px' }}>
        <div
          className={`progress-bar ${getColor()}`}
          role="progressbar"
          style={{ width: `${strengthPercentage}%` }}
          aria-valuenow={strengthPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <small className="text-muted mt-1 d-block">
        Password strength: {feedback}
      </small>
    </div>
  );
};

// PasswordStrengthMeter is commented out for MVP focus. Uncomment for production.
// export default PasswordStrengthMeter; 