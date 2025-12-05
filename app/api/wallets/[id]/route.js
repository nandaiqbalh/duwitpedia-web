import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/wallets/[id]
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const wallet = await prisma.wallet.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!wallet) {
      return NextResponse.json(
        { status: "error", message: "Wallet not found", data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: "success",
      message: "Wallet retrieved successfully",
      data: wallet,
    });
  } catch (error) {
    console.error("GET /api/wallets/[id] error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch wallet", data: null },
      { status: 500 }
    );
  }
}

// PUT /api/wallets/[id]
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
    const { name, accountId } = body;

    const existingWallet = await prisma.wallet.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingWallet) {
      return NextResponse.json(
        { status: "error", message: "Wallet not found", data: null },
        { status: 404 }
      );
    }

    // If accountId is being updated, verify it belongs to user
    if (accountId && accountId !== existingWallet.accountId) {
      const account = await prisma.account.findFirst({
        where: {
          id: accountId,
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
    }

    const wallet = await prisma.wallet.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(accountId && { accountId }),
        updatedAt: new Date(),
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Wallet updated successfully",
      data: wallet,
    });
  } catch (error) {
    console.error("PUT /api/wallets/[id] error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to update wallet", data: null },
      { status: 500 }
    );
  }
}

// DELETE /api/wallets/[id]
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const existingWallet = await prisma.wallet.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingWallet) {
      return NextResponse.json(
        { status: "error", message: "Wallet not found", data: null },
        { status: 404 }
      );
    }

    await prisma.wallet.update({
      where: { id: params.id },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json({
      status: "success",
      message: "Wallet deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("DELETE /api/wallets/[id] error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete wallet", data: null },
      { status: 500 }
    );
  }
}
