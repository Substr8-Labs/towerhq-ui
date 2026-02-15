/**
 * TowerHQ Workspace API
 * 
 * View and manage workspace files.
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';

/**
 * GET /api/workspace - Get all workspace files
 */
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ 
        files: [],
        onboardingComplete: false,
      });
    }

    const workspace = await db.workspace.findUnique({
      where: { profileId: profile.id },
      include: { 
        files: {
          orderBy: { path: 'asc' },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json({ 
        files: [],
        onboardingComplete: false,
      });
    }

    return NextResponse.json({
      workspaceId: workspace.id,
      onboardingComplete: workspace.onboardingComplete,
      files: workspace.files.map(f => ({
        id: f.id,
        path: f.path,
        content: f.content,
        updatedAt: f.updatedAt,
      })),
    });

  } catch (error) {
    console.error('[workspace GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/workspace - Update a workspace file
 */
export async function PATCH(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { path, content } = await req.json();

    if (!path || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Missing path or content' },
        { status: 400 }
      );
    }

    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const workspace = await db.workspace.findUnique({
      where: { profileId: profile.id },
    });

    if (!workspace) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    // Update or create the file
    const file = await db.workspaceFile.upsert({
      where: {
        workspaceId_path: {
          workspaceId: workspace.id,
          path,
        },
      },
      create: {
        workspaceId: workspace.id,
        path,
        content,
      },
      update: {
        content,
      },
    });

    return NextResponse.json({
      success: true,
      file: {
        id: file.id,
        path: file.path,
        updatedAt: file.updatedAt,
      },
    });

  } catch (error) {
    console.error('[workspace PATCH]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
