// app/api/disable-draft/route.ts
/**
 * Next.js App Router Disable Draft Mode Route Handler
 * Clears the preview cookie and returns user to the standard ISR cached view.
 */

import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect') || '/blog';

  const draft = await draftMode();
  draft.disable();

  // Prevent open-redirect vulnerabilities by enforcing relative local paths
  const safePath = redirectUrl.startsWith('/') && !redirectUrl.startsWith('//') ? redirectUrl : '/blog';

  redirect(safePath);
}
