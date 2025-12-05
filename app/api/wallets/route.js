import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { recalculateAccountBalance } from "@/lib/services/balance.service";

// GET /api/wallets
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const accountId = searchParams.get("accountId") || "";
    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
      ...(accountId && { accountId }),
    };

    const [wallets, total] = await Promise.all([
      prisma.wallet.findMany({
        where,
        skip,
        take: limit,
        include: {
          account: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.wallet.count({ where }),
    ]);

    return NextResponse.json({
      status: "success",
      message: "Wallets retrieved successfully",
      data: {
        wallets,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("GET /api/wallets error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch wallets", data: null },
      { status: 500 }
    );
  }
}

// POST /api/wallets
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { status: "error", message: "Unauthorized", data: null },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, accountId, initialBalance } = body;

    if (!name) {
      return NextResponse.json(
        { status: "error", message: "Name is required", data: null },
        { status: 400 }
      );
    }

    if (!accountId) {
      return NextResponse.json(
        { status: "error", message: "Account is required", data: null },
        { status: 400 }
      );
    }

    // Verify account belongs to user
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

    // Parse initial balance if provided
    const balance = initialBalance 
      ? new Prisma.Decimal(parseFloat(initialBalance)) 
      : new Prisma.Decimal(0);

    const wallet = await prisma.wallet.create({
      data: {
        name,
        accountId,
        userId: session.user.id,
        balance,
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

    // Recalculate account balance
    await recalculateAccountBalance(accountId);

    return NextResponse.json(
      {
        status: "success",
        message: "Wallet created successfully",
        data: wallet,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/wallets error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create wallet", data: null },
      { status: 500 }
    );
  }
}
