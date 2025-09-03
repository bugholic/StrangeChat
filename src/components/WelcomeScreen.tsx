import React from 'react';
import { MessageCircle, Shield, Zap, Globe } from 'lucide-react';

interface WelcomeScreenProps {
  onStartChat: () => void;
  userCount?: number;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartChat, userCount }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center max-w-lg w-full">
        {/* Logo */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
          <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
        </div>
        
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-1">
          StrangeChat
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mb-3">{typeof userCount === 'number' ? `${userCount} users online now` : '\u00A0'}</p>
        <p className="text-gray-600 text-base sm:text-lg mb-8 px-4">
          Connect instantly with strangers from around the world
        </p>
        
        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 px-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Shield className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-600">100% Anonymous</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Zap className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-600">Instant Connect</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <Globe className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-xs sm:text-sm text-gray-600">Global Users</p>
          </div>
        </div>
        
        {/* Start Button */}
        <button
          onClick={onStartChat}
          className="w-full max-w-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full text-base sm:text-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-xl"
        >
          Start Chatting
        </button>
        
        {/* Disclaimer */}
        <p className="text-xs text-gray-400 mt-6 px-4 leading-relaxed">
          By starting a chat, you agree to be respectful and follow community guidelines. 
          Conversations are not recorded or stored.
        </p>
      </div>
    </div>
  );
};