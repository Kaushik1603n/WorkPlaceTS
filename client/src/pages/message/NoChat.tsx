import React from 'react';
import type { Contact } from './MessagingTypes';

interface SelectChatProps {
  contacts: Contact[];
  setSelectedContact: (contact: Contact) => void;
}

const SelectChat: React.FC<SelectChatProps> = ({ contacts, setSelectedContact }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-lg shadow-sm border border-[#27AE60] p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-green-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No chat selected</h3>
        <p className="text-gray-600 mb-6">
          Choose a conversation from the sidebar to start messaging
        </p>
        <div className="flex justify-center">
          <button
            onClick={() => contacts.length > 0 && setSelectedContact(contacts[0])}
            disabled={contacts.length === 0}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              contacts.length > 0
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            } transition-colors`}
          >
            {contacts.length > 0 ? 'Start with first contact' : 'No contacts available'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectChat;