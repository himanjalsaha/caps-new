import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log('body-------', body);
        const { email, password, department, semester, campus, course } = body;

        // Validate all required fields
        if (!email || !password || !department || !semester || !campus || !course) {
            return NextResponse.json(
                { message: "All fields are required" }, 
                { status: 400 }
            );
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists, please login" }, 
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Ensure all related entities exist
        const [userDepartment, userSemester, userCampus, userCourse] = await Promise.all([
            prisma.department.upsert({
                where: { name: department },
                update: {},
                create: { name: department }
            }),
            prisma.semester.upsert({
                where: { name: semester },
                update: {},
                create: { name: semester }
            }),
            prisma.campus.upsert({
                where: { name: campus },
                update: {},
                create: { name: campus }
            }),
            prisma.course.upsert({
                where: { name: course },
                update: {},
                create: { name: course }
            })
        ]);

        // Create the user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                departmentId: userDepartment.id,
                semesterId: userSemester.id,
                campusId: userCampus.id,
                courseId: userCourse.id
            }
        });
        
        const response = { 
            message: 'User created successfully',
            user: {
                id: user.id,
                email: user.email,
            }
        };

        return NextResponse.json(response, { status: 201 });
    } catch (error: any) {
        console.error("REGISTRATION_ERROR", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
