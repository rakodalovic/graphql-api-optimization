import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN_MUTATION, UPDATE_USER } from '../graphql/mutations';

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [loginMutation] = useMutation(LOGIN_MUTATION);
  const [updateUserMutation] = useMutation(UPDATE_USER);

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      setIsLoading(true);
      
      const { data } = await loginMutation({
        variables: { input: { email, password } }
      });

      if (data?.login?.success && data.login.token && data.login.user) {
        const authToken = data.login.token;
        const userData = {
          id: data.login.user.id,
          email: data.login.user.email,
          username: data.login.user.username,
          firstName: data.login.user.firstName,
          lastName: data.login.user.lastName,
          phoneNumber: data.login.user.phoneNumber
        };

        // Store token and user data
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('authUser', JSON.stringify(userData));
        
        setToken(authToken);
        setUser(userData);

        return { success: true, message: data.login.message || 'Login successful' };
      } else {
        return { success: false, message: data?.login?.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profileData: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    try {
      setIsLoading(true);

      const { data } = await updateUserMutation({
        variables: {
          input: {
            id: parseInt(user.id),
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            email: profileData.email,
            username: profileData.username,
            phoneNumber: profileData.phoneNumber
          }
        }
      });

      if (data?.updateUser?.success && data.updateUser.user) {
        const updatedUserData = {
          id: data.updateUser.user.id,
          email: data.updateUser.user.email,
          username: data.updateUser.user.username,
          firstName: data.updateUser.user.firstName,
          lastName: data.updateUser.user.lastName,
          phoneNumber: data.updateUser.user.phoneNumber
        };

        // Update stored user data
        localStorage.setItem('authUser', JSON.stringify(updatedUserData));
        setUser(updatedUserData);

        return { success: true, message: data.updateUser.message || 'Profile updated successfully' };
      } else {
        return { success: false, message: data?.updateUser?.message || 'Profile update failed' };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: 'An error occurred while updating profile' };
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user && !!token,
    isLoading,
    login,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};