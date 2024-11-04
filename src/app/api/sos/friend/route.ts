import { getServerSession } from "next-auth";
import authOptions from "../../../../../auth/option";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { gas_level, latitude, longitude, receiver_uuids } =
    await request.json();

  const session: any = await getServerSession(authOptions);

  console.log("session:", session.token.access_token);
  if (gas_level > 5800) {
    const response = await fetch(
      `https://kapi.kakao.com/v1/api/talk/friends/message/default/send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token.access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          receiver_uuids: JSON.stringify(receiver_uuids),
          template_object: JSON.stringify({
            object_type: "text",
            text: `
              긴급 SOS 신고: 해당 유저가 긴급 상황입니다. 즉시 119 호출 부탁드립니다.
              
              가스 농도 ${gas_level} ppm
              위도: ${latitude}
              경도: ${longitude}
            `,
            link: {
              web_url: "https://www.119.go.kr",
              mobile_web_url: "https://www.119.go.kr",
            },
            button_title: "119 소방청",
          }),
        }),
      }
    );

    console.log("response:", response);

    return NextResponse.json({ status: "success" });
  }

  return NextResponse.json({ status: "failed" });
}
