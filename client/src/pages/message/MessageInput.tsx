import React, { useRef, useState } from 'react';
import { Send, Paperclip, Image, FileText, X } from 'lucide-react';

interface MessageInputProps {
  messageInput: string;
  setMessageInput: (value: string) => void;
  setMediaInput: (value: string[]) => void;
  handleSendMessage: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

interface AttachedFile {
  file: File;
  type: 'image' | 'pdf' | 'other';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'media' | 'pdf' | 'general') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const newFile: AttachedFile = {
      file,
      type: file.type.startsWith('image/') ? 'image' :
        file.type === 'application/pdf' ? 'pdf' : 'other'
    };

    // Create preview for images
    if (newFile.type === 'image') {
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
  };

  // Remove file (now only one file exists, so index 0)
  const removeFile = () => {
    setAttachedFiles([]);
  };



  const handleSendWithAttachments = async () => {
    try {
      const uploadPromises = attachedFiles.map(async (attachedFile) => {
        const formData = new FormData();
        formData.append('file', attachedFile.file);
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

        return await response.json();
      });

      const uploadResults = await Promise.all(uploadPromises);
      console.log('Upload results:', uploadResults);

      const fileUrls: string[] = uploadResults.map(result => result.secure_url);

      setMediaInput([...fileUrls]);
      handleSendMessage();

      setAttachedFiles([]);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload files. Please try again.');
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={16} className="text-blue-500" />;
      case 'pdf':
        return <FileText size={16} className="text-red-500" />;
      default:
        return <Paperclip size={16} className="text-gray-500" />;
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
                onClick={() => removeFile()}
                className="ml-2 p-1 hover:bg-gray-100 rounded-full transition-colors"
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
            onClick={() => setShowAttachMenu(!showAttachMenu)}
            className="p-3 text-gray-500 hover:text-green-500 hover:bg-green-50 rounded-full transition-colors"
          >
            <Paperclip size={18} />
          </button>

          {showAttachMenu && (
            <div className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-[160px]">
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
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-[#EFFFF6] placeholder-gray-500"
        />

        {/* Send Button */}
        <button
          onClick={handleSendWithAttachments}
          className="p-3 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow-sm"
        >
          <Send size={18} />
        </button>
      </div>

      {/* Hidden File Inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFileSelect(e, 'media')}
        className="hidden"
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileSelect(e, 'pdf')}
        className="hidden"
      />

    </div>
  );
};

export default MessageInput;