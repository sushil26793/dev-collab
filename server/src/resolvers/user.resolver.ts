import { Arg, Query } from "type-graphql";
import { UserType } from "../typeDefs/user.type";
import { User } from "../models/user.model";



export class UserResolver {
    @Query(() => [UserType])
    async searchUsers(
        @Arg('search') search: string
    ) {
        const users = await User.find({
            $or: [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }).limit(10).lean()

        return users.map(user => ({
            ...user,
            id: user._id.toString() // Map _id to id
        }));
    }
    
}
