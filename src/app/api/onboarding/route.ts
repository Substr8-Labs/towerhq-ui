/**
 * TowerHQ Onboarding API
 * 
 * Handles the discovery conversation and workspace generation.
 */

import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import {
  generateAllWorkspaceFiles,
  type OnboardingAnswers,
} from '@/lib/workspace/templates';

/**
 * GET /api/onboarding - Check onboarding status
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
        status: 'no_profile',
        onboardingComplete: false,
      });
    }

    const workspace = await db.workspace.findUnique({
      where: { profileId: profile.id },
    });

    return NextResponse.json({
      status: workspace?.onboardingComplete ? 'complete' : 'pending',
      onboardingComplete: workspace?.onboardingComplete ?? false,
      hasWorkspace: !!workspace,
    });

  } catch (error) {
    console.error('[onboarding GET]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/onboarding - Complete onboarding with answers
 */
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const answers: OnboardingAnswers = body.answers;

    // Validate required fields
    if (!answers.founderName || !answers.companyName || !answers.whatBuilding ||
        !answers.targetCustomer || !answers.stage || !answers.biggestBlocker) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create profile
    let profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      profile = await db.profile.create({
        data: {
          userId,
          name: answers.founderName,
          email: `${userId}@towerhq.user`, // Placeholder
        },
      });
    }

    // Generate workspace files
    const files = generateAllWorkspaceFiles(answers);

    // Create workspace with files
    const workspace = await db.workspace.upsert({
      where: { profileId: profile.id },
      create: {
        profileId: profile.id,
        onboardingComplete: true,
        files: {
          create: files.map(f => ({
            path: f.path,
            content: f.content,
          })),
        },
      },
      update: {
        onboardingComplete: true,
        files: {
          deleteMany: {}, // Clear existing files
          create: files.map(f => ({
            path: f.path,
            content: f.content,
          })),
        },
      },
    });

    return NextResponse.json({
      success: true,
      workspaceId: workspace.id,
      filesCreated: files.length,
      message: 'Workspace created! Your C-Suite is ready.',
    });

  } catch (error) {
    console.error('[onboarding POST]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
