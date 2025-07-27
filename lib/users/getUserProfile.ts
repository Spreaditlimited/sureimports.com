import { prisma } from '@/lib/prisma';

export async function getUserProfile(userId: string) {
  try {
    const userProfile = await prisma.users.findUnique({
      where: { pidUser: userId },
      select: {
        userCountry: true,
        userPhone: true,
        gender: true,
        // Add other fields you want to retrieve
      },
    });
    return userProfile;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw new Error('Failed to fetch user profile');
  }
}
