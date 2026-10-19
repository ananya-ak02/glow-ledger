import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { OnboardingState } from '@/types/onboarding';

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Fetch profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // 2. Fetch skin concerns
    const { data: concerns } = await supabase
      .from('skin_concerns')
      .select('*')
      .eq('profile_id', user.id);

    // 3. Fetch routines & steps
    const { data: routines } = await supabase
      .from('routines')
      .select('id, routine_type, is_active, routine_steps(*)')
      .eq('profile_id', user.id);

    // 4. Fetch reactions
    const { data: reactions } = await supabase
      .from('user_reactions')
      .select('*')
      .eq('profile_id', user.id);

    return NextResponse.json({
      profile,
      concerns,
      routines,
      reactions,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: OnboardingState = await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If user is authenticated via Supabase Auth, persist to Postgres
    if (user) {
      // 1. Upsert profile
      await supabase.from('profiles').upsert({
        id: user.id,
        skin_type: body.skin_type,
        skin_type_notes: body.skin_type_notes,
        age_range: body.age_range,
        climate: body.climate,
        budget: body.budget,
        is_pregnant: body.is_pregnant,
        known_allergies: body.known_allergies,
        fragrance_preference: body.fragrance_preference,
        onboarding_completed: true,
      });

      // 2. Sync concerns
      if (body.concerns?.length > 0) {
        await supabase.from('skin_concerns').delete().eq('profile_id', user.id);
        const concernsToInsert = body.concerns.map((c) => ({
          profile_id: user.id,
          concern_type: c.type,
          severity: c.severity,
          affected_areas: c.affected_areas,
        }));
        await supabase.from('skin_concerns').insert(concernsToInsert);
      }

      // 3. Sync AM Routine
      const { data: amRoutine } = await supabase
        .from('routines')
        .upsert(
          { profile_id: user.id, routine_type: 'am', is_active: true },
          { onConflict: 'profile_id, routine_type' }
        )
        .select('id')
        .single();

      if (amRoutine && body.am_routine?.length > 0) {
        await supabase.from('routine_steps').delete().eq('routine_id', amRoutine.id);
        const amSteps = body.am_routine.map((step, idx) => ({
          routine_id: amRoutine.id,
          step_order: idx + 1,
          product_name: step.product_name,
          category: step.category,
          frequency: step.frequency,
        }));
        await supabase.from('routine_steps').insert(amSteps);
      }

      // 4. Sync PM Routine
      const { data: pmRoutine } = await supabase
        .from('routines')
        .upsert(
          { profile_id: user.id, routine_type: 'pm', is_active: true },
          { onConflict: 'profile_id, routine_type' }
        )
        .select('id')
        .single();

      if (pmRoutine && body.pm_routine?.length > 0) {
        await supabase.from('routine_steps').delete().eq('routine_id', pmRoutine.id);
        const pmSteps = body.pm_routine.map((step, idx) => ({
          routine_id: pmRoutine.id,
          step_order: idx + 1,
          product_name: step.product_name,
          category: step.category,
          frequency: step.frequency,
        }));
        await supabase.from('routine_steps').insert(pmSteps);
      }

      // 5. Sync Past Reactions
      if (body.past_reactions?.length > 0) {
        for (const reaction of body.past_reactions) {
          await supabase.from('user_reactions').insert({
            profile_id: user.id,
            product_name: reaction.product_name,
            reaction_type: reaction.reaction_type,
            severity: reaction.severity,
            suspected_ingredients: reaction.suspected_ingredients,
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Profile saved successfully' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Save error';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
