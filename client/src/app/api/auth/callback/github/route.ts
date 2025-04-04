// src/app/api/auth/callback/github/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

interface GitHubEmail {
    id:string;
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: string | null;
    avatar_url: string;
    login:string
  }
  
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
        return NextResponse.json({ error: 'Missing authorization code' }, { status: 400 });
    }

    try {
        // Exchange code for access token
        const { data } = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
            },
            {
                headers: {
                    Accept: 'application/json',
                },
            }
        );

        const { access_token } = data;

        // Get user data from GitHub
        const { data: userData } = await axios.get<GitHubEmail>('https://api.github.com/user', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        let email = userData.email;
        // If email is null, call the /user/emails endpoint
        if (!email) {
            const { data: emails } = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            });
            // Pick the primary email (or the first if none is marked primary)
            const primaryEmail = emails.find((e:GitHubEmail) => e.primary) || emails[0];
            email = primaryEmail?.email;
        }

        // Send user data to your GraphQL API
        const apiResponse = await axios.post(
            process.env.NEXT_PUBLIC_BASE_API_URL as string,
            {
            query: `
          mutation loginWithGitHub($input: GitHubAuthInput!) {
            loginWithGitHub(input: $input) {
              token
              user {
                id
                email
                username,
                avatarUrl,
                githubId,
                createdAt
              }
            }
          }
        `,
                variables: {
                    input: {
                        githubId: String(userData.id),
                        email,
                        username: userData.login,
                        avatarUrl: userData.avatar_url,
                    },
                },
            }
        );
        const user = apiResponse.data.data.loginWithGitHub;


        const userJson = JSON.stringify(user);

        const response = NextResponse.redirect(new URL('/dashboard', request.url));

        response.cookies.set('user', userJson, {
            // httpOnly: true,
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
          });
          
        return response;
    } catch (error) {
        console.error('GitHub OAuth error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
