'use server';

import { revalidatePath } from 'next/cache';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import {
  createExistingNicheSearchResultWithConsumedCredit,
  createSearchRequestWithReservedCredit,
  type ExistingNicheSearchMatch,
} from '@/lib/intelligence/credits';
import { findPublishedNicheMatches } from '@/lib/intelligence/data';

export type SearchCreditRequestState = {
  success: boolean;
  message: string;
  existingMatches?: ExistingNicheSearchMatch[];
};

function clean(value: FormDataEntryValue | null, max = 4000) {
  return String(value || '').trim().slice(0, max);
}

export async function createIntelligenceSearchRequest(
  _previousState: SearchCreditRequestState,
  formData: FormData,
): Promise<SearchCreditRequestState> {
  const user = await checkAuth();

  if (!user?.pidUser || !user.userEmail) {
    return {
      success: false,
      message: 'Please log in before requesting supplier research.',
    };
  }

  const query = clean(formData.get('query'), 220);
  const notes = clean(formData.get('notes'), 4000);
  const targetSupplierCount = Math.min(
    10,
    Math.max(3, Math.round(Number(formData.get('targetSupplierCount') || 3))),
  );

  if (!query) {
    return {
      success: false,
      message: 'Enter the product or category you want Sure Imports to research.',
    };
  }

  try {
    const existingMatches = await findPublishedNicheMatches(query);
    const subscription = await getActiveIntelligenceSubscription(user.pidUser);

    if (existingMatches.length > 0) {
      if (subscription) {
        return {
          success: true,
          message:
            'This category already exists. No search credit was used. Open it below.',
          existingMatches,
        };
      }

      await createExistingNicheSearchResultWithConsumedCredit({
        pidUser: user.pidUser,
        email: user.userEmail,
        query,
        targetSupplierCount,
        notes,
        matches: existingMatches,
      });

      revalidatePath('/dashboard/intelligence');

      return {
        success: true,
        message:
          'Supplier intelligence result found. One credit has been used to return this result.',
        existingMatches,
      };
    }

    await createSearchRequestWithReservedCredit({
      pidUser: user.pidUser,
      email: user.userEmail,
      query,
      targetSupplierCount,
      notes,
    });

    revalidatePath('/dashboard/intelligence');

    return {
      success: true,
      message:
        'Search request submitted. Sure Imports will review and approve the research before results are delivered.',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Could not submit this search request.',
    };
  }
}
