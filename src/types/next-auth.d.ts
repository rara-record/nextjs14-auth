import NextAuth from 'next-auth'

// https://next-auth.js.org/getting-started/typescript
declare module 'next-auth' {
  interface User {
    username: string
  }
  interface Session {
    user: User & {
      username: string
    }
    token: {
      username: string
    }
  }
}
