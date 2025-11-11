import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = ({ onNavigate }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const getEmailError = () => {
    if (!touched.email) return '';
    if (!formData.email) return 'Email is required';
    if (!validateEmail(formData.email)) return 'Please enter a valid email';
    return '';
  };

  const getPasswordError = () => {
    if (!touched.password) return '';
    if (!formData.password) return 'Password is required';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTouched({ email: true, password: true });

    const emailError = !formData.email || !validateEmail(formData.email);
    const passwordError = !formData.password;

    if (emailError || passwordError) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);

    const result = await login(formData.email, formData.password);

    if (result.success) {
      onNavigate('home');
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }

    setLoading(false);
  };

  const emailError = getEmailError();
  const passwordError = getPasswordError();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4 py-12">
      {/* Decorative food icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🍕</div>
        <div className="absolute top-40 right-20 text-5xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>🍝</div>
        <div className="absolute bottom-32 left-20 text-6xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }}>🥗</div>
        <div className="absolute bottom-20 right-32 text-5xl animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '1.5s' }}>🍰</div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-orange-100">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-red-500 p-4 rounded-2xl mb-4 shadow-lg">
              <ChefHat className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Recipedia
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Welcome back, Chef! 👨‍🍳</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  onBlur={() => setTouched({ ...touched, email: true })}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    emailError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder="chef@recipedia.com"
                  required
                />
              </div>
              {emailError && (
                <p className="text-red-600 text-xs mt-1 ml-1">{emailError}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    passwordError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-600 text-xs mt-1 ml-1">{passwordError}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">🍳</span>
                  Logging in...
                </span>
              ) : (
                'Login to Recipe World'
              )}
            </button>
          </div>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              New to RecipeShare?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-all"
              >
                Create an account
              </button>
            </p>
          </div>
        </div>

        {/* Footer Message */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          🌟 Join thousands of home chefs sharing delicious recipes
        </p>
      </div>
    </div>
  );
};

export default Login;