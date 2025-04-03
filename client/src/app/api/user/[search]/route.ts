// app/api/user/[search]/route.ts
import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request: Request, { params }: { params: { search: string } }) {
  try {
    const search = (await params).search
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
        variables: { search }
      }
    );
    console.log(response.data)

    return NextResponse.json({ success: true, data: response.data.data.searchUsers });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: 'Search failed', error });
  }
}
