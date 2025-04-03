// src/resolvers/task.resolver.ts
import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import { Task } from "../models/task.model";
import { Project } from "../models/project.model";
import { Context } from '../utils/context';
import { Topic } from '../utils/pubsub';
import { TaskType } from '../typeDefs/task.type';



@Resolver()
export class TaskResolver {
  @Mutation(() => TaskType)
  async createTask(
    @Arg('projectId') projectId: string,
    @Arg('title') title: string,
    @Arg('description', { nullable: true }) description: string,
    @Ctx() ctx: Context,
  ): Promise<InstanceType<typeof Task>> {
    if (!ctx.userId) throw new Error('Not authenticated');

    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');

    const task = new Task({
      title,
      description,
      status: 'TODO',
      project: projectId
    });

    await task.save();
    project.tasks.push(task._id);
    await project.save();

    if (ctx.pubsub) {
      await ctx.pubsub.publish(Topic.TaskUpdated, task);
    }
    return task.populate('assignedTo');
  }

  @Mutation(() => TaskType)
  async updateTaskStatus(
    @Arg('taskId') taskId: string,
    @Arg('status') status: string,
    @Ctx() ctx: Context
  ): Promise<InstanceType<typeof Task>> {
    const task = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true }
    ).populate('assignedTo');

    if (!task) throw new Error('Task not found');

    if (ctx.pubsub) {
      await ctx.pubsub.publish(Topic.TaskUpdated, task);
    } return task;
  }
}