import type{ ChangeEvent } from "react";
import { Link as LinkIcon } from "lucide-react";

interface ProfilePhotoUploadProps {
  profilePhoto: string | null;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfilePhotoUpload({
  profilePhoto,
  onImageUpload,
}: ProfilePhotoUploadProps) {
  return (
    <div className="mb-6">
      <label className="block font-medium text-gray-700 mb-2">
        Profile Photo
      </label>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              No photo
            </div>
          )}
        </div>
        <div>
          <label className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
            <LinkIcon size={16} />
            Choose Profile Photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageUpload}
            />
          </label>
        </div>
      </div>
    </div>
  );
}