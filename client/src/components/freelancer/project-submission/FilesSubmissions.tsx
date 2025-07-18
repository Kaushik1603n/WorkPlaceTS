import React, { useState } from 'react';
import { Download, Upload } from 'lucide-react';
import type{ FileItem } from './types/project';

interface FilesSubmissionsProps {
  files: FileItem[];
}

export const FilesSubmissions: React.FC<FilesSubmissionsProps> = ({
  files,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setSelectedFile(null);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Files & Submissions</h2>
      
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Client's Uploads</h3>
        <div className="space-y-2">
          {files.filter(f => f.type === 'client').map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
              <a 
                href={file.url} 
                download
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Freelancer's Submissions</h3>
        <div className="space-y-2">
          {files.filter(f => f.type === 'freelancer').map((file) => (
            <div key={file.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
              <div className="flex items-center space-x-2">
                <Download className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-sm text-gray-700 block">{file.name}</span>
                  {file.uploadDate && <span className="text-xs text-gray-500">{file.uploadDate}</span>}
                </div>
              </div>
              <a 
                href={file.url} 
                download
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Download
              </a>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <label className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer text-center">
          <input type="file" className="hidden" onChange={handleFileChange} />
          {selectedFile ? selectedFile.name : 'Select File'}
        </label>
        <button 
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          <Upload className="w-4 h-4 inline mr-2" />
          Upload
        </button>
      </div>
    </div>
  );
};