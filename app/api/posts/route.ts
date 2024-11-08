import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');

  if (action === 'create') {
    try {
      const { title, description, tags, imgUrl, userId, userName, userRole } =
        await req.json();

      const newDoubtPost = await prisma.doubtPost.create({
        data: {
          title,
          description,
          tags,
          imgUrl,
          userId,
          userName,
          userRole,
          likes: [],
        },
        include: {
          user: {
            include: {
              profile: {
                select: {
                  department: true,
                  course: true,
                },
              },
            },
          },
          answers: true,
        },
      });

      const responsePost = {
        ...newDoubtPost,
        department: newDoubtPost.user.profile?.department || "Unknown",
        course: newDoubtPost.user.profile?.course || "Unknown",
      };

      return NextResponse.json(responsePost, { status: 201 });
    } catch (error) {
      console.error('Error creating post:', error);
      return NextResponse.json(
        { error: "Failed to create post", details: error },
        { status: 500 }
      );
    }
  } else if (action === 'answer') {
    try {
      const { doubtPostId, userId, content } = await req.json();

      const newAnswer = await prisma.answer.create({
        data: {
          content,
          userId,
          doubtPostId,
        },
        include: {
          user: true,
          doubtPost: {
            include: {
              user: {
                include: {
                  profile: {
                    select: {
                      department: true,
                      course: true,
                    },
                  },
                },
              },
              answers: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      const responsePost = {
        ...newAnswer.doubtPost,
        department: newAnswer.doubtPost.user.profile?.department || "Unknown",
        course: newAnswer.doubtPost.user.profile?.course || "Unknown",
        answers: newAnswer.doubtPost.answers,
      };

      return NextResponse.json(responsePost, { status: 200 });
    } catch (error) {
      console.error('Error adding answer:', error);
      return NextResponse.json(
        { error: "Failed to add answer", details: error },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }
}

export async function GET() {
  try {
    const doubtPosts = await prisma.doubtPost.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                department: true,
                course: true,
              },
            },
          },
        },
        answers: {
          include: {
            user: true,
          },
        },
      },
    });

    const doubtPostsWithProfile = doubtPosts.map((post) => ({
      ...post,
      department: post.user.profile?.department || "Unknown",
      course: post.user.profile?.course || "Unknown",
    }));

    return NextResponse.json(doubtPostsWithProfile, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch posts", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    // Delete associated answers first
    await prisma.answer.deleteMany({
      where: { doubtPostId: id },
    });

    const deletedDoubtPost = await prisma.doubtPost.delete({
      where: { id },
    });

    return NextResponse.json(deletedDoubtPost, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete post", details: error },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const { id, title, description, tags, imgUrl, upvotes, downvotes } =
      await req.json();

    const updatedDoubtPost = await prisma.doubtPost.update({
      where: { id },
      data: {
        title,
        description,
        tags,
        imgUrl,
        upvotes,
        downvotes,
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                department: true,
                course: true,
              },
            },
          },
        },
        answers: {
          include: {
            user: true,
          },
        },
      },
    });

    const responsePost = {
      ...updatedDoubtPost,
      department: updatedDoubtPost.user.profile?.department || "Unknown",
      course: updatedDoubtPost.user.profile?.course || "Unknown",
    };

    return NextResponse.json(responsePost, { status: 200 });
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: "Failed to update post", details: error.message || error },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, userId, action } = await req.json();

    const post = await prisma.doubtPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    let updatedLikes = [...post.likes];
    let updatedUpvotes = post.upvotes;
    let updatedDownvotes = post.downvotes;

    if (action === 'like') {
      if (!updatedLikes.includes(userId)) {
        updatedLikes.push(userId);
        updatedUpvotes += 1;
      }
    } else if (action === 'unlike') {
      updatedLikes = updatedLikes.filter(id => id !== userId);
      updatedUpvotes = Math.max(0, updatedUpvotes - 1);
    } else if (action === 'dislike') {
      updatedDownvotes += 1;
    } else if (action === 'undislike') {
      updatedDownvotes = Math.max(0, updatedDownvotes - 1);
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updatedPost = await prisma.doubtPost.update({
      where: { id },
      data: {
        likes: updatedLikes,
        upvotes: updatedUpvotes,
        downvotes: updatedDownvotes,
      },
      include: {
        user: {
          include: {
            profile: {
              select: {
                department: true,
                course: true,
              },
            },
          },
        },
        answers: {
          include: {
            user: true,
          },
        },
      },
    });

    const responsePost = {
      ...updatedPost,
      department: updatedPost.user?.profile?.department || "Unknown",
      course: updatedPost.user?.profile?.course || "Unknown",
    };

    return NextResponse.json(responsePost, { status: 200 });
  } catch (error: any) {
    console.error('Error updating likes/dislikes:', error);
    return NextResponse.json(
      { error: "Failed to update likes/dislikes", details: error.message || error },
      { status: 500 }
    );
  }
}