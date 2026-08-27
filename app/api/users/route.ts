import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectToDatabase();

    const users = await User.find().sort({ createdAt: -1 }).lean();

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: String(error),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const role = body.role || "Developer";
    const status = body.status || "active";

    // Validation
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message: "Name and email are required",
        },
        { status: 400 }
      );
    }

    // Check duplicate email
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "A user with this email already exists",
        },
        { status: 409 }
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      role,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
        error: String(error),
      },
      { status: 500 }
    );
  }
}