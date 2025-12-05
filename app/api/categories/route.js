import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized', data: null },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') || '';
    const skip = (page - 1) * limit;

    const where = {
      userId: session.user.id,
      deletedAt: null,
      ...(search && {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      }),
      ...(type && { type }),
    };

    const [categories, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.category.count({ where }),
    ]);

    return NextResponse.json({
      status: 'success',
      message: 'Categories retrieved successfully',
      data: {
        categories,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch categories', data: null },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized', data: null },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, type } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { status: 'error', message: 'Category name is required', data: null },
        { status: 400 }
      );
    }

    if (!type || !['income', 'expense', 'transfer'].includes(type)) {
      return NextResponse.json(
        { status: 'error', message: 'Category type must be either "income" or "expense"', data: null },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        { status: 'error', message: 'Category name is too long (max 100 characters)', data: null },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        userId: session.user.id,
        name: name.trim(),
        type,
      },
    });

    return NextResponse.json(
      {
        status: 'success',
        message: 'Category created successfully',
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/categories error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { status: 'error', message: 'Category with this name already exists', data: null },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: 'Failed to create category', data: null },
      { status: 500 }
    );
  }
}