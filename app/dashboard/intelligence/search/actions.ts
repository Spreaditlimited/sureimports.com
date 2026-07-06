'use server';

import { revalidatePath } from 'next/cache';
import { after } from 'next/server';

import { checkAuth } from '@/lib/auth/checkAuth';
import xMail from '@/lib/email/xMail2';
import { getActiveIntelligenceSubscription } from '@/lib/intelligence/access';
import {
  createExistingNicheSearchLog,
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

function notifyAdminOfSearch(input: {
  pidSearch: string;
  userEmail: string;
  query: string;
  targetSupplierCount: number;
  notes?: string | null;
  status: string;
  creditCost: number;
  resultSlugs?: string[];
}) {
  after(async () => {
    await xMail({
      xEmail: 'hello@sureimports.com',
      xTitle: 'New Supplier Intelligence search',
      xBodyTitle: 'A user searched Supplier Intelligence',
      xBody1: [
        `Search ID: ${input.pidSearch}`,
        `User: ${input.userEmail}`,
        `Query: ${input.query}`,
        `Target suppliers: ${input.targetSupplierCount}`,
        `Status: ${input.status.replace(/_/g, ' ')}`,
        `Credit cost: ${input.creditCost}`,
        `Search time: ${new Date().toLocaleString('en-GB', {
          dateStyle: 'medium',
          timeStyle: 'short',
          timeZone: 'Europe/London',
        })}`,
        input.resultSlugs?.length
          ? `Matched result: ${input.resultSlugs.join(', ')}`
          : '',
      ]
        .filter(Boolean)
        .join('<br />'),
      xBody2: input.notes ? `Notes: ${input.notes}` : '',
      xButtonTitle: 'Open admin dashboard',
      xButtonLink: 'https://admin.sureimports.com/dashboard/intelligence/research',
    });
  });
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
        const pidSearch = await createExistingNicheSearchLog({
          pidUser: user.pidUser,
          email: user.userEmail,
          query,
          targetSupplierCount,
          notes,
          matches: existingMatches,
        });

        notifyAdminOfSearch({
          pidSearch,
          userEmail: user.userEmail,
          query,
          targetSupplierCount,
          notes,
          status: 'fulfilled_existing',
          creditCost: 0,
          resultSlugs: existingMatches.map((match) => match.slug),
        });
        revalidatePath('/dashboard/intelligence');

        return {
          success: true,
          message:
            'This category already exists. No search credit was used. Open it below.',
          existingMatches,
        };
      }

      const pidSearch = await createExistingNicheSearchResultWithConsumedCredit({
        pidUser: user.pidUser,
        email: user.userEmail,
        query,
        targetSupplierCount,
        notes,
        matches: existingMatches,
      });
      notifyAdminOfSearch({
        pidSearch,
        userEmail: user.userEmail,
        query,
        targetSupplierCount,
        notes,
        status: 'fulfilled_existing',
        creditCost: 1,
        resultSlugs: existingMatches.map((match) => match.slug),
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
    notifyAdminOfSearch({
      pidSearch,
      userEmail: user.userEmail,
      query,
      targetSupplierCount,
      notes,
      status: 'awaiting_admin',
      creditCost: 1,
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
