import NextAuth from "next-auth/next";
import { supabaseAuth } from "@/lib/auth";

const auth = NextAuth(supabaseAuth);

export { auth as GET, auth as POST };
