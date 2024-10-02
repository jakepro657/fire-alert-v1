import { AuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import KakaoProvider from "next-auth/providers/kakao";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "이메일",
          type: "text",
          placeholder: "이메일 주소 입력 요망",
        },
        password: { label: "비밀번호", type: "password" },
      },

      async authorize(credentials, req): Promise<any> {
        return credentials;
      },
    }),
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID as string,
      clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
      // allowDangerousEmailAccountLinking: true
      authorization: {
        params: {
          scope: "profile_nickname profile_image talk_message",
        },
      },
    }),
  ],
  pages: {
    signIn: "/",
    signOut: "/",
    newUser: "/",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async jwt({ token, user, account }) {
      return {
        ...token,
        ...user,
        ...account,
      };
    },
    session: ({ session, token, user, newSession }) => {
      return {
        ...session,
        user: { ...user },
        token: { ...token },
      };
      // session.user = { ...user };
      // return session;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
  },
};

export default authOptions;
