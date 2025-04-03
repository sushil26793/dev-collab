// src/resolvers/project.resolver.ts
import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';
import { Project } from '../models/project.model'
import { Context } from '../utils/context';
import { ProjectType } from '../typeDefs/project.type';

@Resolver()
export class ProjectResolver {
  @Query(() => [ProjectType])
  async getUserProjects(@Ctx() ctx: Context) {
    if (!ctx.userId) throw new Error('Not authenticated');
    
    return Project.find({
      $or: [
        { owner: ctx.userId },
        { members: ctx.userId }
      ]
    }).populate('owner members tasks');
  }

  @Mutation(() => ProjectType)
  async createProject(
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string,
    @Ctx() ctx: Context
  ) {
    if (!ctx.userId) throw new Error('Not authenticated');
    
    const project = new Project({
      title,
      description,
      owner: ctx.userId,
      members: [ctx.userId]
    });

    await project.save();
    return project.populate('owner members');
  }
}