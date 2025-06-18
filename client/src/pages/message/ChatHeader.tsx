import React from 'react';
import { Phone } from 'lucide-react';
import type { Contact } from './MessagingTypes';

interface ChatHeaderProps {
  contact: Contact;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ contact }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-[#27AE60] bg-[#EFFFF6] rounded-t-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg text-white shadow-sm">
          {contact.fullName[0]}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{contact.fullName}</h3>
          <p className="text-sm text-green-600">{contact.role}</p>
        </div>
      </div>
      <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors">
        <Phone size={20} />
      </button>
    </div>
  );
};

export default ChatHeader;