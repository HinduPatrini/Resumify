import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useResumeStore } from '../store/resumeStore';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { User, Lock, Palette, BarChart, Check, Sun, Moon } from 'lucide-react';

export default function AccountSettings() {
  const { user, updateProfile } = useAuthStore();
  const { theme, setTheme, mode, setMode } = useThemeStore();
  const { resumes, fetchResumes } = useResumeStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: ''
    }
  });

  useEffect(() => {
    fetchResumes();
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: ''
      });
    }
  }, [user, reset, fetchResumes]);

  const onSubmit = async (data) => {
    if (data.password && data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    const result = await updateProfile(data.name, data.email, data.password || null);
    setLoading(false);

    if (result.success) {
      toast.success("Profile updated successfully!");
      reset({
        name: data.name,
        email: data.email,
        password: '',
        confirmPassword: ''
      });
    } else {
      toast.error(result.message || "Failed to update profile.");
    }
  };

  const themeOptions = [
    { id: 'indigo', name: 'Indigo Eclipse', colorClass: 'bg-[#6e5cf5]' },
    { id: 'emerald', name: 'Emerald Slate', colorClass: 'bg-[#10b981]' },
    { id: 'rose', name: 'Crimson Velvet', colorClass: 'bg-[#f43f5e]' },
    { id: 'amber', name: 'Amber Dusk', colorClass: 'bg-[#f59e0b]' },
    { id: 'cyan', name: 'Nordic Frost', colorClass: 'bg-[#06b6d4]' },
    { id: 'purple', name: 'Amethyst Rain', colorClass: 'bg-[#a855f7]' },
  ];

  return (
    <div className="flex h-screen w-screen bg-background overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Navbar title="Account Settings" />

        <main className="flex-grow p-6 md:p-8 overflow-y-auto max-w-4xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Left Column - Forms */}
            <div className="md:col-span-2 flex flex-col gap-6">
              {/* Profile Details Card */}
              <Card hoverable={false} className="border-dark-border bg-dark-card/60 p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-dark-border pb-3">
                  <User className="text-accent h-5 w-5" />
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Profile Information
                  </h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      type="text"
                      placeholder="Your Name"
                      register={register('name', { required: 'Name is required' })}
                      error={errors.name}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@domain.com"
                      register={register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                          message: 'Invalid email address'
                        }
                      })}
                      error={errors.email}
                    />
                  </div>

                  <div className="border-t border-dark-border/40 my-2 pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Lock className="text-accent h-4 w-4" />
                      <h4 className="text-sm font-heading font-semibold text-text-primary">
                        Change Password (Optional)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="New Password"
                        type="password"
                        placeholder="••••••••"
                        register={register('password', {
                          minLength: {
                            value: 6,
                            message: 'Password must be at least 6 characters'
                          }
                        })}
                        error={errors.password}
                      />

                      <Input
                        label="Confirm New Password"
                        type="password"
                        placeholder="••••••••"
                        register={register('confirmPassword')}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end mt-2">
                    <Button type="submit" variant="primary" isLoading={loading}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Column - Theme Customization & Stats */}
            <div className="flex flex-col gap-6">
              {/* Theme Customizer Card */}
              <Card hoverable={false} className="border-dark-border bg-dark-card/60 p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-dark-border pb-3">
                  <Palette className="text-accent h-5 w-5" />
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    UI Theme Color
                  </h3>
                </div>

                <p className="text-xs text-text-secondary mb-4 leading-relaxed">
                  Select a premium accent color scheme to change the UI color across your Resumify workspace instantly.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {themeOptions.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setTheme(opt.id)}
                      className={`
                        flex items-center gap-2 px-3 py-2.5 rounded-lg border text-left transition-all duration-200 focus:outline-none
                        ${theme === opt.id 
                          ? 'border-accent/40 bg-accent/10 text-text-primary shadow-md' 
                          : 'border-dark-border bg-dark-input/40 text-text-secondary hover:border-dark-border/80 hover:text-text-primary'}
                      `}
                    >
                      <span className={`w-3.5 h-3.5 rounded-full ${opt.colorClass} shrink-0`} />
                      <span className="text-xs font-medium truncate">{opt.name}</span>
                      {theme === opt.id && (
                        <Check className="h-3.5 w-3.5 ml-auto text-accent shrink-0" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="border-t border-dark-border/40 mt-5 pt-4">
                  <h4 className="text-xs font-heading font-semibold text-text-primary tracking-wide uppercase select-none mb-3">
                    Theme Mode
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('dark')}
                      className={`
                        flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none
                        ${mode === 'dark'
                          ? 'border-accent/40 bg-accent/10 text-text-primary shadow-md font-semibold'
                          : 'border-dark-border bg-dark-input/40 text-text-secondary hover:border-dark-border/80 hover:text-text-primary'}
                      `}
                    >
                      <Moon size={16} />
                      Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('light')}
                      className={`
                        flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 focus:outline-none
                        ${mode === 'light'
                          ? 'border-accent/40 bg-accent/10 text-text-primary shadow-md font-semibold'
                          : 'border-dark-border bg-dark-input/40 text-text-secondary hover:border-dark-border/80 hover:text-text-primary'}
                      `}
                    >
                      <Sun size={16} />
                      Light
                    </button>
                  </div>
                </div>
              </Card>

              {/* Statistics Card */}
              <Card hoverable={false} className="border-dark-border bg-dark-card/60 p-6">
                <div className="flex items-center gap-3 mb-5 border-b border-dark-border pb-3">
                  <BarChart className="text-accent h-5 w-5" />
                  <h3 className="text-lg font-heading font-semibold text-text-primary">
                    Statistics
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-dark-input/30 border border-dark-border p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Total Resumes</p>
                      <h4 className="text-2xl font-heading font-bold text-text-primary mt-1">
                        {resumes.length}
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/20 flex items-center justify-center font-heading font-bold text-accent text-lg">
                      {resumes.length}
                    </div>
                  </div>

                  <div className="text-center py-2 border-t border-dark-border/40 mt-1">
                    <p className="text-[10px] text-text-muted leading-relaxed">
                      Resumify premium dashboard active
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
