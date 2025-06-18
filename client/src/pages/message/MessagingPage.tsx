import React, { useEffect, useState } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import axiosClient from '../../utils/axiosClient';
import ContactList from './ContactList';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { Contact, Message, IMessage } from './MessagingTypes';
import SelectChat from './NoChat';

const MessagingPage = () => {
    const { socket } = useSocket();
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [contacts, setContact] = useState<Contact[]>([]);

    const { user } = useSelector((state: RootState) => state.auth);
    const userId = user?.id;

    const getUserLatestMessage = async () => {
        try {
            const response = await axiosClient.get('/message/getlatest');
            setContact(response.data.data.user);
        } catch (error) {
            console.error('Error fetching User:', error);
        }
    };

    useEffect(() => {
        getUserLatestMessage();
    }, []);

    useEffect(() => {
        if (!socket || !userId || !selectedContact) return;

        const fetchMessages = async () => {
            try {
                const response = await axiosClient.post('/message/getMessage', {
                    senderId: userId,
                    contactId: selectedContact.id,
                });
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

        socket.on('message', (message: Message) => {
            if (selectedContact && (message.contactId === String(selectedContact.id) || message.senderId === String(selectedContact.id))) {
                setMessages((prevMessages) => {
                    if (prevMessages.some((msg) => msg.id === message.id)) {
                        return prevMessages.map((msg) =>
                            msg.id === message.id ? { ...msg } : msg
                        );
                    }
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

    console.log(selectedContact);

    return (
        <div className="flex h-full gap-4">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-[#27AE60]">
                {selectedContact ? (
                    <>
                        <ChatHeader contact={selectedContact} />
                        <MessageList messages={messages} userId={userId} />
                        <MessageInput
                            messageInput={messageInput}
                            setMessageInput={setMessageInput}
                            handleSendMessage={handleSendMessage}
                            handleKeyPress={handleKeyPress}
                        />
                    </>
                ) :
                    (
                        <SelectChat contacts={contacts} setSelectedContact={setSelectedContact} />
                    )}
            </div>

            <ContactList
                contacts={contacts}
                selectedContact={selectedContact}
                onSelectContact={setSelectedContact}
            />
        </div>
    );
};

export default MessagingPage;