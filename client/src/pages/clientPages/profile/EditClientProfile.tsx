import { useEffect, useState, type ChangeEvent, type FormEvent, } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { type AppDispatch, type RootState } from "../../../app/store";
import ProfilePhotoUpload from "../../../components/client/profile/profileForm/ProfilePhotoUpload";
import CoverPhotoUpload from "../../../components/client/profile/profileForm/CoverPhotoUpload";
import FormField from "../../../components/client/profile/profileForm/FormField";
import CoverModal from "../../../components/coverImageCropper/CoverModal";
import { getClientProfile, updateClientProfile, type ClientProfile } from "../../../features/clientFeatures/profile/clientProfileSlice";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../../features/auth/authSlice";

interface ProfileData {
  fullName: string;
  companyName: string;
  email: string;
  location: string;
  website: string;
  description: string;
}


export default function ClientProfileEdit() {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    companyName: "",
    email: "",
    location: "",
    website: "",
    description: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, client } = useSelector((state: RootState) => state.clientProfile);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getClientProfile())
      .unwrap()
      .catch((error: { message?: string }) => {
        console.error(error?.message);
      });
  }, [dispatch]);

  useEffect(() => {
    if (user || client) {
      setProfileData({
        fullName: user?.fullName || "",
        companyName: client?.companyName || "",
        email: user?.email || "",
        location: client?.location || "",
        website: client?.website || "",
        description: client?.description || "",
      });
      setCoverPhoto(client?.coverPic || null);
      setProfilePhoto(client?.profilePic || null);
    }
  }, [user, client]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, type: "profile" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      if (type === "profile") {
        setProfilePhoto(imageUrl);
      } else {
        setCoverPhoto(imageUrl);
      }
    }
  };

  const blobToBase64 = async (blobUrl: string): Promise<string> => {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { fullName, companyName, email, location, website, description } = profileData;

    if (!fullName.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!companyName.trim()) {
      toast.error("Company Name is required.");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (!location.trim()) {
      toast.error("Location is required.");
      return;
    }
    if (!website.trim()) {
      toast.error("Website is required.");
      return;
    }
    const urlRegex = /^(https?:\/\/)([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
    if (!urlRegex.test(website)) {
      toast.error("Enter a valid website URL.");
      return;
    }
    if (!description.trim()) {
      toast.error("Description is required.");
      return;
    }

    const isChanged =
      user?.fullName !== fullName ||
      client?.companyName !== companyName ||
      user?.email !== email ||
      client?.location !== location ||
      client?.website !== website ||
      client?.description !== description ||
      client?.profilePic !== profilePhoto ||
      client?.coverPic !== coverPhoto;

    if (!isChanged) {
      toast.info("No changes detected");
      return;
    }

    let profilePhotoBase64 = undefined;
    if (client?.profilePic !== profilePhoto && profilePhoto) {
      profilePhotoBase64 = await blobToBase64(profilePhoto);
      setProfilePhoto(profilePhotoBase64);
    } 

    const formData: ClientProfile = {
      companyName: profileData.companyName,
      description: profileData.description,
      email: profileData.email,
      fullName: profileData.fullName,
      location: profileData.location,
      website: profileData.website,
      coverPic: coverPhoto, 
      profilePic: profilePhotoBase64 || profilePhoto, 
    };

    dispatch(updateClientProfile(formData as ClientProfile))
      .unwrap()
      .then(() => {
        dispatch(getUserDetails()).unwrap()
        toast.success("Profile Update successfully");
      })
      .catch((error: { error?: string }) => {
        toast.error(error?.error || "An error occurred");
      });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto border border-[#27AE60]">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Edit Client Profile
      </h2>

      <ProfilePhotoUpload
        profilePhoto={profilePhoto}
        onImageUpload={(e) => handleImageUpload(e, "profile")}
      />

      <CoverPhotoUpload
        coverPhoto={coverPhoto}
        onEditClick={() => setModalOpen(true)}
      />

      <div className="space-y-5">
        <FormField
          label="Full Name"
          name="fullName"
          value={profileData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

        <FormField
          label="Company Name"
          name="companyName"
          value={profileData.companyName}
          onChange={handleChange}
          placeholder="Enter your company name"
        />
        <FormField
          label="Location"
          name="location"
          value={profileData.location}
          onChange={handleChange}
          placeholder="Enter your location"
        />

        <FormField
          label="Website"
          name="website"
          value={profileData.website}
          onChange={handleChange}
          type="url"
          placeholder="https://example.com"
        />

        <FormField
          label="Description"
          name="description"
          value={profileData.description}
          onChange={handleChange}
          type="textarea"
          placeholder="Write a short description..."
          rows={4}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-[#2ECC71] hover:bg-[#27AE60] text-white font-semibold py-3 rounded-md transition"
        >
          {loading ? "Updating Profile..." : "Update Profile"}
        </button>
      </div>

      {modalOpen && (
        <CoverModal
          updateCover={setCoverPhoto}
          closeModal={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}