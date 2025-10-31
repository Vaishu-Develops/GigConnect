import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const AvatarSelector = ({ isOpen, onClose, onSelectAvatar, currentAvatar }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar || '/robot.png');

  // Available avatar options in the public folder
  const avatarOptions = [
    { name: 'Robot', path: '/robot.png' },
    { name: 'Boy', path: '/boy.png' },
    { name: 'Girl', path: '/girl.png' },
    { name: 'Woman', path: '/woman.png' },
    { name: 'Woman 2', path: '/woman (1).png' },
    { name: 'Woman 3', path: '/woman (2).png' },
    { name: 'Gamer', path: '/gamer.png' },
    { name: 'Hacker', path: '/hacker.png' }
  ];

  const handleSelectAvatar = () => {
    onSelectAvatar(selectedAvatar);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Profile Picture" size="lg">
      <div className="space-y-6">
        <p className="text-gray-600 text-center">
          Select an avatar for your profile. You can change this anytime in your profile settings.
        </p>
        
        {/* Current Selection Preview */}
        <div className="text-center">
          <img
            src={selectedAvatar}
            alt="Selected avatar"
            className="w-24 h-24 rounded-full mx-auto border-4 border-emerald-500 shadow-lg object-cover"
          />
          <p className="mt-2 font-medium text-gray-900">Selected Avatar</p>
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-4 gap-4 max-h-80 overflow-y-auto">
          {avatarOptions.map((avatar) => (
            <div
              key={avatar.path}
              className={`relative cursor-pointer rounded-xl p-3 transition-all duration-200 hover:shadow-lg ${
                selectedAvatar === avatar.path
                  ? 'bg-emerald-50 border-2 border-emerald-500 ring-2 ring-emerald-200'
                  : 'bg-gray-50 border-2 border-gray-200 hover:border-emerald-300'
              }`}
              onClick={() => setSelectedAvatar(avatar.path)}
            >
              <img
                src={avatar.path}
                alt={avatar.name}
                className="w-full aspect-square rounded-lg object-cover"
                onError={(e) => {
                  e.target.src = '/robot.png';
                  e.target.onerror = null;
                }}
              />
              <p className="text-xs text-center mt-2 font-medium text-gray-700">
                {avatar.name}
              </p>
              
              {selectedAvatar === avatar.path && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4 border-t">
          <Button 
            onClick={handleSelectAvatar} 
            className="flex-1"
            disabled={!selectedAvatar}
          >
            Select Avatar
          </Button>
          <Button 
            variant="secondary" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AvatarSelector;