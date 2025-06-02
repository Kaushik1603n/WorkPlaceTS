import { userDataRepoI } from "../../../../domain/interfaces/admin/userDataRepoI";
import UserModel from "../../../../domain/models/User";

export class UserDataRepo implements userDataRepoI {
  async findFreelancer(): Promise<any> {
    const result = await UserModel.find({ role: "freelancer" });
    return result;
  }
  async findClient(): Promise<any> {
    const result = await UserModel.find({ role: "client" });
    return result;
  }
  async find(page: number, limit: number, search: string): Promise<any> {
    const searchQuery = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    };

    const total = await UserModel.countDocuments(searchQuery);
    const result = await UserModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ name: 1 });
    return {
      users: result,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
  }
}
