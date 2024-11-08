import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const NEXT_AUTH = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                if (!credentials?.email || !credentials.password) {
                    throw new Error('Missing credentials');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('No user found');
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.password || "");


                if (!isValidPassword) {
                    throw new Error('Invalid password');
                }

                return { id: user.id, name: user.name, email: user.email };
            },

            // async authorize(credentials: any, req) {
            //     // validation here for correct credentials
            //     console.log(credentials)

            //     return {
            //         id: "1",
            //         username: 'rajuk',
            //         email: 'raju@gmail.com'
            //     };
            // },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ''
        }),
    ],
    callbacks: {
        async signIn({ account, profile }: any) {
            if (account?.provider === 'google') {
                if (!profile?.email?.endsWith('.christuniversity.in')) {
                    throw new Error('OnlyChristUniversity');
                }
                return true;
            }
            return true;
        },

        async jwt({ token, user, account, profile }: any) {
            if (account?.provider === 'google' && profile) {
                const email = profile.email;
                const name = profile.name;

                if (!email?.endsWith('.christuniversity.in')) {
                    token.error = 'OnlyChristUniversity';
                    return token;
                }

                let existingUser = await prisma.user.findUnique({
                    where: { email },
                    include: { profile: true },
                });

                if (!existingUser) {
                    const newUser = await prisma.user.create({
                        data: {
                            name,
                            email,
                            password: 'google',
                            emailVerified: new Date(),
                            image: profile.picture,
                            hasProfile: false
                        },
                        include: { profile: true },
                    });

                    token.newUser = true;
                    token.sub = newUser.id; // Assign sub to new user's ID
                    token.hasProfile = false;
                    return token; // Early return to prevent overwriting
                } else {
                    token.sub = existingUser.id; // Assign sub to existing user's ID
                    token.hasProfile = !!existingUser.profile;
                    token.newUser = !existingUser.hasProfile;

                    // If user exists but does not have a profile, flag as new user
                    if (!existingUser.profile) {
                        token.newUser = true;
                    }
                }
            } else if (user) {
                // For non-Google sign-ins, find the user by ID and check if they have a profile
                const userWithProfile = await prisma.user.findUnique({
                    where: { id: user.id },
                    include: { profile: true },
                });

                // Update token with user ID and profile status
                token.sub = user.id;
                token.hasProfile = !!userWithProfile?.profile;
            }

            return token;
        },

        async session({ session, token }: any) {
            if (token?.error) {
                session.error = token.error; // Add error to session
            }
            if (token) {
                session.user.id = token.sub;
                session.user.hasProfile = token.hasProfile;
                session.newUser = token.newUser;
            }
            return session;
        }
    },

    pages: {
        signIn: '/login',
        error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        maxAge: 60 * 60 * 24 * 30, // 30 days 
    },
}