'use server';

import { revalidatePath } from 'next/cache';
import { after } from 'next/server';

import { checkAuth } from '@/lib/auth/checkAuth';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import {
  createExistingNicheSearchResultWithConsumedCredit,
  createSearchRequestWithReservedCredit,
  type ExistingNicheSearchMatch,
} from '@/lib/intelligence/credits';
import { findPublishedNicheMatches } from '@/lib/intelligence/data';
import { startUserSupplierResearch } from '@/lib/intelligence/researchRunner';

export type SearchCreditRequestState = {
  success: boolean;
  message: string;
  pidSearch?: string;
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

    const pidSearch = await createSearchRequestWithReservedCredit({
      pidUser: user.pidUser,
      email: user.userEmail,
      query,
      targetSupplierCount,
      notes,
    });

    revalidatePath('/dashboard/intelligence');

    after(async () => {
      try {
        await startUserSupplierResearch({
          pidSearch,
          pidUser: user.pidUser,
        });
      } catch {
        // The user dashboard also attempts to start/poll the search. Failures are
        // written to the request record by the research runner where possible.
      }
    });

    return {
      success: true,
      message:
        'Search started. You can follow the research progress below while Sure Imports prepares the first result for specialist review.',
      pidSearch,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || 'Could not submit this search request.',
    };
  }
}
