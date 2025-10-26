import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../ui/Input';
import PasswordInput from '../ui/PasswordInput';
import Button from '../ui/Button';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get role from URL params if available
  const urlRole = searchParams.get('role');

  // Set role from URL parameter when component mounts
  useEffect(() => {
    if (urlRole && (urlRole === 'client' || urlRole === 'freelancer')) {
      setFormData(prev => ({ ...prev, role: urlRole }));
    }
  }, [urlRole]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const currentRole = formData.role || urlRole;
    if (!currentRole) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      // Use the role from formData or urlRole
      registerData.role = currentRole;
      const result = await register(registerData);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Join GigConnect</h1>
        <p className="text-gray-600">Create your account to get started</p>
      </div>

      {/* Role Selection */}
      {!urlRole && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            I want to:
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleRoleSelect('client')}
              className={`
                p-4 border-2 rounded-lg text-center transition-all duration-200
                ${formData.role === 'client'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-300 hover:border-emerald-300 hover:bg-emerald-25'
                }
              `}
            >
              <div className="text-2xl mb-2">💼</div>
              <div className="font-medium">Hire Talent</div>
              <div className="text-sm text-gray-500 mt-1">I need services</div>
            </button>
            
            <button
              type="button"
              onClick={() => handleRoleSelect('freelancer')}
              className={`
                p-4 border-2 rounded-lg text-center transition-all duration-200
                ${formData.role === 'freelancer'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                  : 'border-gray-300 hover:border-emerald-300 hover:bg-emerald-25'
                }
              `}
            >
              <div className="text-2xl mb-2">🚀</div>
              <div className="font-medium">Offer Services</div>
              <div className="text-sm text-gray-500 mt-1">I have skills</div>
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        <Input
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
        />

        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          required
        />

        <PasswordInput
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          required
          minLength={6}
        />

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          required
        />

        {(urlRole || formData.role) && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
            <p className="text-sm text-emerald-700">
              Creating account as: <span className="font-semibold capitalize">{urlRole || formData.role}</span>
            </p>
          </div>
        )}

        <Button
          type="submit"
          loading={loading}
          disabled={!(formData.role || urlRole)}
          className="w-full"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-600 hover:text-emerald-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;