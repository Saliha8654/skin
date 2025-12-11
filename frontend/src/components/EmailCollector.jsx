import { useState } from 'react';
import { emailAPI } from '../utils/api';

function EmailCollector({ preferences = {} }) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsSubmitting(true);

    try {
      await emailAPI.subscribe(email, preferences);
      setSubmitted(true);
    } catch (error) {
      console.error('Email submission error:', error);
      setError('Failed to save email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
        <div className="text-green-600 text-2xl mb-2">✓</div>
        <p className="text-sm text-green-800 font-medium">
          Thanks! We'll send you personalized skincare tips.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/30 rounded-xl p-4">
      <h4 className="font-semibold text-primary mb-2 text-sm">
        💌 Get Personalized Tips
      </h4>
      <p className="text-xs text-gray-600 mb-3">
        Enter your email to receive skincare routines and exclusive offers
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary text-sm"
          disabled={isSubmitting}
        />

        {error && (
          <p className="text-xs text-red-600">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderColor: '#0c2e4d',
            borderWidth: '3px',
            borderStyle: 'solid'
          }}
        >
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}

export default EmailCollector;
