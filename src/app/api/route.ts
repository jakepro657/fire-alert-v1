// app/api/data/route.js
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import authOptions from "../../../auth/option";

export async function POST(request: Request) {
  const { gas_level, latitude, longitude, userId } = await request.json();

  console.log(
    `Received data: Gas Level: ${gas_level}, Lat: ${latitude}, Long: ${longitude}`
  );

  if (gas_level > 2000) {
    const session: any = await getServerSession(authOptions);

    console.log("session:", session.token.access_token);

    // 119 소방청 카카오톡 채널로 메시지 전송
    const response = await fetch(
      "https://kapi.kakao.com/v2/api/talk/memo/default/send",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.token.access_token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          template_object: JSON.stringify({
            object_type: "text",
            text:
              "긴급 SOS 신고\n신고자 ID: " +
              session.token.id +
              `\n본 카카오톡 유저가 긴급 상황입니다. 즉시 119 호출 부탁드립니다.\n
                가스 농도: ${gas_level}\n
                위도: ${latitude}\n
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

    const res = await response.json();

    console.log("KakaoTalk response:", res);

    if (!response.ok) {
      throw new Error("119 소방청 카카오톡 채널 메시지 전송 실패");
    }

    return NextResponse.json({
      message: "119 소방청에 SOS 신고가 성공적으로 접수되었습니다.",
    });
  }
  return NextResponse.json({
    message: "Data received successfully",
  });
}
