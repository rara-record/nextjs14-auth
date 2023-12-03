import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcrypt'
import { NextAuthOptions } from 'next-auth'
import { db } from '@/lib/db'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null
        }

        const existingUser = await db.user.findUnique({
          where: {
            email: credentials?.email,
          },
        })

        if (!existingUser) {
          return null
        }

        const passwordMatch = await compare(
          credentials?.password,
          existingUser.password
        )

        console.log({ passwordMatch }, 'passwordMatch')

        if (!passwordMatch) {
          return null
        }

        return {
          id: `${existingUser.id}`,
          email: existingUser.email,
          username: existingUser.username,
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      console.log({ token, user })

      return {
        ...session,
        user: {
          ...session.user,
          username: token.username,
        },
      }
    },
    async jwt({ token, user }) {
      console.log({ token, user })

      if (user) {
        return {
          ...token,
          username: user.username,
        }
      }

      return token
    },
  },
}
