import React, { useEffect, useState, useRef } from 'react';
import { Phone, Send } from 'lucide-react';
import { useSocket } from '../../context/SocketContext'; // Adjust the import path as needed
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import axiosClient from '../../utils/axiosClient';

interface Contact {
    _id: string;
    fullName: string;
    role: string;
    email: string;
    id: string;
    avatar: string;
    isOnline: boolean;
}

interface IMessage {
    id: string;
    text: string;
    senderId: string;
    contactId: string;
    timestamp: string;
    isRead: boolean;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'contact';
    senderId: string;
    contactId: string;
    timestamp: string;
    isRead: boolean;
}

const MessagingPage = () => {
    const { socket } = useSocket();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // const [latestMessagedUsers, setLatestMessagedUsers] = useState([]);
    const [contacts, setContact] = useState<Contact[]>([]);

    const { user } = useSelector((state: RootState) => state.auth);
    const userId = user?.id

    // const contacts: Contact[] = [
    //     { id: "68260956ec6ff5b5ef769b40", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true },
    //     { id: "2", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true },
    //     { id: "3", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true },
    //     { id: "4", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true },
    //     { id: "5", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true },
    //     { id: "6", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true },
    //     { id: "7", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true },
    //     { id: "8", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true },
    //     { id: "9", name: 'Mr Jam', role: 'MERN STACK Developer', avatar: '👨‍💻', isOnline: true }
    // ];

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const getUserLatestMessage = async () => {
        try {
            const response = await axiosClient.get(
                '/message/getlatest'
            );
            // setLatestMessagedUsers(response.data.data.latestMessagedUsers);
            setContact(response.data.data.user)

        } catch (error) {
            console.error('Error fetching User:', error);
        }
    }
    useEffect(() => {
        getUserLatestMessage();
    }, []);
    // Socket.IO message handlers
    useEffect(() => {
        if (!socket || !userId || !selectedContact) return;
        const fetchMessages = async () => {
            try {
                const response = await axiosClient.post(
                    '/message/getMessage',
                    {
                        senderId: userId,
                        contactId: selectedContact.id,
                    },

                );
                setMessages(
                    response.data.data.map((msg: IMessage) => ({
                        ...msg,
                        sender: msg.senderId === userId ? 'user' : 'contact',
                    }))
                );
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };
        fetchMessages();

        // Listen for incoming messages
        socket.on('message', (message: Message) => {
            if (selectedContact && (message.contactId === String(selectedContact.id) || message.senderId === String(selectedContact.id))) {
                setMessages((prevMessages) => {
                    if (prevMessages.some((msg) => msg.id === message.id)) {
                        return prevMessages.map((msg) =>
                            msg.id === message.id ? { ...msg } : msg
                        );
                    }
                    // Add new message if it doesn't exist
                    if (message.senderId !== userId) {
                        return [...prevMessages, {
                            ...message,
                            sender: 'contact',
                            timestamp: message.timestamp || new Date().toISOString(),
                        }];
                    }
                    return prevMessages;
                });
            }
        });

        return () => {
            socket.off('message');
        };
    }, [socket, selectedContact, userId]);

    // Scroll to bottom when messages update
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Set initial contact
    // useEffect(() => {
    //     if (contacts.length > 0 && !selectedContact) {
    //         setSelectedContact(contacts[0]);
    //     }
    // }, [selectedContact]);

    const handleSendMessage = () => {
        if (!userId) {
            console.error('User ID is undefined');
            return;
        }
        if (messageInput.trim() && selectedContact && socket) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: messageInput,
                senderId: userId,
                sender: 'user',
                contactId: String(selectedContact.id),
                timestamp: new Date().toLocaleTimeString(),
                isRead: false
            };

            socket.emit('sendMessage', newMessage);

            // Update local messages
            setMessages([...messages, newMessage]);
            setMessageInput('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex h-full gap-4">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-[#27AE60]">
                {/* Chat Header */}
                {selectedContact && (
                    <div className="flex items-center justify-between p-4 border-b border-[#27AE60] bg-[#EFFFF6] rounded-t-lg">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg text-white shadow-sm">
                                {selectedContact.avatar}
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">{selectedContact.fullName}</h3>
                                <p className="text-sm text-green-600">Online</p>
                            </div>
                        </div>
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors">
                            <Phone size={20} />
                        </button>
                    </div>
                )}

                {/* Messages Area */}
                <div className="flex-1 p-4 mb-5 overflow-y-auto ">
                    <div className="space-y-4 max-h-full ">
                        {messages.map((message, index) => (
                            <div key={message.id} className="flex flex-col">
                                {(index === 0 || messages[index - 1].sender !== message.sender) && (
                                    <div className="text-xs text-gray-500 text-center  bg-white px-3 py-1 rounded-full w-fit mx-auto shadow-sm">
                                        {message.timestamp}
                                    </div>
                                )}
                                <div
                                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs  lg:max-w-md px-4 py-3 rounded-2xl shadow-sm  ${message.sender === 'user'
                                            ? 'bg-green-500 text-white rounded-br-md'
                                            : 'bg-white text-gray-800 border border-[#27AE60] rounded-bl-md'
                                            }`}
                                    >
                                        <p className="text-sm ">{message.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Message Input */}
                <div className="p-4   bg-[#EFFFF6] border-t border-[#27AE60] rounded-b-lg">
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
            </div>

            {/* Contacts List */}
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
                                onClick={() => setSelectedContact(contact)}
                                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${selectedContact?.id === contact.id
                                    ? 'bg-green-50 border border-green-200 shadow-sm'
                                    : 'hover:bg-gray-100 border border-transparent'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-lg text-white shadow-sm">
                                            {contact.avatar}
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
                                        <p className="text-xs text-green-600 mt-1">
                                            Active now
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagingPage;