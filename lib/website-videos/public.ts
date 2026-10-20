import 'server-only';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import {
  defaultVideoMetadata,
  youtubeVideoId,
  validVideoMetadata,
} from './policy';
import { websiteVideos } from './store';
export const procurementVideo = cache(async () => {
  try {
    const setting = await websiteVideos(prisma).read();
    const id = youtubeVideoId(setting.videoUrl);
    const metadata: unknown = setting.metadataJson
      ? JSON.parse(setting.metadataJson)
      : null;
    if (id && validVideoMetadata(metadata, id)) return metadata;
  } catch {
    console.error(
      'Website video settings unavailable; using the default walkthrough.',
    );
  }
  return defaultVideoMetadata;
});
