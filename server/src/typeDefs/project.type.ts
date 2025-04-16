import { ObjectType, Field, ID, registerEnumType } from "type-graphql";

// Enum for project status. Note: GraphQL enums must be valid identifiers,
// so we use camelCase values.
export enum ProjectStatus {
  planning = "planning",
  inProgress = "inProgress",
  onHold = "onHold",
  completed = "completed",
}

registerEnumType(ProjectStatus, {
  name: "ProjectStatus",
  description: "The status of a project.",
});

// Enum for project priority.
export enum ProjectPriority {
  low = "low",
  medium = "medium",
  high = "high",
}

registerEnumType(ProjectPriority, {
  name: "ProjectPriority",
  description: "The priority level of a project.",
});

// Define the Project type using class decorators.
@ObjectType({ description: "The Project model" })
export class ProjectType {
  @Field(type => ID)
  id!: string;

  @Field({ description: "The name of the project" })
  name!: string;

  @Field({ nullable: true, description: "A description of the project" })
  description?: string;

  @Field({ description: "The progress percentage of the project" })
  progress!: number;

  @Field(type => ProjectStatus, { description: "The current status of the project" })
  status!: ProjectStatus;

  @Field(type => ProjectPriority, { description: "The project's priority" })
  priority!: ProjectPriority;

  // The due date is returned as an ISO string from the resolver.
  @Field({ description: "The due date of the project" })
  dueDate!: Date;

  // Here we assume the team is stored as an array of user IDs (strings).
  // Later you can populate this field with full User objects if desired.
  @Field(type => [String], { description: "IDs of team members involved in the project" })
  team!: string[];

  @Field({ description: "Whether the project is starred" })
  starred!: boolean;

  @Field(type => ID, { description: "The ID of the user who created the project" })
    createdBy!: string;
 
  // Optional timestamps
  @Field({ nullable: true, description: "When the project was created" })
  createdAt?: Date;

  @Field({ nullable: true, description: "When the project was last updated" })
  updatedAt?: Date;
}
