import { NextResponse } from 'next/server';
import { executeResearchPipeline } from '@/lib/research/pipeline';
import { RATE_LIMITS } from '@/config/rate-limits';
import type { OnboardingState } from '@/types/onboarding';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      productName,
      brand,
      userPastedIngredients,
      userPastedReviews,
      userProfile,
    }: {
      productName?: string;
      brand?: string;
      userPastedIngredients?: string;
      userPastedReviews?: string;
      userProfile?: OnboardingState;
    } = body;

    if (!productName || !productName.trim()) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    if (!userProfile) {
      return NextResponse.json({ error: 'User profile context is required' }, { status: 400 });
    }

    // Execute the two-stage research pipeline
    const result = await executeResearchPipeline({
      productName: productName.trim(),
      brand: brand?.trim(),
      userPastedIngredients,
      userPastedReviews,
      userProfile,
    });

    return NextResponse.json({
      success: true,
      data: result,
      limits: {
        perUserDailyLimit: RATE_LIMITS.perUserDailyResearch,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Research pipeline error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
