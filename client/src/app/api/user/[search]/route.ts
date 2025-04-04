import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ search: string }> }
) {
  try {
    // Await params to satisfy the type constraint
    const resolvedParams = await params;
    const { search } = resolvedParams;
    const response = await axios.post(
      process.env.NEXT_PUBLIC_BASE_API_URL as string,
      {
        query: `
          query SearchUsers($search: String!) {
            searchUsers(search: $search) {
              id
              username    
              email
            }
          }`,
        variables: { search },
      }
    );
    console.log(response.data);

    return NextResponse.json({
      success: true,
      data: response.data.data.searchUsers,
    });
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({
      success: false,
      message: 'Search failed',
      error: errorMessage,
    });
  }
}
