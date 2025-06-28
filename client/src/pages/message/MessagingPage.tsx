import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import axiosClient from "../../utils/axiosClient";
import ContactList from "./ContactList";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import type { Contact, Message, IMessage, GetLatestMessagesResponse } from "./MessagingTypes";
import SelectChat from "./NoChat";
import { toast } from "react-toastify";

const MessagingPage = () => {
  const { socket, markMessageRead } = useSocket();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [, setMediaInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.id;

  const getUserLatestMessage = async () => {
    try {
      const response = await axiosClient.get("/message/getlatest");
      setContacts(
        (response.data.data as GetLatestMessagesResponse).latestMessagedUsers.map((item) => ({
          id: item.user._id,
          fullName: item.user.fullName,
          role: item.user.role,
          isOnline: false,
          latestMessage: item.latestMessage
            ? {
              id: item.latestMessage.id,
              text: item.latestMessage.text ? item.latestMessage.text:item.latestMessage.media?.type,
              senderId: item.latestMessage.senderId,
              contactId: item.latestMessage.contactId,
              timestamp: item.latestMessage.timestamp,
              isRead: item.latestMessage.isRead,
              sender: item.latestMessage.senderId === userId ? "user" : "contact",
            }
            : null,
          unreadCount: item.unreadCount || 0,
        }))
      );
    } catch (error) {
      console.error("Error fetching User:", error);
    }
  };

  useEffect(() => {
    getUserLatestMessage();
  }, []);

  useEffect(() => {
    if (!socket || !userId) return;

    const fetchMessages = async () => {
      if (!selectedContact) return;
      try {
        const response = await axiosClient.post("/message/getMessage", {
          senderId: userId,
          contactId: selectedContact.id,
        });
        const fetchedMessages = response.data.data.map((msg: IMessage) => ({
          ...msg,
          sender: msg.senderId === userId ? "user" : "contact",
        }));
        setMessages(fetchedMessages);

        fetchedMessages.forEach((msg: Message) => {
          if (msg.sender === "contact" && !msg.isRead) {
            markMessageRead(msg.id, selectedContact.id);
          }
        });
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    socket.on("message", (message: Message) => {
      if (
        selectedContact &&
        (message.contactId === String(selectedContact.id) ||
          message.senderId === String(selectedContact.id))
      ) {
        setMessages((prevMessages) => {
          if (prevMessages.some((msg) => msg.id === message.id)) {
            return prevMessages;
          }
          const newMessage: Message = {
            ...message,
            sender: message.senderId === userId ? "user" : "contact",
            timestamp: message.timestamp || new Date().toISOString(),
          };
          return [...prevMessages, newMessage];
        });

        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === message.senderId || contact.id === message.contactId
              ? {
                ...contact,
                latestMessage: {
                  ...message,
                  sender: message.senderId === userId ? "user" : "contact",
                },
                unreadCount:
                  contact.id === message.senderId && message.senderId !== userId
                    ? (contact.unreadCount || 0) + 1
                    : contact.unreadCount,
              }
              : contact
          )
        );
      } else if (message.senderId !== userId) {
        setContacts((prevContacts) => {
          const contactExists = prevContacts.find((c) => c.id === message.senderId);
          if (contactExists) {
            return prevContacts.map((contact) =>
              contact.id === message.senderId
                ? {
                  ...contact,
                  latestMessage: {
                    ...message,
                    sender: "contact",
                  },
                  unreadCount: (contact.unreadCount || 0) + 1,
                }
                : contact
            );
          }
          return prevContacts;
        });
      }
    });

    socket.on("messagesRead", ({ contactId }: { contactId: string }) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.senderId === contactId && !msg.isRead ? { ...msg, isRead: true } : msg
        )
      );
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === contactId
            ? {
              ...contact,
              unreadCount: 0,
            }
            : contact
        )
      );
    });

    socket.on("messageDeleted", ({ messageId }: { messageId: string }) => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );

      setContacts((prevContacts) =>
        prevContacts.map((contact) => {
          if (
            contact.latestMessage &&
            contact.latestMessage.id === messageId
          ) {
            return { ...contact, latestMessage: null };
          }
          return contact;
        })
      );
    });

    return () => {
      socket.off("message");
      socket.off("messagesRead");
      socket.off("messageDeleted");
    };
  }, [socket, selectedContact, userId, markMessageRead]);

  const deleteMsg = async (id: string) => {
    try {
      const res = await axiosClient.delete(`/message/deletemsg/${id}`);
      if (!res.data.success) {
        toast.error("Failed to delete message");
      } else {
        toast.success("Message deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting message:", error);
      toast.error("Error deleting message");
    }
  }

 

  const handleSendMessage = (fileUrl?: string, fileType?: 'image' | 'pdf' ) => {
    if (!userId) {
      console.error("User ID is undefined");
      return;
    }
    if (messageInput.trim() && selectedContact && socket) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: messageInput,
        senderId: userId,
        sender: "user",
        contactId: String(selectedContact.id),
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      socket.emit("sendMessage", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact.id
            ? {
              ...contact,
              latestMessage: newMessage,
            }
            : contact
        )
      );
      setMessageInput("");
    } else if (fileUrl && selectedContact && socket) {
      const newMessage: Message = {
        id: Date.now().toString(),
        media: {
          url: fileUrl,
          type: fileType || "image",
        },
        senderId: userId,
        sender: "user",
        contactId: String(selectedContact.id),
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      socket.emit("sendMedia", newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setContacts((prevContacts) =>
        prevContacts.map((contact) =>
          contact.id === selectedContact.id
            ? {
              ...contact,
              latestMessage: newMessage,
            }
            : contact
        )
      );
      setMediaInput("");
    }
    getUserLatestMessage()
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSelectedContact(contact);
    if (socket && userId && contact.unreadCount > 0) {
      socket.emit("markMessagesRead", { userId, contactId: contact.id });
      setContacts((prevContacts) =>
        prevContacts.map((c) =>
          c.id === contact.id ? { ...c, unreadCount: 0 } : c
        )
      );
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.senderId === contact.id && !msg.isRead
            ? { ...msg, isRead: true }
            : msg
        )
      );
    }
  };

  return (
    <div className="flex h-full gap-4">
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-[#27AE60]">
        {selectedContact ? (
          <>
            <ChatHeader contact={selectedContact} />
            <MessageList messages={messages} userId={userId}
              setDeleteMsg={deleteMsg}
            />
            <MessageInput
              messageInput={messageInput}
              setMessageInput={setMessageInput}
              setMediaInput={setMediaInput}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
            />
          </>
        ) : (
          <SelectChat contacts={contacts} setSelectedContact={handleSelectContact} />
        )}
      </div>
      <ContactList
        contacts={contacts}
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
      />
    </div>
  );
};

export default MessagingPage;