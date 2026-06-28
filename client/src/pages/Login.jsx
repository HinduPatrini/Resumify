import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { email: '', password: '' } });

  const onSubmit = async (data) => {
    setSubmitting(true);
    const result = await login(data.email, data.password);
    setSubmitting(false);
    if (result.success) {
      toast.success('Welcome back to Resumify!');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Invalid email or password.');
    }
  };

  const labelCls =
    'block text-xs font-semibold text-text-secondary tracking-widest uppercase mb-1.5 select-none';
  const inputCls =
    'w-full bg-dark-input text-text-primary border border-dark-border rounded-lg px-4 py-2.5 text-sm placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200';
  const errorCls = 'mt-1 text-xs text-red-400 font-medium';

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Branding */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <img
            src="/logo.jpeg"
            alt="Resumify Logo"
            className="w-12 h-12 object-cover rounded-xl shadow-md select-none"
          />
          <h1 className="text-2xl font-heading font-bold text-text-primary tracking-tight text-center">
            Sign in to Resumify
          </h1>
          <p className="text-sm text-text-secondary text-center">
            Create professional CVs in minutes with layouts and AI.
          </p>
        </div>

        {/* Card */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
            {/* Email */}
            <div>
              <label className={labelCls}>Email Address</label>
              <input
                id="login-email"
                type="email"
                placeholder="name@domain.com"
                autoComplete="email"
                className={inputCls}
                {...register('email', {
                  required: 'Email address is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
              {errors.email && <p className={errorCls}>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${inputCls} pr-11`}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className={errorCls}>{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={submitting}
              className="mt-2 w-full flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-lg py-2.5 text-sm transition-all duration-200 shadow-md shadow-accent/20"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-6 pt-6 border-t border-dark-border/40 text-center">
            <p className="text-sm text-text-secondary">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-accent hover:text-accent-hover hover:underline font-medium transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
