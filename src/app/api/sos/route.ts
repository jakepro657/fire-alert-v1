import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import authOptions from "../../../../auth/option";

export async function POST(request: NextRequest) {
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
            "본 카카오톡 유저가 긴급 상황입니다. 즉시 119 호출 부탁드립니다.",
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
