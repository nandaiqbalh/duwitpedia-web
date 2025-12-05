import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized', data: null },
        { status: 401 }
      );
    }

    const category = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!category) {
      return NextResponse.json(
        { status: 'error', message: 'Category not found', data: null },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    console.error('GET /api/categories/[id] error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to fetch category', data: null },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
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

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { status: 'error', message: 'Category not found', data: null },
        { status: 404 }
      );
    }

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

    const category = await prisma.category.update({
      where: { id: params.id },
      data: {
        name: name.trim(),
        type,
      },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { status: 'error', message: 'Category with this name already exists', data: null },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { status: 'error', message: 'Failed to update category', data: null },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { status: 'error', message: 'Unauthorized', data: null },
        { status: 401 }
      );
    }

    // Check if category exists and belongs to user
    const existingCategory = await prisma.category.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { status: 'error', message: 'Category not found', data: null },
        { status: 404 }
      );
    }

    // Check if category is being used in transactions
    const transactionCount = await prisma.transaction.count({
      where: {
        categoryId: params.id,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (transactionCount > 0) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Cannot delete category that is being used in transactions',
          data: null
        },
        { status: 409 }
      );
    }

    // Soft delete the category
    await prisma.category.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({
      status: 'success',
      message: 'Category deleted successfully',
      data: null,
    });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Failed to delete category', data: null },
      { status: 500 }
    );
  }
}