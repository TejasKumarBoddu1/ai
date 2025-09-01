
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const JobSearch = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Use replace instead of navigate to prevent history buildup
    navigate("/job-board", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      <span className="ml-3 text-gray-600">Redirecting to Job Board...</span>
    </div>
  );
};

export default JobSearch;
