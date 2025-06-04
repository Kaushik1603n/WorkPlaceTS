import { IMarketPlace } from "../../../../domain/interfaces/IMarketPlaceRepo";
import ProjectModel from "../../../../domain/models/Projects";
export class marketPlaceRepo implements IMarketPlace {
  async findAllProjects(searchQuery: object): Promise<any> {
    const result = await ProjectModel.find(searchQuery,{
        _id:1,
        title:1,
        stack:1,
        description:1,
        skills:1,
        budget:1,
        proposals:1,
        createdAt:1,
    }); 
  
    return result;
  }
}
