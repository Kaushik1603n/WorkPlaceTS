// import UserModel from "../../../../domain/models/User";
import clientModal from "../../../../domain/models/ClientProfile";
import { clientRepoI } from "../../../../domain/interfaces/IclientRepo";

export class ClientRepo implements clientRepoI {
  async findOneAndUpdate(
    userId: string | unknown,
    companyName: string,
    description: string,
    location: string,
    website: string,
    coverResult: { secure_url: string },
    profileResult: { secure_url: string }
  ): Promise<any> {
    const result = await clientModal.findOneAndUpdate(
      { userId },
      {
        profilePic: profileResult.secure_url,
        coverPic: coverResult.secure_url,
        companyName,
        location,
        website,
        description,
      },
      {
        new: true,
        upsert: true,
      }
    );
    return result;
  }

  
}
