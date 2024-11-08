import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        email: string;
        password?: string;
    }
}