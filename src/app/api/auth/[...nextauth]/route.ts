import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

console.log("Auth Route Handler loaded. Secret length:", process.env.NEXTAUTH_SECRET?.length);
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
