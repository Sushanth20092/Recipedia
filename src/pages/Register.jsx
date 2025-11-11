import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ChefHat, Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const Register = ({ onNavigate }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateUsername = (username) => {
    return username.length >= 3 && username.length <= 20;
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const getUsernameError = () => {
    if (!touched.username) return '';
    if (!formData.username) return 'Username is required';
    if (!validateUsername(formData.username)) return 'Username must be 3-20 characters';
    return '';
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
    if (!validatePassword(formData.password)) return 'Password must be at least 6 characters';
    return '';
  };

  const getConfirmPasswordError = () => {
    if (!touched.confirmPassword) return '';
    if (!formData.confirmPassword) return 'Please confirm your password';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match';
    return '';
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
    return { strength, label: 'Strong', color: 'bg-green-500' };
  };

  const handleSubmit = async () => {
    setError('');
    setTouched({
      username: true,
      email: true,
      password: true,
      confirmPassword: true,
    });

    const usernameError = !formData.username || !validateUsername(formData.username);
    const emailError = !formData.email || !validateEmail(formData.email);
    const passwordError = !formData.password || !validatePassword(formData.password);
    const confirmPasswordError = formData.password !== formData.confirmPassword;

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      setError('Please fix the errors above');
      return;
    }

    setLoading(true);

    const result = await register(formData.username, formData.email, formData.password);

    if (result.success) {
      onNavigate('home');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }

    setLoading(false);
  };

  const usernameError = getUsernameError();
  const emailError = getEmailError();
  const passwordError = getPasswordError();
  const confirmPasswordError = getConfirmPasswordError();
  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4 py-12">
      {/* Decorative food icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-20 left-10 text-6xl">🥘</div>
        <div className="absolute top-40 right-20 text-5xl">🍜</div>
        <div className="absolute bottom-32 left-20 text-6xl">🍔</div>
        <div className="absolute bottom-20 right-32 text-5xl">🧁</div>
        <div className="absolute top-1/2 left-1/2 text-4xl">🍳</div>
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
            <p className="text-gray-600 mt-2 text-lg">Start your culinary journey 🍴</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  onBlur={() => setTouched({ ...touched, username: true })}
                  className={`w-full pl-11 pr-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    usernameError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder="your_chef_name"
                  required
                />
              </div>
              {usernameError && (
                <p className="text-red-600 text-xs mt-1 ml-1">{usernameError}</p>
              )}
            </div>

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
                  placeholder="Create a strong password"
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
              {/* Password Strength Indicator */}
              {formData.password && !passwordError && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${passwordStrength.color} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                  className={`w-full pl-11 pr-12 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    confirmPasswordError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {confirmPasswordError && (
                <p className="text-red-600 text-xs mt-1 ml-1">{confirmPasswordError}</p>
              )}
              {formData.confirmPassword && !confirmPasswordError && formData.password === formData.confirmPassword && (
                <p className="text-green-600 text-xs mt-1 ml-1 flex items-center gap-1">
                  <span>✓</span> Passwords match
                </p>
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
                  Creating account...
                </span>
              ) : (
                'Join RecipeShare Community'
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => onNavigate('login')}
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-all"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Footer Message */}
        <p className="text-center text-gray-600 mt-6 text-sm">
          🌟 Share your passion, inspire others, cook together
        </p>
      </div>
    </div>
  );
};

export default Register;