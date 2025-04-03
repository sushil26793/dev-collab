import { Field, ID, ObjectType } from "type-graphql";



@ObjectType()
export class NotificationMetadata {
    @Field({ nullable: true })
    invitationId?: string;

    @Field({ nullable: true })
    teamId?: string;

    @Field({ nullable: true })
    inviterId?: string;
}

@ObjectType()
export class notificationType {
    @Field(() => ID)
    id!: string


    @Field()
    type!: 'invitation' | 'alert' | 'system'

    @Field()
    content!: string

    @Field()
    status!: 'read' | 'unread'

    @Field()
    createdAt!: Date

    @Field(() => ID)
    recepientId!: string

    @Field(() => NotificationMetadata, { nullable: true })
    metadata?: NotificationMetadata

}