import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/accounts - Get all accounts for current user
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
    };

    const [accounts, total] = await Promise.all([
      prisma.account.findMany({
        where,
        skip,
        take: limit,
        include: {
          wallets: {
            where: { deletedAt: null },
            select: {
              id: true,
              name: true,
              balance: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
          _count: {
            select: { wallets: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.account.count({ where }),
    ]);

    // Convert Decimal to number for JSON serialization
    const serializedAccounts = accounts.map(account => ({
      ...account,
      balance: Number(account.balance),
      wallets: account.wallets.map(wallet => ({
        ...wallet,
        balance: Number(wallet.balance),
      })),
    }));

    return NextResponse.json({
      status: "success",
      message: "Accounts retrieved successfully",
      data: {
        accounts: serializedAccounts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("GET /api/accounts error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch accounts", data: null },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Create new account
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
    const { name, currency } = body;

    if (!name || !currency) {
      return NextResponse.json(
        { status: "error", message: "Name and currency are required", data: null },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: {
        name,
        currency,
        userId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        status: "success",
        message: "Account created successfully",
        data: account,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/accounts error:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to create account", data: null },
      { status: 500 }
    );
  }
}
