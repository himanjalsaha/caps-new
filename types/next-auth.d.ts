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
    error?: string
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
    answers: Answer[];
    userVote?: 'upvote' | 'downvote' | null;
    user: {
      name: string | null;
      email: string;
    };
  
  }
  

export  type Answer = {
    id: string;
    content: string;
    userId: string;
    doubtPostId: string;
    upvotes: number;
    downvotes: number;
    createdAt: string;
    updatedAt: string;
    user: {
      name: string | null;
      email: string;
    };
  }