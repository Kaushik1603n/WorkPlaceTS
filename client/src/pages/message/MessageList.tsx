import React, { useRef, useEffect } from 'react';
import type { Message } from './MessagingTypes';
import { Trash2 } from 'lucide-react';

interface MessageListProps {
    messages: Message[];
    userId?: string;
    setDeleteMsg: (id: string) => Promise<void>;
}

const MessageList: React.FC<MessageListProps> = ({ messages, userId, setDeleteMsg }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    console.log(userId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatDateOnly = (timestamp: string | Date) => {
        const date = new Date(timestamp);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const diffInDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            return 'Today';
        } else if (diffInDays === 1) {
            return 'Yesterday';
        } else if (diffInDays < 7) {
            return date.toLocaleDateString([], { weekday: 'long' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
        }
    };

    const shouldShowDateSeparator = (currentMessage: Message, previousMessage?: Message) => {
        if (!previousMessage) return true;

        const currentDate = new Date(currentMessage.timestamp);
        const previousDate = new Date(previousMessage.timestamp);

        return currentDate.toDateString() !== previousDate.toDateString();
    };

    return (
        <div className="flex-1 p-4 mb-5 overflow-y-auto">
            <div className="space-y-2 max-h-full">
                {messages.map((message, index) => (
                    <div key={message.id} className="flex flex-col">
                        {shouldShowDateSeparator(message, messages[index - 1]) && (
                            <div className="flex justify-center mb-3 mt-4">
                                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-sm ">
                                    {formatDateOnly(message.timestamp)}
                                </div>
                            </div>
                        )}

                        <div className={`flex items-end gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`group relative max-w-xs lg:max-w-md ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                                <div className={`px-4 py-0.5 rounded-2xl shadow-sm transition-all duration-200 ${message.sender === 'user'
                                    ? 'bg-green-500 text-white rounded-br-md hover:bg-green-600'
                                    : 'bg-white text-gray-800 border border-green-600 rounded-bl-md hover:shadow-md'
                                    }`}>
                                    <p className="text-sm leading-relaxed break-words overflow-x-hidden">{message.text}</p>

                                    <div className={`text-right text-xs transition-opacity duration-200 ${message.sender === 'user' ? 'right-0 text-gray-200' : 'left-0 text-gray-400'
                                        }`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>


                                {message.sender === 'user' && (
                                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-0 group-hover:scale-100">
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                                            title="Delete message"
                                            onClick={() => setDeleteMsg(message.id)}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default MessageList;