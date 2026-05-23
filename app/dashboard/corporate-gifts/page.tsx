import { prisma } from '@/lib/prisma';
import { checkAuth } from '@/lib/auth/checkAuth';
import { CORPORATE_GIFT_STATUSES } from '@/lib/notifications/corporateGifts';
import {
  assignCorporateGiftRequestAction,
  updateCorporateGiftRequestAction,
} from './actions';

export const dynamic = 'force-dynamic';

const toFileUrl = (url: string | null, fileName: string | null) => {
  if (url) return url;
  const base = ((process.env.NEXT_PUBLIC_CLOUDINARY_BASE_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL) || '').replace(/\/$/, '');
  if (!base || !fileName) return null;
  return `${base}/${fileName}`;
};

export default async function CorporateGiftsAdminPage() {
  const currentUser = await checkAuth();

  const requests = await prisma.corporate_gift_request.findMany({
    orderBy: { createdAt: 'desc' },
    take: 300,
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Corporate Gift Requests</h1>
          <p className="text-sm text-gray-500">
            Manage submissions, ownership, and customer update status
          </p>
        </div>
        <div className="rounded-md border px-3 py-1 text-sm">
          Total: {requests.length}
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Request</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Files</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Handler</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => {
              const referenceFileUrl = toFileUrl(
                request.referenceFileUrl,
                request.referenceFileName,
              );
              const logoFileUrl = toFileUrl(
                request.logoFileUrl,
                request.logoFileName,
              );

              return (
                <tr key={request.id} className="border-t align-top">
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(request.createdAt).toLocaleString('en-GB')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{request.pidRequest}</div>
                    <div>{request.businessName}</div>
                    <div className="text-xs text-gray-500">
                      {request.productOrItemNeeded}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{request.contactPersonFullName}</div>
                    <div className="whitespace-nowrap text-xs text-gray-600">
                      {request.contactEmail}
                    </div>
                    <div className="whitespace-nowrap text-xs text-gray-600">
                      {request.whatsappNumber}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      {referenceFileUrl ? (
                        <a
                          href={referenceFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Reference File
                        </a>
                      ) : (
                        <span className="text-gray-400">No reference file</span>
                      )}
                      {logoFileUrl ? (
                        <a
                          href={logoFileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 underline"
                        >
                          Company Logo
                        </a>
                      ) : (
                        <span className="text-gray-400">No logo file</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded border px-2 py-1 text-xs">
                      {request.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div>{request.handledByName || 'Unassigned'}</div>
                    {request.handledByEmail ? (
                      <div className="text-gray-500">
                        {request.handledByEmail}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-2">
                      <form action={assignCorporateGiftRequestAction}>
                        <input
                          type="hidden"
                          name="pidRequest"
                          value={request.pidRequest}
                        />
                        <button
                          type="submit"
                          className="rounded border px-2 py-1 text-xs hover:bg-gray-50"
                        >
                          Assign To Me (
                          {currentUser?.userEmail || 'Current User'})
                        </button>
                      </form>

                      <form
                        action={updateCorporateGiftRequestAction}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="hidden"
                          name="pidRequest"
                          value={request.pidRequest}
                        />
                        <select
                          name="status"
                          defaultValue={request.status}
                          className="rounded border px-2 py-1 text-xs"
                        >
                          {CORPORATE_GIFT_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="rounded border bg-black px-2 py-1 text-xs text-white"
                        >
                          Update
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              );
            })}

            {requests.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">
                  No corporate gift requests yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
