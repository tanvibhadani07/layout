import { NextResponse } from "next/server";
import { connectToDatabase } from "@/app/lib/mongodb";
import User from "@/models/User";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =====================================================
// UPDATE USER
// =====================================================

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    await connectToDatabase();

    const { id } = await params;

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
        {
          status: 400,
        }
      );
    }

    // Check duplicate email
    const existingUser = await User.findOne({
      email,
      _id: {
        $ne: id,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another user already uses this email",
        },
        {
          status: 409,
        }
      );
    }

    // Update
    const user =
      await User.findByIdAndUpdate(
        id,
        {
          name,
          email,
          role,
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Member updated successfully",
      user,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// DELETE USER
// =====================================================

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const user =
      await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
      user,
    });
  } catch (error) {
    console.error("DATABASE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete user",
        error: String(error),
      },
      {
        status: 500,
      }
    );
  }
}