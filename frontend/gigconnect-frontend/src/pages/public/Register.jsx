import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterForm from '../../components/auth/RegisterForm';
import RoleSelector from '../../components/auth/RoleSelector';

const Register = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-purple-50 py-12 px-4">
      {!role ? (
        <RoleSelector />
      ) : (
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <RegisterForm />
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;