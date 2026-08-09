export type CorporateSourcingDraft = {
  values: Record<string, string>;
  referenceFile: File | null;
  logoFile: File | null;
};

const DATABASE_NAME = 'sureimports-checkout-drafts';
const STORE_NAME = 'drafts';
const DRAFT_KEY = 'corporate-sourcing';
const DATABASE_VERSION = 1;

function openDraftDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const database = request.result;
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function runDraftTransaction<T>(
  mode: IDBTransactionMode,
  operation: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  const database = await openDraftDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(STORE_NAME, mode);
      const request = operation(transaction.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      transaction.onerror = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export function saveCorporateSourcingDraft(
  draft: CorporateSourcingDraft,
): Promise<IDBValidKey> {
  return runDraftTransaction('readwrite', (store) =>
    store.put(draft, DRAFT_KEY),
  );
}

export async function getCorporateSourcingDraft(): Promise<CorporateSourcingDraft | null> {
  const draft = await runDraftTransaction<CorporateSourcingDraft | undefined>(
    'readonly',
    (store) => store.get(DRAFT_KEY),
  );
  return draft || null;
}

export async function deleteCorporateSourcingDraft(): Promise<void> {
  await runDraftTransaction('readwrite', (store) => store.delete(DRAFT_KEY));
}

export async function updateCorporateSourcingDraftEmail(
  email: string,
): Promise<boolean> {
  const draft = await getCorporateSourcingDraft();
  if (!draft) return false;

  await saveCorporateSourcingDraft({
    ...draft,
    values: {
      ...draft.values,
      contact_email: email.trim().toLowerCase(),
    },
  });
  return true;
}

export function corporateSourcingDraftToFormData(
  draft: CorporateSourcingDraft,
): FormData {
  const formData = new FormData();
  Object.entries(draft.values).forEach(([key, value]) => {
    formData.append(key, value);
  });
  if (draft.referenceFile) {
    formData.append('reference_image_upload', draft.referenceFile);
  }
  if (draft.logoFile) {
    formData.append('company_logo_upload', draft.logoFile);
  }
  return formData;
}
