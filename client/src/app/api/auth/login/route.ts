import axios from "axios";
import { NextResponse } from "next/server";





export async function POST(request: Request) {
    const { email, password } = await request.json();
    
    try {
        const { data } = await axios.post(
            process.env.NEXT_PUBLIC_BASE_API_URL as string,
            {
                query: `
                mutation LoginWithEmail($input: EmailAuthInput!) {
                    loginWithEmail(input: $input) {
                        token
                        user {
                            id
                            email
                            username
                            avatarUrl
                        }
                    }
                }`,
                variables: {
                    input: {
                        email,
                        password
                    }
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        if (!data.data?.loginWithEmail) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const response = NextResponse.json(data.data.loginWithEmail, { status: 200 });

        // Set user data in cookies
        response.cookies.set('user', JSON.stringify(data.data.loginWithEmail), {
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 week
        });

        return response;

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
