import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Import trực tiếp từ file cấu hình dùng chung vừa tạo

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };