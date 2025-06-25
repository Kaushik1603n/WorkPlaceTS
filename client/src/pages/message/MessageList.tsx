import React, { useRef, useEffect } from 'react';
import type { Message } from './MessagingTypes';
interface MessageListProps {
    messages: Message[];
    userId?: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, userId }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    console.log(userId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return (
        <div className="flex-1 p-4 mb-5 overflow-y-auto">
            <div className="space-y-4 max-h-full">
                {messages.map((message, index) => (
                    <div key={message.id} className="flex flex-col">
                        {(index === 0 || messages[index - 1].sender !== message.sender) && (
                            <div className="text-xs text-gray-500 text-center bg-white px-3 py-1 rounded-full w-fit mx-auto shadow-sm">
                                {new Date(message.timestamp).toLocaleString()}
                            </div>
                        )}
                        <div
                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${message.sender === 'user'
                                    ? 'bg-green-500 text-white rounded-br-md'
                                    : 'bg-white text-gray-800 border border-[#27AE60] rounded-bl-md'
                                    }`}
                            >
                                <p className="text-sm">{message.text}</p>
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