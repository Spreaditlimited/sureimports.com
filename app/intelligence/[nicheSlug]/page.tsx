import { redirect } from 'next/navigation';

type IntelligenceNicheRedirectPageProps = {
  params: Promise<{ nicheSlug: string }>;
};

export default async function IntelligenceNicheRedirectPage({
  params,
}: IntelligenceNicheRedirectPageProps) {
  const { nicheSlug } = await params;
  redirect(`/dashboard/intelligence/${nicheSlug}`);
}
