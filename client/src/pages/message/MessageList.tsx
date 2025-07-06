import type { Message } from './MessagingTypes';
import React, { useRef, useEffect } from 'react';
import { Trash2, FileText, Download, Heart } from 'lucide-react';

interface MessageListProps {
    messages: Message[];
    userId?: string;
    setDeleteMsg: (id: string) => Promise<void>;
    setLikeMsg: (id: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, userId, setDeleteMsg, setLikeMsg }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    const renderMessageContent = (message: Message) => {
        const hasText = message.text && message.text.trim();
        const hasMedia = message.media;

        return (
            <div className="">
                {hasMedia && (
                    <div className="max-w-xs">
                        {message.media!.type === 'image' ? (
                            <div className="relative">
                                <img
                                    src={message.media!.url}
                                    alt="Shared image"
                                    className="rounded-lg max-w-full h-auto shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(message.media!.url, '_blank')}
                                />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                <FileText className="text-red-500 flex-shrink-0" size={20} />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        PDF Document
                                    </p>
                                    <p className="text-xs text-gray-500">Click to view</p>
                                </div>
                                <button
                                    onClick={() => window.open(message.media!.url, '_blank')}
                                    className="text-blue-500 hover:text-blue-700 transition-colors"
                                >
                                    <Download size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {hasText && (
                    <p className="px-6 pt-1 text-sm leading-relaxed break-words overflow-x-hidden">
                        {message.text}
                    </p>
                )}

                <div className={`px-6 py-1 flex items-center gap-2 text-xs transition-opacity duration-200 ${
                    message.sender === 'user' ? 'text-gray-200 text-right' : 'text-gray-400 text-left'
                }`}>
                    <span>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </span>
                    {message.likes.length > 0 && (
                        <span className="flex items-center gap-1">
                            <Heart size={12} className="text-red-500 fill-red-500" />
                            <span>{message.likes.length}</span>
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 p-4 mb-5 overflow-y-auto">
            <div className="space-y-2 max-h-full">
                {messages.map((message, index) => (
                    <div key={message.id} className="flex flex-col">
                        {shouldShowDateSeparator(message, messages[index - 1]) && (
                            <div className="flex justify-center mb-3 mt-4">
                                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full shadow-sm">
                                    {formatDateOnly(message.timestamp)}
                                </div>
                            </div>
                        )}

                        <div className={`flex items-end gap-2 ${
                            message.sender === 'user' ? 'justify-end' : 'justify-start'
                        }`}>
                            <div className={`group relative max-w-xs lg:max-w-md ${
                                message.sender === 'user' ? 'order-2' : 'order-1'
                            }`}>
                                <div className={`rounded-2xl shadow-sm transition-all duration-200 ${
                                    message.sender === 'user'
                                        ? 'bg-green-500 text-white rounded-br-md hover:bg-green-600'
                                        : 'bg-white text-gray-800 border border-green-600 rounded-bl-md hover:shadow-md'
                                }`}>
                                    {renderMessageContent(message)}
                                </div>

                                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform scale-0 group-hover:scale-100 flex gap-1">
                                    {message.sender === 'user' && (
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                                            title="Delete message"
                                            onClick={() => setDeleteMsg(message.id)}
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    )}
                                    <button
                                        className={`rounded-full p-1.5 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 ${
                                            message.likes.includes(userId || '')
                                                ? 'bg-red-500 text-white hover:bg-red-600'
                                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                        }`}
                                        title={message.likes.includes(userId || '') ? 'Unlike message' : 'Like message'}
                                        onClick={() => setLikeMsg(message.id)}
                                    >
                                        <Heart size={12} className={message.likes.includes(userId || '') ? 'fill-current' : ''} />
                                    </button>
                                </div>
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