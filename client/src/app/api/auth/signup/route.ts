import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request) {
    const { email, username, password } = await request.json();
    try {
        const response = await axios.post(
            process.env.NEXT_PUBLIC_BASE_API_URL as string,
            {
                query: `
                mutation SignupWithEmail($input: EmailAuthInput!) {
                    signupWithEmail(input: $input) {
                        token
                        user {
                            username            
                            email
                        }
                    }
                }`,
                variables: {
                    input: {
                        email,
                        username,
                        password
                    }
                }
            }
        );
        if (response.data.errors.length > 0) {
            return NextResponse.json({ success: false, message: 'Signup failed', errors: response.data.errors });
        }
        const data = response.data.data.signupWithEmail;
        return NextResponse.json({ success: true, message: 'Signup successful', data });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'An error occurred while processing your request.' });
    }

}
