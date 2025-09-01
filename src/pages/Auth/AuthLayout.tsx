
import React, { ReactNode } from "react";
import QwikzTeamBanner from "@/components/QwikzTeamBanner";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">QwiXEd360°Suite</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">AI-Powered Career Development Suite</p>
        </div>
        {children}
        <QwikzTeamBanner />
      </div>
    </div>
  );
};

export default AuthLayout;
