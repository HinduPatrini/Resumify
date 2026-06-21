import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

export default function Register() {
  const { register: registerUserStore } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUserStore(data.name, data.email, data.password);
    setLoading(false);
    
    if (result.success) {
      toast.success('Welcome! Account created successfully.');
      navigate('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Branding header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center font-heading font-bold text-white text-xl shadow-lg shadow-accent/20 select-none">
            R
          </div>
          <h2 className="text-2xl font-heading font-bold text-text-primary tracking-tight text-center">
            Create your account
          </h2>
          <p className="text-sm text-text-secondary text-center">
            Sign up to build, export and share professional resumes.
          </p>
        </div>

        {/* Form Card */}
        <Card hoverable={false} className="shadow-2xl bg-dark-card border-dark-border">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              register={register('name', {
                required: 'Full name is required'
              })}
              error={errors.name}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="name@domain.com"
              register={register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: 'Please enter a valid email address'
                }
              })}
              error={errors.email}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              register={register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2"
              isLoading={loading}
            >
              Sign Up
            </Button>
          </form>

          {/* Switch link */}
          <div className="mt-6 pt-6 border-t border-dark-border/40 text-center">
            <p className="text-sm text-text-secondary">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-accent hover:text-accent-hover hover:underline font-medium transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
