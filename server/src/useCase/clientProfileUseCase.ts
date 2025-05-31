import cloudinary from "../infrastructure/cloudinary";
import { ClientRepo } from "../infrastructure/repositories/implementations/clientRepos/clientProfileRepo";
import { UserRepo } from "../infrastructure/repositories/implementations/userRepo";

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
  ) {
    if (typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }
    // console.log(coverPic);
    
    let coverPromise, profilePromise;

    if (coverPic && !coverPic.includes("res.cloudinary.com")) {
      coverPromise = cloudinary.uploader.upload(coverPic, {
        folder: "cover_uploads",
      });
      console.log((await coverPromise).url);
      
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
  ) {
    if (typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }

    if (!email || !fullName) {
      throw new Error("Email and full name are required");
    }

    const user = await this.user.findByEmail(email);
    // if (!user) throw new Error("Invalid credentials");

    if (user.email !== email) {
      const emailUsed = await this.user.findByEmail(email);
      if (!emailUsed) {
        return this.user.updateEmail(userId, email);
      } else {
        throw new Error("Email already in use");
      }
    }
    let userData: any;
    if (user.fullName !== fullName) {
      userData = await this.user.updateName(userId, fullName);
    }

    return userData;
  }

  async profileDetails(userId:string|unknown){
     if (typeof userId !== "string") {
      throw new Error("Invalid user ID");
    }
    const result = await this.client.findOne(userId);
    return result
  }
}
