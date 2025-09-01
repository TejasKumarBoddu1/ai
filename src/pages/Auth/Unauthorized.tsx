
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ShieldX, AlertCircle, Home } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";

const Unauthorized: React.FC = () => {
  return (
    <MainLayout>
      <div className="container py-20">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mx-auto mb-6">
            <ShieldX className="h-14 w-14 text-red-600" />
          </div>
          
          <h1 className="text-3xl font-bold mb-3">Access Denied</h1>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md mb-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2" />
              <p className="text-amber-800 text-sm text-left">
                You don't have permission to access this page. This feature may be restricted to certain
                user types or require additional privileges.
              </p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-8">
            Please contact support if you believe this is an error or if you need access to this feature.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Unauthorized;
