import { X } from "lucide-react";
import ImageCropper from "./ImageCropper";
import type{ ReactNode } from "react";

interface CoverModalProps {
  updateCover: (imageUrl: string) => void;
  closeModal: () => void;
  children?: ReactNode;
}

const CoverModal = ({ updateCover, closeModal }: CoverModalProps) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-[#EFFFF6] bg-opacity-75 transition-all backdrop-blur-sm"></div>

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center">
          <div className="relative w-[95%] sm:w-[80%] min-h-[60vh] rounded-2xl bg-[#ffffff] border border-[#27AE60] text-slate-100 text-left shadow-xl transition-all">
            <div className="px-5 py-4">
              <button
                type="button"
                className="rounded-md p-1 inline-flex items-center justify-center text-[#27AE60] hover:bg-[#EFFFF6] focus:outline-none absolute top-2 right-2"
                onClick={closeModal}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-5 w-5" />
              </button>
              <ImageCropper updateCover={updateCover} closeModal={closeModal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverModal;