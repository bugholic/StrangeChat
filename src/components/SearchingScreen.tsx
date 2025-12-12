import React, { useState, useEffect } from 'react';
import { Users, Loader2 } from 'lucide-react';

interface SearchingScreenProps {
  onCancel?: () => void;
  userCount?: number;
}

export const SearchingScreen: React.FC<SearchingScreenProps> = ({ onCancel, userCount }) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
          <Users className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-1">StrangeChat</h1>
        <p className="text-gray-600 text-base sm:text-lg mb-8">Connect with strangers around the world</p>
        
        {/* Searching Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex items-center justify-center mb-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
            Looking for someone to chat with{dots}
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6">
            Please wait while we find you a conversation partner
          </p>
          
          {/* Cancel Button */}
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-200"
            >
              Cancel Search
            </button>
          )}
        </div>
        
        {/* Info */}
        <p className="text-xs sm:text-sm text-gray-400 mt-6 px-4">
          Your conversations are completely anonymous and temporary
        </p>
      </div>
    </div>
  );
};
