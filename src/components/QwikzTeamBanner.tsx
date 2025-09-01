
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const QwikzTeamBanner: React.FC = () => {
  return (
    <div className="mt-6 mb-8 p-6 rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white dark:bg-gray-800 p-3 rounded-full shadow-md">
            <img 
              src="/lovable-uploads/3265058c-5d87-416e-8812-a23917ab06ab.png" 
              alt="QwikZen Logo" 
              className="h-14 w-14"
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-indigo-800 dark:text-indigo-300 mb-2">QwikZen Group India</h3>
            <p className="text-indigo-700 dark:text-indigo-400">
              Building innovative solutions for modern challenges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QwikzTeamBanner;
