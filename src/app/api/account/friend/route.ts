import { getServerSession } from "next-auth";
import authOptions from "../../../../../auth/option";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { offset, limit } = await req.json();

  const session: any = await getServerSession(authOptions);

  console.log("session:", session.token.access_token);

  const response = await fetch(
    `https://kapi.kakao.com/v1/api/talk/friends?offset=${offset}&limit=${limit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session.token.access_token}`,
      },
    }
  );

  const res = await response.json();

  return NextResponse.json(res);
}
