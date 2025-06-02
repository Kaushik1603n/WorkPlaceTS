import { userDataRepoI } from "../../../../domain/interfaces/admin/userDataRepoI";
import UserModel from "../../../../domain/models/User";

export class UserDataRepo implements userDataRepoI {
  async findFreelancer(
    page: number,
    limit: number,
    search: string
  ): Promise<any> {
    const searchQuery = {
      $and: [
        { role: "freelancer" },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };
    const result = await UserModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: 1 });
    const total = await UserModel.countDocuments(searchQuery);

    return {
      freelancer: result,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
  }
  async findClient(page: number, limit: number, search: string): Promise<any> {
    const searchQuery = {
      $and: [
        { role: "client" },
        {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        },
      ],
    };
    const result = await UserModel.find(searchQuery)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: 1 });
    const total = await UserModel.countDocuments(searchQuery);

    return {
      client: result,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
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
      .sort({ createdAt: 1 });
    return {
      users: result,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        totalItems: total,
      },
    };
  }

  async findOneByIdAndUpdate(userId: string, status: string) {
    const result = await UserModel.findByIdAndUpdate(userId, { status });
    return result;
  }
}
