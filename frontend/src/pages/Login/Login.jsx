/**
 * Login Page
 * Employee and user authentication
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { useToastContext } from '../../context/ToastContext';
import { useForm } from '../../hooks/useForm';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuthContext();
  const { success, error: showError } = useToastContext();
  const [loading, setLoading] = useState(false);
  
  const validationRules = {
    employeeId: {
      required: true,
      requiredMessage: 'Employee ID is required',
    },
    password: {
      required: true,
      requiredMessage: 'Password is required',
      password: true,
    },
  };
  
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm(
    { employeeId: '', password: '' },
    validationRules
  );
  
  const onSubmit = async (formValues) => {
    setLoading(true);
    try {
      await login(formValues.employeeId, formValues.password);
      success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <Card className="w-full max-w-md" padding="lg">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            POS System
          </h1>
          <p className="text-gray-600">
            Sign in to your account
          </p>
        </div>
        
        {/* Login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Employee ID"
            name="employeeId"
            type="text"
            value={values.employeeId}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.employeeId && errors.employeeId}
            placeholder="Enter your employee ID"
            icon={User}
            required
            autoFocus
          />
          
          <Input
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password && errors.password}
            placeholder="Enter your password"
            icon={Lock}
            required
          />
          
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={LogIn}
          >
            Sign In
          </Button>
        </form>
        
        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Default credentials:</p>
          <p className="font-mono text-xs mt-1">
            Admin: 110001 / Cashier: 110002
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Login;
