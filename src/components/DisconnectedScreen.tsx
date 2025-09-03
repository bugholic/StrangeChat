import React from 'react';
import { X, RotateCcw, Wifi, WifiOff } from 'lucide-react';

interface DisconnectedScreenProps {
  type: 'ended' | 'partner-disconnected';
  onStartNew: () => void;
}

export const DisconnectedScreen: React.FC<DisconnectedScreenProps> = ({ type, onStartNew }) => {
  const isPartnerDisconnected = type === 'partner-disconnected';
  
  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 ${
      isPartnerDisconnected 
        ? 'bg-gradient-to-br from-orange-50 via-white to-red-50' 
        : 'bg-gradient-to-br from-red-50 via-white to-orange-50'
    }`}>
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-center max-w-md w-full">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          isPartnerDisconnected ? 'bg-orange-100' : 'bg-red-100'
        }`}>
          {isPartnerDisconnected ? (
            <WifiOff className="w-8 h-8 text-orange-500" />
          ) : (
            <X className="w-8 h-8 text-red-500" />
          )}
        </div>
        
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          {isPartnerDisconnected ? 'Partner Disconnected' : 'Chat Ended'}
        </h2>
        
        <p className="text-gray-500 text-sm sm:text-base mb-6">
          {isPartnerDisconnected 
            ? 'Your chat partner has left the conversation'
            : 'The conversation has been ended'
          }
        </p>
        
        <button
          onClick={onStartNew}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Start New Chat</span>
        </button>
        
        <p className="text-xs text-gray-400 mt-4">
          Find a new anonymous conversation partner
        </p>
      </div>
    </div>
  );
};