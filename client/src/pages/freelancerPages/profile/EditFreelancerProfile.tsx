import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent, } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { type AppDispatch, type RootState } from "../../../app/store";
import ProfilePhotoUpload from "../../../components/client/profile/profileForm/ProfilePhotoUpload";
import CoverPhotoUpload from "../../../components/client/profile/profileForm/CoverPhotoUpload";
import FormField from "../../../components/client/profile/profileForm/FormField";
import CoverModal from "../../../components/coverImageCropper/CoverModal";
// import { getClientProfile, updateClientProfile, type ClientProfile } from "../../../features/clientFeatures/profile/clientProfileSlice";
import { useDispatch } from "react-redux";
import { getUserDetails } from "../../../features/auth/authSlice";
import type { FreelancerProfile } from "../../../features/freelancerFeatures/profile/freelancerProfileSlice";
import Skill from "../../../components/freelancer/Skills";
import { updateFreelancerProfile, getFreelancerProfile } from "../../../features/freelancerFeatures/profile/freelancerProfileSlice";

interface ProfileData {
  coverPic?: string | null;
  profilePic?: string | null;
  fullName?: string;
  email?: string;
  address?: string;
  availability?: string;
  experience?: string;
  education?: string;
  hourlyRate?: string;
  skills?: string[];
  location?: string;
  reference?: string;
  bio?: string;
}


export default function EditFreelancerProfile() {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: "",
    email: "",
    address: "",
    availability: "",
    experience: "",
    education: "",
    hourlyRate: "",
    skills: [],
    location: "",
    reference: "",
    bio: "",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, freelancer } = useSelector((state: RootState) => state.freelancerProfile);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getFreelancerProfile())
      .unwrap()
      .catch((error: { message?: string }) => {
        console.error(error?.message);
      });
  }, [dispatch]);

  useEffect(() => {
    if (user || freelancer) {
      setProfileData({
        fullName: user?.fullName || "",
        email: user?.email || "",
        address: freelancer?.address || "",
        availability: freelancer?.availability || "",
        experience: freelancer?.experienceLevel || "",
        education: freelancer?.education || "",
        hourlyRate: freelancer?.hourlyRate || "",
        skills: freelancer?.skills || [],
        location: freelancer?.location || "",
        reference: freelancer?.reference || "",
        bio: freelancer?.bio || "",
      });
      setCoverPhoto(freelancer?.coverPic || null);
      setProfilePhoto(freelancer?.profilePic || null);
    }
  }, [user, freelancer]);

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
    const {
      fullName,
      email,
      availability,
      experience,
      education,
      hourlyRate,
      location,
      skills,
      reference,
      bio,
    } = profileData;

    if (!fullName?.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!email?.trim()) {
      toast.error("Email is required.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (!availability?.trim()) {
      toast.error("availability is required.");
      return;
    }
    if (!experience?.trim()) {
      toast.error("experienceLevel is required.");
      return;
    }
    if (!education?.trim()) {
      toast.error("education is required.");
      return;
    }
    if (Number(hourlyRate) <= 0) {
      toast.error("Hourly Rate is must > 0.");
      return;
    }
    if (!location?.trim()) {
      toast.error("location is required.");
      return;
    }
    // if (skills?.length > 0) {
    //   toast.error("Minimum One skill is required.");
    //   return;
    // }
    if (!reference?.trim()) {
      toast.error("Website is required.");
      return;
    }
    const urlRegex = /^(https?:\/\/)([\w.-]+)\.([a-z]{2,})(\/\S*)?$/i;
    if (!urlRegex.test(reference)) {
      toast.error("Enter a valid website URL.");
      return;
    }
    if (!bio?.trim()) {
      toast.error("Description is required.");
      return;
    }
    if (!coverPhoto || !profilePhoto) {
      toast.error("Cover or Profile Photo Missing");
      return;
    }
    const isChanged =
      user?.fullName !== fullName ||
      user?.email !== email ||
      freelancer?.availability !== availability ||
      freelancer?.experienceLevel !== experience ||
      freelancer?.education !== education ||
      freelancer?.hourlyRate !== hourlyRate ||
      freelancer?.skills !== skills ||
      freelancer?.location !== location ||
      freelancer?.reference !== reference ||
      freelancer?.bio !== bio ||

      freelancer?.profilePic !== profilePhoto ||
      freelancer?.coverPic !== coverPhoto;

    if (!isChanged) {
      toast.info("No changes detected");
      return;
    }

    let profilePhotoBase64 = undefined;
    if (freelancer?.profilePic !== profilePhoto && profilePhoto) {
      profilePhotoBase64 = await blobToBase64(profilePhoto);
      setProfilePhoto(profilePhotoBase64);
    }

    const formData: FreelancerProfile = {
      fullName: profileData.fullName,
      email: profileData.email,
      availability: profileData.availability,
      experienceLevel: profileData.experience,
      education: profileData.education,
      hourlyRate: profileData.hourlyRate,
      skills: profileData?.skills ? profileData?.skills : [],
      location: profileData.location,
      reference: profileData.reference,
      bio: profileData.bio,
      coverPic: coverPhoto, 
      profilePic: profilePhotoBase64 || profilePhoto, 
    };
    console.log(formData.coverPic);


    dispatch(updateFreelancerProfile(formData as FreelancerProfile))
      .unwrap()
      .then(() => {
        dispatch(getUserDetails()).unwrap()
        toast.success("Profile Update successfully");
      })
      .catch((error: { error?: string }) => {
        toast.error(error?.error || "An error occurred");
      });
  };

  const handleSkillsChange = useCallback((updatedSkills: string[]) => {
    setProfileData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  }, []);

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
          value={profileData.fullName ?? ""}
          onChange={handleChange}
          placeholder="Enter your full name"
        />

        {/* <FormField
          label="Email Address"
          name="email"
          value={profileData.email ?? ""}
          onChange={handleChange}
          type="email"
          placeholder="Enter your email"
        /> */}

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            Availability
          </label>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="full-time"
                name="availability"
                value="full-time"
                checked={profileData.availability === "full-time"}
                onChange={handleChange}
                className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
              />
              <label htmlFor="full-time" className="ml-2 text-gray-700">
                Full-time
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="part-time"
                name="availability"
                value="part-time"
                checked={profileData.availability === "part-time"}
                onChange={handleChange}
                className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300"
              />
              <label htmlFor="part-time" className="ml-2 text-gray-700">
                Part-time
              </label>
            </div>
          </div>
        </div>

        <FormField
          label="Experience Level"
          name="experience"
          value={profileData.experience ?? ""}
          onChange={handleChange}
          placeholder="Enter your company name"
        />

        <FormField
          label="Education"
          name="education"
          value={profileData.education ?? ""}
          onChange={handleChange}
          placeholder="Enter your location"
        />

        <FormField
          label="Hourly Rate"
          name="hourlyRate"
          value={profileData.hourlyRate ?? ""}
          onChange={handleChange}
          placeholder="Enter your location"
        />

        <Skill
          onSkillsChange={handleSkillsChange}
          dynamicSkill={freelancer?.skills || []} />

        <FormField
          label="Location"
          name="location"
          value={profileData.location ?? ""}
          onChange={handleChange}
          placeholder="Enter your location"
        />

        <FormField
          label="Reference"
          name="reference"
          value={profileData.reference ?? ""}
          onChange={handleChange}
          type="url"
          placeholder="https://example.com"
        />

        <FormField
          label="Bio"
          name="bio"
          value={profileData.bio ?? ""}
          onChange={handleChange}
          type="textarea"
          placeholder="Write a short Bio..."
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