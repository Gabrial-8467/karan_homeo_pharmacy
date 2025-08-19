import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';
import {
  FiUser,
  FiMail,
  FiLock,
  FiSave,
  FiLoader,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';

const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  // 🚨 If no user, force redirect
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ✅ Sync formData when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';

    if (formData.password) {
      if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters.';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    setErrors({});
    setIsLoading(true);

    const updateData = {
      name: formData.name,
      email: formData.email,
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    const success = await updateUserProfile(updateData);
    if (success) {
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row">
        {/* Left Side: Profile Info */}
        <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-700 to-blue-500 p-6 sm:p-8 text-white flex flex-col items-center justify-center gap-4">
          <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl sm:text-5xl font-bold shadow-md mb-2">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-lg sm:text-2xl font-bold text-center">{user?.name}</h2>
          <p className="text-blue-200 text-center text-xs sm:text-base">{user?.email}</p>
          <div className="mt-2 flex flex-col items-center gap-1">
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-2/3 p-4 sm:p-8">
          <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 mb-1 sm:mb-2">
            Welcome, {user?.name?.split(' ')[0]}!
          </h1>
          <p className="text-gray-600 mb-4 sm:mb-8 text-xs sm:text-base">
            Update your personal details and password below. Your information is
            always kept private and secure.
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-4 sm:space-y-6">
            {/* Name */}
            <div>
              <label className="font-semibold text-gray-700 block mb-1 sm:mb-2 text-sm sm:text-base">
                Full Name
              </label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full pl-12 pr-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-500'
                  } text-sm sm:text-base`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="font-semibold text-gray-700 block mb-1 sm:mb-2 text-sm sm:text-base">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`w-full pl-12 pr-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-500'
                  } text-sm sm:text-base`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
              )}
            </div>

            <hr className="my-4 sm:my-6" />

            {/* Password Section */}
            <p className="font-semibold text-gray-700 text-sm sm:text-base">
              Change Password
            </p>

            {/* New Password */}
            <div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New Password (min. 6 characters)"
                  className={`w-full pl-12 pr-12 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-500'
                  } text-sm sm:text-base`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm New Password"
                  className={`w-full pl-12 pr-12 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-400'
                      : 'border-gray-300 focus:ring-blue-500'
                  } text-sm sm:text-base`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 ml-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
