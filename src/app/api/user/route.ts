import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hash } from 'bcrypt'

export const POST = async (request: Request) => {
  try {
    const body = await request.json()
    const { email, username, password } = body

    // check if email already exists
    const existingUser = await db.user.findUnique({
      where: { email, username },
    })

    if (existingUser) {
      return NextResponse.json({ user: null, message: '이미 가입한 유저입니다.', status: 409 })
    }

    // 비밀번호 해싱
    const hashedPassword = await hash(password, 10)

    // 데이터베이스에 사용자 생성
    const newUser = await db.user.create({
      data: { email, username, password: hashedPassword },
    })

    const { password: newUserPassword, ...rest } = newUser

    return NextResponse.json({ user: rest, message: '회원가입에 성공했습니다.', status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e.message, status: 500 })
  }
}
