import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, password } = await request.json()

    // Պարտադիր դաշտերի վալիդացիա
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Անունը, email-ը և գաղտնաբառը պարտադիր են' },
        { status: 400 }
      )
    }

    // Գաղտնաբառի վալիդացիա
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Գաղտնաբառը պետք է պարունակի առնվազն 6 նիշ' },
        { status: 400 }
      )
    }

    // Ստուգել, որ գաղտնաբառը դատարկ չէ
    if (password.trim().length === 0) {
      return NextResponse.json(
        { error: 'Գաղտնաբառը չի կարող դատարկ լինել' },
        { status: 400 }
      )
    }

    // Ստուգել, արդյոք օգտատերը գոյություն ունի
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Օգտատեր այս email-ով արդեն գոյություն ունի' },
        { status: 400 }
      )
    }

    // Հեշավորել գաղտնաբառը
    const hashedPassword = await bcrypt.hash(password, 12)

    // Ստեղծել օգտատիրոջ
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'USER'
      }
    })

    // Վերադարձնել օգտատիրոջն առանց գաղտնաբառի
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { message: 'Օգտատերն հաջողությամբ ստեղծվել է', user: userWithoutPassword },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Սերվերի ներքին սխալ' },
      { status: 500 }
    )
  }
}
