import { NextResponse } from "next/server";
import axios from "axios";
import { cookies } from "next/headers";


export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { name, description } = body;

        const cookieStore = await cookies();
        const authCookie = cookieStore.get('user')?.value;

        if (!authCookie) {
            return NextResponse.json({ message: 'Unauthorized - No valid token found' }, { status: 401 });
        }

        const user = JSON.parse(authCookie);
        const authToken = user.token;

        const { data } = await axios.post(
            process.env.NEXT_PUBLIC_BASE_API_URL as string,
            {
                query: `
                mutation CreateTeam($input: CreateTeamInput!) {
                    createTeam(input: $input) {
                        id
                    }
                }
                `,
                variables: {
                    input: {
                        name,
                        description
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );

        return NextResponse.json({ message: 'Team created successfully', data: data.data.createTeam });

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data);
            return NextResponse.json({
                message: 'Error creating team',
                error: error.response?.data
            }, { status: 500 });
        } else {
            console.error('Unexpected error:', error);
            return NextResponse.json({
                message: 'An unexpected error occurred',
                error: String(error)
            }, { status: 500 });
        }
    }
}



export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        // Token from cookies
        const cookieStore = await cookies();
        const authCookie = cookieStore.get("user")?.value;

        if (!authCookie) {
            return NextResponse.json({ message: "Unauthorized - No valid token found" }, { status: 401 });
        }

        const user = JSON.parse(authCookie);
        const authToken = user.token;

        let query = "";
        let variables = {};

        if (id) {
            // Fetch a single team
            query = `
                query GetTeam($id: ID!) {
                    getTeam(id: $id) {
                        id
                        name
                        description
                        owner {
                            id
                            username
                        }
                        members {
                            user {
                                id
                                username
                            }
                            role
                        }
                        createdAt
                        updatedAt
                    }
                }
            `;
            variables = { id };
        } else {
            // Fetch all teams
            query = `
                query GetTeams {
                    teams {
                        id
                        name
                        description
                        owner {
                            id
                            username
                        }
                        members {
                            user {
                                id
                                username
                            }
                            role
                        }
                        createdAt
                        updatedAt
                    }
                }
            `;
        }

        const { data } = await axios.post(
            process.env.NEXT_PUBLIC_BASE_API_URL as string,
            { query, variables },
            {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }
        );
        console.log("data", data)
        return NextResponse.json({ data: id ? data.data.getTeam : data.data.teams });

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.response?.data);
            return NextResponse.json({
                message: "Error fetching team(s)",
                error: error.response?.data
            }, { status: 500 });
        } else {
            console.error('Unexpected error:', error);
            return NextResponse.json({
                message: "An unexpected error occurred",
                error: String(error)
            }, { status: 500 });
        }
    }
}




