import React from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  setMessageInput,
  handleSendMessage,
  handleKeyPress,
}) => {
  return (
    <div className="p-4 bg-[#EFFFF6] border-t border-[#27AE60] rounded-b-lg">
      <div className="flex items-center space-x-3">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-[#EFFFF6] placeholder-gray-500"
        />
        <button
          onClick={handleSendMessage}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow-sm"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;