import React from 'react';
import type { Contact } from './MessagingTypes';

interface ContactListProps {
  contacts: Contact[];
  selectedContact: Contact | null;
  onSelectContact: (contact: Contact) => void;
}

const ContactList: React.FC<ContactListProps> = ({ contacts, selectedContact, onSelectContact }) => {
  return (
    <div className="w-80 bg-white rounded-lg shadow-sm border border-[#27AE60] flex flex-col">
      {/* Contacts Header */}
      <div className="p-4 border-b border-[#27AE60] bg-[#EFFFF6] rounded-t-lg">
        <h2 className="font-semibold text-gray-900">Conversations</h2>
        <p className="text-sm text-gray-500">{contacts.length} active chats</p>
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => onSelectContact(contact)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                selectedContact?.id === contact.id
                  ? 'bg-[#adffd0] border border-[#27AE60] shadow-sm'
                  : 'hover:bg-gray-100 border border-[#27AE60]'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg text-white shadow-sm">
                    {contact.fullName[0]}
                  </div>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {contact.fullName}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {contact.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactList;