import cloudinary from "../infrastructure/cloudinary";
import { FreelancerRepo } from "../infrastructure/repositories/implementations/freelancerRepos/freelancerRepos";
import { UserRepo } from "../infrastructure/repositories/implementations/userRepo";

export class FreelancerProfileUseCase {
  constructor(private freelancer: FreelancerRepo, private user: UserRepo) {
    this.freelancer = freelancer;
    this.user = user;
  }

  async freelancerProfileEdit(
    userId: string,
    availability: string,
    experience: number,
    education: string,
    hourlyRate: number,
    skills: string[],
    location: string,
    reference: string,
    bio: string,
    coverPic: string,
    profilePic: string
  ) {
    if (typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }

    let coverPromise, profilePromise;

    if (coverPic && !coverPic.includes("res.cloudinary.com")) {
      coverPromise = cloudinary.uploader.upload(coverPic, {
        folder: "cover_uploads",
      });
    } else {
      coverPromise = Promise.resolve({ secure_url: coverPic });
    }

    if (profilePic && !profilePic.includes("res.cloudinary.com")) {
      profilePromise = cloudinary.uploader.upload(profilePic, {
        folder: "profile_uploads",
      });
    } else {
      profilePromise = Promise.resolve({ secure_url: profilePic });
    }

    const [coverResult, profileResult] = await Promise.all([
      coverPromise,
      profilePromise,
    ]);

    const freelancerProfileData = await this.freelancer.findOneAndUpdate(
      userId,
      availability,
      experience,
      education,
      hourlyRate,
      skills,
      location,
      reference,
      bio,
      coverResult,
      profileResult
    );

    if (!freelancerProfileData) {
      throw new Error("Failed to update freelancer profile");
    }

    return freelancerProfileData;
  }

  async updateNameAndEmail(userId: string, fullName: string, email: string) {
    if (!email || !fullName) {
      throw new Error("Email and full name are required");
    }

    const user = await this.user.findById(userId);

    if (user?.email !== email) {
      const emailUsed = await this.user.findByEmail(email);
      if (!emailUsed) {
        return this.user.updateEmail(userId, email);
      } else {
        throw new Error("Email already in use");
      }
    }

    const userData = await this.user.updateName(userId, fullName);

    return userData ?? user;
  }
  async profileDetails(userId: string | unknown) {
    if (typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }
    const result = await this.freelancer.findOne(userId);
    return result;
  }

  async clientUseCase(page: number, limit: number) {
    const result = await this.freelancer.findFreelancer(page, limit);
    return result;
  }
  async freelancerTicketUseCase(userId:string,page: number, limit: number) {
    const result = await this.freelancer.findFreelancerTicket(userId,page, limit);
    return result;
  }
  async totalcountUseCase(userId: string) {
    const result = await this.freelancer.findCounts(userId);
    return result;
  }
  async totalEarningsUseCase(userId: string) {
    const result = await this.freelancer.findTotalEarnings(userId);
    return result;
  }
  async dashboardProjectUseCase(userId: string) {
    const result = await this.freelancer.findTotalProject(userId);
    return result;
  }
}
