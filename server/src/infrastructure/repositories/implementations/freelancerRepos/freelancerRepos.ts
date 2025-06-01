import freelancerModal from "../../../../domain/models/FreelancerProfile";
import { IfreelancerRepo } from "../../../../domain/interfaces/IfreelancerRepo";
import mongoose from "mongoose";

export class FreelancerRepo implements IfreelancerRepo {
  async findOneAndUpdate(
    userId: string,
    availability: string,
    experience: number,
    education: string,
    hourlyRate: number,
    skills: string[],
    location: string,
    reference: string,
    bio: string,
    coverResult: { secure_url: string },
    profileResult: { secure_url: string }
  ): Promise<any> {
    // const data= await freelancerModal.find();

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid user ID format");
    }
      const userIdObj = new mongoose.Types.ObjectId(userId);

    const result = await freelancerModal.findOneAndUpdate(
      { userId:userIdObj },
      {
        availability,
        experienceLevel:experience,
        education,
        hourlyRate,
        skills,
        location,
        reference,
        bio,
        profilePic: profileResult.secure_url,
        coverPic: coverResult.secure_url,
      },
      {
        new: true,
        upsert: true,
      }
    );

    return result;
  }

  async findOne(userId: string | unknown) {
    const result = await freelancerModal.findOne({ userId });    
    return result;
  }
}
