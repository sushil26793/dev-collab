import { Resolver, Query, Arg, Mutation, Ctx, AuthenticationError } from "type-graphql";
import { ProjectStatus, ProjectType, ProjectPriority } from "../typeDefs/project.type";
import { Project as ProjectModel } from "../models/project.model";
import { Context } from "../utils/context";
import { transformProject } from "../utils/transformProject";
import { Types } from "mongoose";

@Resolver(of => ProjectType)
export class ProjectResolver {
  @Query(returns => [ProjectType])
  async projects(@Ctx() ctx: Context): Promise<ProjectType[]> {

    const userId = ctx.userId
    if (!userId) {
      throw new AuthenticationError("unauthorized access.")
    }

    const projects = await ProjectModel.find({
      $or: [{ createdBy: userId }, { team: userId }]
    }).populate("team createdBy");

    return projects.map((project) => transformProject(project))
  }

  @Query(returns => ProjectType, { nullable: true })
  async project(@Arg("id") id: string): Promise<ProjectType | null> {
    return await ProjectModel.findById(id);
  }

  @Mutation(returns => ProjectType)
  async createProject(
    @Arg("name") name: string,
    @Arg("description", { nullable: true }) description: string,
    @Arg("dueDate") dueDate: string,
    @Arg("priority", type => ProjectPriority) priority: ProjectPriority,
    @Arg("team", type => [String], { nullable: true }) team: string[],
    @Arg("starred", { defaultValue: false ,nullable:true}) starred: boolean,
    @Arg("createdBy") createdBy: string
  ): Promise<ProjectType> {
    const project = new ProjectModel({
      name,
      description,
      dueDate: new Date(dueDate),
      priority,
      team: team || [],
      starred,
      createdBy,
      status: ProjectStatus.planning,
      progress: 0,
    });
    await project.save();
    return transformProject(project);
  }

  @Mutation(returns => ProjectType)
  async addMemberToProject(
    @Arg("projectId") projectId: string,
    @Arg("memberId") memberId: string,
    @Ctx() ctx: Context
  ): Promise<ProjectType> {
    const userId = ctx.userId;
    if (!userId) {
      throw new AuthenticationError("unauthorized access.");
    }

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      throw new Error("Project not found.");
    }

    if (!project.team.includes(new Types.ObjectId(memberId))) {
      project.team.push(new Types.ObjectId(memberId));
      await project.save();
    }

    return transformProject(project);
  }
}
