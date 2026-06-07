import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDB, User, AuditLog } from '../utils/db';

interface AuthContextType {
  user: User | null;
  addAuditLog: (action: string, description: string, details?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: 'default-user',
  username: 'system',
  password: '',
  rank: 'Administrator',
  fullName: 'System User',
  role: 'Admin',
  createdAt: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User>(DEFAULT_USER);

  const addAuditLog = async (action: string, description: string, details?: string) => {
    const db = await getDB();
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      action,
      description,
      userId: user.id,
      userName: user.fullName,
      timestamp: new Date().toISOString(),
      details,
    };
    await db.add('auditLogs', log);
  };

  return (
    <AuthContext.Provider value={{ user, addAuditLog }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
