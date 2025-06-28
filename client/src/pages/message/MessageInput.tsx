import React, { useRef, useState } from 'react';
import { Send, Paperclip, Image, FileText, X } from 'lucide-react';

type FileType = 'image' | 'pdf';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  setMediaInput: (value: string) => void;
  handleSendMessage: (fileUrl?: string, fileType?: FileType) => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

interface AttachedFile {
  file: File;
  type: FileType;
  preview?: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  messageInput,
  setMessageInput,
  setMediaInput,
  handleSendMessage,
  handleKeyPress,
}) => {
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const hasText = messageInput.trim().length > 0;
  const hasAttachment = attachedFiles.length > 0;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    let fileType: FileType;

    if (file.type.startsWith('image/')) {
      fileType = 'image';
    } else if (file.type === 'application/pdf') {
      fileType = 'pdf';
    } else {
      // Handle unexpected file types or reject them
      return;
    }

    const newFile: AttachedFile = {
      file,
      type: fileType
    };

    // Create preview for images
    if (fileType === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        newFile.preview = e.target?.result as string;
        setAttachedFiles([newFile]); // Replace previous files
      };
      reader.readAsDataURL(file);
    } else {
      setAttachedFiles([newFile]); // Replace previous files
    }

    setShowAttachMenu(false);
    
    // Clear text input when file is selected
    if (messageInput.trim()) {
      setMessageInput('');
    }
  };

  const removeFile = () => {
    setAttachedFiles([]);
  };

  const handleSendWithAttachments = async () => {
    if (isSending) return; // Prevent double sending
    
    try {
      if (attachedFiles.length === 0 && !messageInput.trim()) {
        return; // No files or message to send
      }

      setIsSending(true);

      let fileUrl: string | undefined;
      let fileType: FileType | undefined;

      if (attachedFiles.length > 0) {
        const formData = new FormData();
        formData.append('file', attachedFiles[0].file);
        formData.append('upload_preset', 'message_file');
        formData.append('folder', 'message_attachments');
        formData.append('resource_type', 'auto');

        const response = await fetch(
          `https://api.cloudinary.com/v1_1/dkcdirowt/upload`,
          {
            method: 'POST',
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Cloudinary error:', errorData);
          throw new Error('Upload failed');
        }

        const result = await response.json();
        fileUrl = result.secure_url;
        fileType = attachedFiles[0].type;
        setMediaInput(fileUrl);
      }

      handleSendMessage(fileUrl, fileType);
      setAttachedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessageInput(value);
    
    // Close attachment menu if user starts typing
    if (value.trim() && showAttachMenu) {
      setShowAttachMenu(false);
    }
  };

  const handleAttachmentMenuToggle = () => {
    // Only allow opening attachment menu if no text is typed
    if (!hasText) {
      setShowAttachMenu(!showAttachMenu);
    }
  };

  const getFileIcon = (type: FileType) => {
    switch (type) {
      case 'image':
        return <Image size={16} className="text-blue-500" />;
      case 'pdf':
        return <FileText size={16} className="text-red-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-4 bg-[#EFFFF6] border-t border-[#27AE60] rounded-b-lg">
      {/* File Attachments Preview */}
      {attachedFiles.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachedFiles.map((attachedFile, index) => (
            <div key={index} className="flex items-center bg-white rounded-lg p-2 border border-gray-200 shadow-sm max-w-xs">
              {attachedFile.type === 'image' && attachedFile.preview ? (
                <img
                  src={attachedFile.preview}
                  alt="Preview"
                  className="w-8 h-8 object-cover rounded mr-2"
                />
              ) : (
                <div className="mr-2">
                  {getFileIcon(attachedFile.type)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attachedFile.file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(attachedFile.file.size)}
                </p>
              </div>
              <button
                onClick={removeFile}
                disabled={isSending}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-3">
        {/* Attachment Menu */}
        <div className="relative">
          <button
            onClick={handleAttachmentMenuToggle}
            disabled={hasText || isSending}
            className={`p-3 rounded-full transition-colors ${
              hasText || isSending
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:text-green-500 hover:bg-green-50'
            }`}
            title={hasText ? "Clear text to attach files" : "Attach files"}
          >
            <Paperclip size={18} />
          </button>

          {showAttachMenu && !hasText && !isSending && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[160px] z-10">
              <button
                onClick={() => imageInputRef.current?.click()}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <Image size={16} className="text-blue-500" />
                <span>Images</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                <FileText size={16} className="text-red-500" />
                <span>PDF Files</span>
              </button>
            </div>
          )}
        </div>

        {/* Message Input */}
        <input
          type="text"
          value={messageInput}
          onChange={handleTextInputChange}
          onKeyPress={handleKeyPress}
          disabled={hasAttachment || isSending}
          placeholder={
            hasAttachment 
              ? "Remove attachment to type message..." 
              : isSending 
                ? "Sending..." 
                : "Type your message..."
          }
          className={`flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-[#EFFFF6] transition-colors ${
            hasAttachment || isSending 
              ? 'placeholder-gray-400 text-gray-400 cursor-not-allowed' 
              : 'placeholder-gray-500 text-gray-900'
          }`}
        />

        {/* Send Button */}
        <button
          onClick={handleSendWithAttachments}
          disabled={isSending || (!hasText && !hasAttachment)}
          className={`p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 transition-all shadow-sm ${
            isSending
              ? 'bg-gray-400 cursor-not-allowed'
              : (!hasText && !hasAttachment)
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isSending ? (
            <div className="animate-spin rounded-full h-[18px] w-[18px] border-b-2 border-white"></div>
          ) : (
            <Send size={18} />
          )}
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={isSending}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        disabled={isSending}
        className="hidden"
      />
    </div>
  );
};

export default MessageInput;