import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, subject, tags, imgUrl, userId } = body

    if (!title || !description || !userId || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const post = await prisma.doubtPost.create({
      data: {
        title,
        description,
        subject,
        tags: tags || [],
        imgUrl: imgUrl || [],
        userId,
        userName: user.name || user.email?.split('@')[0] || 'User',
        userRole: 'Student',
      },
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    console.error('POST error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const post = await prisma.doubtPost.findUnique({
        where: { id },
        include: { user: { select: { name: true, email: true } } }
      })

      if (!post) {
        return NextResponse.json(
          { error: 'Post not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({ post })
    } else {
      const posts = await prisma.doubtPost.findMany({
        include: { user: { select: { name: true, email: true } } },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ posts })
    }
  } catch (error) {
    console.error('GET error:', error)
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
        return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
      }
  
      const body = await request.json();
  
      // Validate that at least one field is provided
      if (Object.keys(body).length === 0) {
        return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
      }
  
      // Dynamically prepare the update data from the provided body
      const updateData: any = {};
  
      // Add any provided field to updateData
      if (body.title) updateData.title = body.title;
      if (body.description) updateData.description = body.description;
      if (body.subject) updateData.subject = body.subject;
      if (body.tags) updateData.tags = body.tags;
      if (body.imgUrl) updateData.imgUrl = body.imgUrl;
  
      // Handle upvotes and downvotes
      if (body.voteType) {
        if (body.voteType === 'upvote') {
          updateData.upvotes = { increment: 1 }; // Increment upvotes
        } else if (body.voteType === 'downvote') {
          updateData.downvotes = { increment: 1 }; // Increment downvotes
        } else {
          return NextResponse.json({ error: 'Invalid vote type' }, { status: 400 });
        }
      }
  
      // Update the post
      const updatedPost = await prisma.doubtPost.update({
        where: { id },
        data: updateData,
      });
  
      return NextResponse.json({ post: updatedPost });
  
    } catch (error:any) {
      console.error('PUT error:', error);
  
      if (error.code === 'P2025') {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
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
        { error: 'Missing post ID' },
        { status: 400 }
      )
    }

    await prisma.doubtPost.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Post deleted successfully' },
      { status: 200 }
    )
  } catch (error:any) {
    console.error('DELETE error:', error)
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}