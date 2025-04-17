import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { name, description, dueDate, priority } = body;

        const cookieStore = await cookies();
        const authCookie = cookieStore.get('user')?.value;
        if (!authCookie) {
            return NextResponse.json({ message: 'Unauthorized - No valid token found' }, { status: 401 });
        }

        const user = JSON.parse(authCookie);
        const authToken = user.token;
        const createdBy = user.user.id;

        // Updated mutation query: passing individual arguments
        const { data } = await axios.post(
            process.env.NEXT_PUBLIC_BASE_API_URL as string,
            {
                query: `
          mutation CreateProject(
            $name: String!, 
            $description: String, 
            $dueDate: String!, 
            $priority: ProjectPriority!, 
            $team: [String!],
            $starred: Boolean,
            $createdBy: String!
          ) {
            createProject(
              name: $name,
              description: $description,
              dueDate: $dueDate,
              priority: $priority,
              team: $team,
              starred: $starred,
              createdBy: $createdBy
            ) {
              name
              description
              dueDate
              createdBy
            }
          }
        `,
                variables: {
                    name,
                    description,
                    dueDate,
                    priority,
                    team: [],
                    createdBy,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );

        return NextResponse.json({ message: 'Project created successfully', data });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data);
            return NextResponse.json(
                {
                    message: 'Error creating project',
                    error: error.response?.data,
                },
                { status: 500 }
            );
        } else {
            console.error('Unexpected error:', error);
            return NextResponse.json(
                {
                    message: 'An unexpected error occurred',
                    error: String(error),
                },
                { status: 500 }
            );
        }
    }
}


export async function GET(): Promise<NextResponse> {
    try {
        // Retrieve the authentication cookie
        const cookieStore = await cookies();
        const authCookie = cookieStore.get("user")?.value;

        if (!authCookie) {
            return NextResponse.json(
                { message: "Unauthorized - No valid token found" },
                { status: 401 }
            );
        }

        const user = JSON.parse(authCookie);
        const authToken = user.token;

        // GraphQL query to fetch projects for the user
        // This query uses the `projects` query from your ProjectResolver.
        const query = `
        query {
          projects {
            id
            name
            description
            dueDate
            status
            priority
            team 
            createdBy
          }
        }
      `;

        const { data } = await axios.post(
            process.env.NEXT_PUBLIC_BASE_API_URL as string,
            { query },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        return NextResponse.json({ data: data.data.projects });
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Axios error:", error.response?.data);
            return NextResponse.json(
                {
                    message: "Error fetching projects",
                    error: error.response?.data,
                },
                { status: 500 }
            );
        }
        console.error("Unexpected error:", error);
        return NextResponse.json(
            {
                message: "An unexpected error occurred",
                error: String(error),
            },
            { status: 500 }
        );
    }
}
