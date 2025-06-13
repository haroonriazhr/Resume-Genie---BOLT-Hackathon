import { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { authService } from '@/services/auth-service';
import { setUserContext, clearUserContext, addBreadcrumb } from '@/lib/sentry';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: (showToast?: boolean) => void;
  updateProfile: (data: { name: string; avatarUrl?: string }) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        setUserContext(currentUser);
        addBreadcrumb('User authenticated', 'auth');
      } catch (error) {
        // If there's an auth error, silently clear the invalid session
        logout(false);
        console.log('User not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, remember = false) => {
    try {
      setLoading(true);
      const user = await authService.login(email, password, remember);
      setUser(user);
      setUserContext(user);
      addBreadcrumb('User logged in', 'auth');
      toast({
        title: 'Login successful',
        description: `Welcome back, ${user.name}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      addBreadcrumb('Login failed', 'auth', 'error');
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      const user = await authService.register(name, email, password);
      setUser(user);
      setUserContext(user);
      addBreadcrumb('User registered', 'auth');
      toast({
        title: 'Registration successful',
        description: `Welcome, ${user.name}!`,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed';
      addBreadcrumb('Registration failed', 'auth', 'error');
      toast({
        variant: 'destructive',
        title: 'Registration failed',
        description: message,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (showToast = true) => {
    authService.logout();
    setUser(null);
    clearUserContext();
    addBreadcrumb('User logged out', 'auth');
    if (showToast) {
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    }
  };

  const updateProfile = async (data: { name: string; avatarUrl?: string }) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      setUserContext(updatedUser);
      addBreadcrumb('Profile updated', 'auth');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
      addBreadcrumb('Profile update failed', 'auth', 'error');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await authService.updatePassword(currentPassword, newPassword);
      addBreadcrumb('Password updated', 'auth');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      addBreadcrumb('Password update failed', 'auth', 'error');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      await authService.deleteAccount();
      logout(false);
      addBreadcrumb('Account deleted', 'auth');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete account';
      addBreadcrumb('Account deletion failed', 'auth', 'error');
      toast({
        variant: 'destructive',
        title: 'Error',
        description: message,
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};