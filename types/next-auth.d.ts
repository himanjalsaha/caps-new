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
      role?  :string
    } & DefaultSession["user"]
  }

  interface User {
    department?: string
    campus?: string
    course?: string
    semester?: string
  }
}


export type Post = {
    id: string;
    title: string;
    description: string;
    subject: string;
    tags: string[];
    imgUrl: string[];
    userId: string;
    userName: string;
    userRole: string;
    upvotes: number;
    downvotes: number;
    likes: string[];
    createdAt: string;
    updatedAt: string;
    userVote?: 'upvote' | 'downvote' | null;
    user: {
      name: string | null;
      email: string;
    };
  
  }
  