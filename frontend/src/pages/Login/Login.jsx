/**
 * Login Page
 * Employee and user authentication
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, User, Lock, ShoppingCart, TrendingUp, Package } from 'lucide-react';
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
      success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      showError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-50 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl animate-pulse-soft"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success-200/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-100/20 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="hidden lg:block animate-fade-in">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl mb-6 shadow-glow">
                <ShoppingCart size={40} className="text-white" />
              </div>
              <h1 className="text-5xl font-bold mb-4">
                <span className="text-gradient">Point of Sale</span>
                <br />
                <span className="text-gray-900">System</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Modern retail management solution for your business
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="p-3 bg-primary-100 rounded-xl">
                  <TrendingUp className="text-primary-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Sales Analytics</h3>
                  <p className="text-sm text-gray-600">Track and analyze your sales performance</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-soft hover:shadow-medium transition-all duration-300">
                <div className="p-3 bg-success-100 rounded-xl">
                  <Package className="text-success-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Inventory Management</h3>
                  <p className="text-sm text-gray-600">Keep track of your stock in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="animate-scale-in">
          <Card className="glass shadow-strong hover:shadow-glow transition-all duration-300 border-white/20" padding="none">
            <div className="p-8 lg:p-10">
              {/* Logo for mobile */}
              <div className="lg:hidden text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4 shadow-glow">
                  <ShoppingCart size={32} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gradient mb-2">
                  POS System
                </h1>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back
                </h2>
                <p className="text-gray-600">
                  Sign in to access your dashboard
                </p>
              </div>
              
              {/* Login form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  className="btn-shine shadow-medium hover:shadow-strong"
                >
                  Sign In
                </Button>
              </form>
              
              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Secure authentication powered by JWT
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    © 2024 POS System. All rights reserved.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
