import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/accounts/[id] - Get single account
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const account = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!account) {
      return NextResponse.json(
        { status: "error", message: "Account not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Account retrieved successfully",
      data: account,
    });
  } catch (error) {
    console.error("GET /api/accounts/[id] error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch account", data: null },
      { status: 500 }
    );
  }
}

// PUT /api/accounts/[id] - Update account
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, currency } = body;

    // Check if account exists and belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingAccount) {
      return NextResponse.json(
        { status: "error", message: "Account not found", data: null },
        { status: 404 }
      );
    }

    const account = await prisma.account.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(currency && { currency }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Account updated successfully",
      data: account,
    });
  } catch (error) {
    console.error("PUT /api/accounts/[id] error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update account", data: null },
      { status: 500 }
    );
  }
}

// DELETE /api/accounts/[id] - Soft delete account
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    // Check if account exists and belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingAccount) {
      return NextResponse.json(
        { status: "error", message: "Account not found", data: null },
        { status: 404 }
      );
    }

    // Soft delete
    await prisma.account.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Account deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("DELETE /api/accounts/[id] error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete account", data: null },
      { status: 500 }
    );
  }
}
