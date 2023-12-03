import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const Page = async () => {
  const session = await getServerSession(authOptions)
  console.log(session, 'session')

  return <div>welcome {session?.user.username}</div>
}

export default Page
