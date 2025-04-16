import { IProject } from "../models/project.model";
import { ProjectType } from "../typeDefs/project.type";


export function transformProject(project:IProject):ProjectType{
    const obj=project.toObject({virtuals:true})

    return {
        id:obj.id,
        name:obj.name,
        description:obj.description,
        progress:obj.progress,
        status: obj.status,
    priority: obj.priority,
    dueDate:new Date(obj.dueDate),
    team:obj.team || [].map((m:any)=>m.toString()),
    starred: obj.starred,
    createdBy: obj.createdBy.toString(),
    createdAt: obj.createdAt ? new Date(obj.createdAt) : undefined,
    updatedAt: obj.updatedAt ? new Date(obj.updatedAt) : undefined,
    }

}