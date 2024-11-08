import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      email: string
      name: string
      image: string
      department?: string
      campus?: string
      course?: string
      semester?: string
    } & DefaultSession["user"]
  }

  interface User {
    department?: string
    campus?: string
    course?: string
    semester?: string
  }
}