import NextAuth from "next-auth/next";
import GoogleProvider from 'next-auth/providers/google';
import 'dotenv/config'

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: "587252523602-lhmmj0hhc4hffss50buuh7j7s1891g06.apps.googleusercontent.com",
            clientSecret: "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",
        }),
    ],
    secret: "8bb7c8d585451be0fb1862598ab53a04",
};

export default NextAuth(authOptions);