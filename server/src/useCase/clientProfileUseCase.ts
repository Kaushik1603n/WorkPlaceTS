import {
  ClientProfileType,
  FinancialStatsResponse,
  FreelancerResultTypeWithPage,
  ProjectStatsResponse,
} from "../domain/types/ClientProfile";
import cloudinary from "../infrastructure/cloudinary";
import { ClientRepo } from "../infrastructure/repositories/implementations/clientRepos/clientProfileRepo";
import { UserRepo } from "../infrastructure/repositories/implementations/userRepo";
import { Messages } from "../interfaceAdapters/controllers/messages";

export class ClientProfileUserCase {
  constructor(private client: ClientRepo, private user: UserRepo) {
    this.client = client;
    this.user = user;
  }

  async clientProfileEdit(
    userId: string | unknown,
    companyName: string,
    description: string,
    location: string,
    website: string,
    coverPic: string,
    profilePic: string
  ): Promise<ClientProfileType | null> {
    if (typeof userId !== "string") {
      throw new Error(Messages.INVALID_USERID);
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

    const clientProfileData = await this.client.findOneAndUpdate(
      userId,
      companyName,
      description,
      location,
      website,
      coverResult,
      profileResult
    );

    if (!clientProfileData) {
      throw new Error("Failed to update client profile");
    }

    return clientProfileData;
  }

  async updateNameAndEmail(
    userId: string | unknown,
    fullName: string,
    email: string
  ): Promise<any> {
    if (typeof userId !== "string") {
      throw new Error(Messages.INVALID_USERID);
    }

    if (!email || !fullName) {
      throw new Error(Messages.EMAIL_FullName_REQUIRED);
    }

    const user = await this.user.findByEmail(email);

    if (!user) throw new Error(Messages.INVALID_USER);

    if (user.email !== email) {
      const emailUsed = await this.user.findByEmail(email);
      if (!emailUsed) {
        return this.user.updateEmail(userId, email);
      } else {
        throw new Error("Email already in use");
      }
    }

    const userData = await this.user.updateName(userId, fullName);

    return userData;
  }

  async profileDetails(
    userId: string | unknown
  ): Promise<ClientProfileType | null> {
    if (typeof userId !== "string") {
      throw new Error(Messages.INVALID_USERID);
    }
    const result = await this.client.findOne(userId);
    return result;
  }

  async freelancerUseCase(
    page: number,
    limit: number
  ): Promise<FreelancerResultTypeWithPage> {
    const result = await this.client.findFreelancer(page, limit);
    return result;
  }

  async HiringProjectsUseCase(userId: string): Promise<ProjectStatsResponse> {
    const result = await this.client.findProjectByUserId(userId);
    return result;
  }
  
  async FinancialDataUseCase(userId: string): Promise<FinancialStatsResponse> {
    const result = await this.client.findFinancialByUserId(userId);

    return result;
  }
}
