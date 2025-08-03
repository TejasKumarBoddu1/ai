
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ShieldX } from "lucide-react";

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="rounded-full bg-red-100 p-6 mb-6">
        <ShieldX className="h-12 w-12 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold mb-2">Unauthorized Access</h1>
      <p className="text-gray-600 mb-6 max-w-md">
        You don't have permission to access this page. Please contact your administrator if you believe this is an error.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button onClick={() => navigate('/login')}>
          Return to Login
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
