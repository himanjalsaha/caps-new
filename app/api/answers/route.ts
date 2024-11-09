import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const doubtPostId = searchParams.get('doubtPostId')

    if (!doubtPostId) {
      return NextResponse.json(
        { error: 'Missing doubtPostId parameter' },
        { status: 400 }
      )
    }

    const answers = await prisma.answer.findMany({
      where: { doubtPostId },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(answers)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { content, doubtPostId, userId } = body

    if (!content || !doubtPostId || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const answer = await prisma.answer.create({
      data: {
        content,
        userId,
        doubtPostId,
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(answer, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing answer ID' }, { status: 400 });
    }

    const body = await request.json();

    if (Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const updateData: any = {};

    if (body.content) updateData.content = body.content;

    if (body.voteType) {
      if (body.voteType === 'upvote') {
        updateData.upvotes = { increment: 1 };
      } else if (body.voteType === 'downvote') {
        updateData.downvotes = { increment: 1 };
      } else {
        return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
      }
    }

    const updatedAnswer = await prisma.answer.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json({ answer: updatedAnswer });

  } catch (error: any) {
    console.error('PUT error:', error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Answer not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Missing answer ID' },
        { status: 400 }
      )
    }

    await prisma.answer.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Answer deleted successfully' },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('DELETE error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Answer not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}