import { Link as LinkIcon } from "lucide-react";

interface CoverPhotoUploadProps {
  coverPhoto: string | null;
  onEditClick: () => void;
}

export default function CoverPhotoUpload({
  coverPhoto,
  onEditClick,
}: CoverPhotoUploadProps) {
  return (
    <div className="mb-6">
      <label className="block font-medium text-gray-700 mb-2">
        Cover Photo
      </label>
      <div className="w-full aspect-[5.5/1] bg-gray-100 rounded-md overflow-hidden mb-2">
        {coverPhoto ? (
          <img
            src={coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No cover photo
          </div>
        )}
      </div>
      <button
        className="text-sm text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
        onClick={onEditClick}
      >
        <LinkIcon size={16} />
        Edit Cover Photo
      </button>
    </div>
  );
}