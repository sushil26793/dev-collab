import axios from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"



export async function GET() {
    return NextResponse.json({ success: true })
}


export async function POST(req: Request) {
    try {
        const { payload } = await req.json()
        const cookieStore = await cookies()
        const authCookies = cookieStore.get("user")?.value;
        if (!authCookies) {
            return NextResponse.json({ message: "Unauthorized - no valid token found" }, { status: 401 })
        }

        const user = JSON.parse(authCookies);
        const authToken = user.token;

        const mutation = `
            mutation AcceptInvitation($invitationId:String!,$notificationId:String!){
             acceptInvitation(invitationId:$invitationId,notificationId:$notificationId){
             id
             }
            }`
        const variables = {
            invitationId: payload.invitationId,
            notificationId: payload.notificationId
        }

        const response = await axios.post(process.env.NEXT_PUBLIC_BASE_API_URL as string, {
            query: mutation,
            variables
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`
            }
        })
        console.log(response.data)

        return NextResponse.json({ payload })
    } catch (error) {
        return NextResponse.json({ success: false, error: 'An error occurred while processing your request.', errorTrace: error });
    }
}


