// app/api/auth/[...nextauth]/route.ts

import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import GoogleProvider from 'next-auth/providers/google'

 const authOptions: NextAuthOptions = {
    
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

		  const user = await prisma.user.findUnique({
			  where: {
				  email: credentials.email
			  },
			  include: {
				  department: true,
				  campus: true,
				  course: true,
				  semester: true
			  }
		  });

		  if (!user || !user?.email || !user?.password) {
			  throw new Error("Invalid credentials");
		  }

		  const isCorrectPassword = await bcrypt.compare(
			  credentials.password,
			  user.password
		  );

		  if (!isCorrectPassword) {
			  throw new Error("Invalid credentials");
		  }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role || "STUDENT",
          department: user.department?.name,
          campus: user.campus?.name,
          course: user.course?.name,
          semester: user.semester?.name
        };
      }
    }),
      GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
		  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
		  authorization: {
			params: {
				prompt: "consent",
				access_type: "offline",
				response_type: "code"
			}
		  }
      })
  ],
  callbacks: {
      async signIn({ account, profile }) {
      if (account?.provider === "google") {
          const email = profile?.email || '';
            if (!email?.endsWith('.christuniversity.in')) {
              return '/error?error=OnlyChristUniversity';
            }
            return true;
        }
        return true;
      },

    async jwt({ token, user, account, profile }) {
		if (account?.provider === "google" && profile) {
			const email = profile.email;
      const name = profile.name;
      const image = profile.image || '';

      // Check if email is from Christ University
			if (!email?.endsWith('.christuniversity.in')) {
				token.error = 'OnlyChristUniversity';
				return token;
      }

       // Determine role based on email structure
        const isTeacher = !email.split("@")[0].includes(".");
        const role: "TEACHER" | "STUDENT" = isTeacher ? "TEACHER" : "STUDENT";
      
      // Check if user already exists
			let existingUser = await prisma.user.findUnique({
				where: { email }
			});

      // If user does not exist, create a new user
			if (!existingUser) {
				const newUser = await prisma.user.create({
					data: {
						email,
						name,
						image,
            password: 'google',
            role,
						departmentId: null,
						campusId: null,
						courseId: null,
						semesterId: null
					}
				});
      } else if (existingUser) {
        // If user exists, update the user's role
        await prisma.user.update({
          where: { email },
          data: { role }
        });
      }
    }
      if (user) {
            token.id = user.id;
            token.email = user.email;
            token.role = user.role;
            token.name = user.name;
            token.image = user.image;
            token.department = user.department;
            token.campus = user.campus;
            token.course = user.course;
            token.semester = user.semester;
            }
            return token;
        },

        async session({ session, token }:any) {
            if (session.user) {
                session.user.id = token.id as string;
              session.user.email = token.email as string;
              session.user.role = token.role as string;
                session.user.name = token.name as string;
                session.user.image = token.image as string;
                session.user.department = token.department as string;
                session.user.campus = token.campus as string;
                session.user.course = token.course as string;
                session.user.semester = token.semester as string;
                
                if (token?.error) {
                  session.error = token.error; // Add custom error to session
                }
            }
            return session;
        }
    },
    session: {
      maxAge: 60 * 60 * 24 * 30, // 30 days expiry
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login",
      error: '/error' // Redirect to a custom error page
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
