import express, { Application } from 'express';
import dotenv from "dotenv";
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import cors from "cors";
import { json } from "body-parser";
import 'reflect-metadata'; // Ensure this is imported before buildSchema

import { connectDB } from './config/db';
import { AuthResolver } from './resolvers/auth.resolver';
import { ProjectResolver } from './resolvers/project.resolver';
import { createServer } from 'http';
import { Server as socketServer } from 'socket.io';
import { setupChatSocket } from './sockets/chat.socket';
import { socketAuthMiddleware } from './middlewares/auth';
import { TeamResolver } from './resolvers/team.resolver';
import { createContext } from './utils/context';
import { setupNotificationSocket } from './sockets/notification.socket';
import { InvitationResolver } from './resolvers/invitation.resolver';
import { UserResolver } from './resolvers/user.resolver';
import { NotificationResolver } from './resolvers/notification.resolver';
dotenv.config();

async function startServer() {
    const app: Application = express();
    const httpServer = createServer(app);
    await connectDB();

    const schema = await buildSchema({
        resolvers: [AuthResolver, ProjectResolver,TeamResolver,InvitationResolver,UserResolver,NotificationResolver,ProjectResolver], // Register class-based resolvers
        validate: false, // Optional: Disable automatic validation for inputs
        emitSchemaFile: true, // Helps in debugging schema generation issues
        
    });


    app.use(cors());    
    app.use(json());

    const server = new ApolloServer({
        schema,
        context: createContext,
        cache:"bounded"
    });

    await server.start();
    server.applyMiddleware({ app: app as any });

    const io = new socketServer(httpServer, {
        cors: {
            origin:process.env.CLIENT_URL,
            methods: ['GET', 'POST']
        }
    })

    io.use(socketAuthMiddleware);
    // Setup the chat socket
    setupChatSocket(io);
    setupNotificationSocket(io);


    const PORT = process.env.PORT || 8080;
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`WebSocket server ready at ws://localhost:${PORT}`);
    });

    return app;
}

// Start the server
startServer().catch((err) => console.error("❌ Server startup error:", err));
