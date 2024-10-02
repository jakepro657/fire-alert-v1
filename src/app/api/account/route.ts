import { getServerSession } from "next-auth";
import authOptions from "../../../../auth/option";
import { NextResponse } from "next/server";

export async function GET() {
  const session: any = await getServerSession(authOptions);

  const response = await fetch(
    `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.KAKAO_REST_API}&redirect_uri=${process.env.KAKAO_REDIRECT_URI}&response_type=code&scope=talk_message`,
    {
      headers: {
        Authorization: `Bearer ${session.token.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  //   const res = await response.json();

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return NextResponse.json({
    message: "KakaoTalk response success",
  });
}
