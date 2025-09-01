import React from 'react';
import SimpleAvatar from '@/components/interview/avatar3d/SimpleAvatar';

const AvatarDemo: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Avatar Demo</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Simple Avatar Demo</h2>
          <div className="flex justify-center">
            <SimpleAvatar width={720} height={480} />
          </div>
          
          {/* Test controls */}
          <div className="mt-4 flex gap-2 justify-center text-sm text-slate-600">No lip-sync controls for the simple viewer.</div>
        </div>
      </div>
    </div>
  );
};

export default AvatarDemo;


