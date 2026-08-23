import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

import {
  BODY_CAMERA_LAUNCH_READY,
  bodyCameraLaunchPaths,
  bodyCameraPlaceholders,
} from '../lib/bodyCameraSolutions/config.ts';
import { solutionPages } from '../lib/bodyCameraSolutions/content.ts';
import { bodyCameraDocuments } from '../lib/bodyCameraSolutions/documents.ts';

const read = (path) =>
  fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('the unpublished solution centre has unique launch paths and content pages', () => {
  const slugs = solutionPages.map(({ slug }) => slug);

  assert.equal(new Set(slugs).size, slugs.length);
  assert.equal(bodyCameraLaunchPaths.length, solutionPages.length + 1);
  assert.equal(BODY_CAMERA_LAUNCH_READY, false);
  assert.equal(bodyCameraPlaceholders.caseStudyApproved, false);
  assert.equal(bodyCameraPlaceholders.downloadsApproved, true);
});

test('customer-confidential naming is absent from the solution centre', () => {
  const searchableContent = [
    read('lib/bodyCameraSolutions/content.ts'),
    read('app/(home)/body-camera-solutions/page.tsx'),
    read('app/(home)/body-camera-solutions/[slug]/page.tsx'),
  ].join('\n');

  assert.doesNotMatch(searchableContent, /sterling\s+bank/i);
});

test('launch state controls indexing and sitemap exposure', () => {
  const hub = read('app/(home)/body-camera-solutions/page.tsx');
  const detail = read('app/(home)/body-camera-solutions/[slug]/page.tsx');
  const sitemap = read('app/sitemap.ts');

  assert.match(hub, /BODY_CAMERA_LAUNCH_READY/);
  assert.match(detail, /BODY_CAMERA_LAUNCH_READY/);
  assert.match(sitemap, /if \(BODY_CAMERA_LAUNCH_READY\)/);
});

test('the main services menu exposes Body Cam Solutions and links to LineScout home', () => {
  const navbar = read('components/home/NavBar.tsx');
  const footer = read('app/(home)/components/Footer.tsx');

  assert.match(navbar, /title: 'Body Cam Solutions'/);
  assert.match(navbar, /href: '\/body-camera-solutions'/);
  assert.match(footer, />\s*Body Cam Solutions\s*</);
  assert.match(navbar, /href: 'https:\/\/linescout\.sureimports\.com\/'/);
  assert.doesNotMatch(navbar, /route_type=simple_sourcing/);
});

test('the section renders one dedicated navbar with the Sure Imports logo', () => {
  const header = read(
    'app/(home)/body-camera-solutions/_components/SolutionHeader.tsx',
  );

  assert.match(header, /src="\/images\/svg-logo\.svg"/);
  assert.match(header, /aria-label="Body camera solutions"/);
  assert.doesNotMatch(header, />\s*Body Camera Solutions\s*</);
  assert.match(header, /absolute left-1\/2 hidden -translate-x-1\/2/);
  assert.doesNotMatch(header, /import Navbar from/);
  assert.doesNotMatch(header, /<Navbar/);
});

test('the assessment form uses premium Sure Imports pickers', () => {
  const form = read(
    'app/(home)/body-camera-solutions/_components/LeadForm.tsx',
  );

  assert.match(form, /from '@\/components\/ui\/select'/);
  assert.match(form, /function PremiumPicker/);
  assert.match(form, /showIndicator=\{false\}/);
  assert.doesNotMatch(form, /<select/);
  assert.doesNotMatch(form, /<option/);
});

test('solution enquiries are stored before notification emails are sent', () => {
  const route = read('app/api/body-camera-assessment/route.ts');

  assert.match(route, /prisma\.body_camera_enquiries\.create/);
  assert.match(route, /adminNotificationStatus/);
  assert.match(route, /customerNotificationStatus/);
  assert.ok(
    route.indexOf('prisma.body_camera_enquiries.create') <
      route.indexOf('Promise.allSettled'),
  );
  assert.match(route, /dashboard\/body-camera-enquiries\?enquiry=/);
});

test('product pages keep high-intent visitors inside Sure Imports', () => {
  const detail = read('app/(home)/body-camera-solutions/[slug]/page.tsx');

  assert.match(detail, /href="#related-solutions"/);
  assert.match(detail, /Explore related solutions/);
  assert.doesNotMatch(detail, /Manufacturer information/);
  assert.doesNotMatch(detail, /href=\{productImage\.sourceUrl\}/);
});

test('approved Hytera documents use stable, allowlisted download routes', () => {
  const downloads = read(
    'app/(home)/body-camera-solutions/_components/DocumentDownloads.tsx',
  );
  const route = read('app/api/body-camera-documents/[slug]/route.ts');
  const slugs = bodyCameraDocuments.map(({ slug }) => slug);

  assert.equal(bodyCameraDocuments.length, 2);
  assert.equal(new Set(slugs).size, slugs.length);
  assert.ok(
    bodyCameraDocuments.every(({ cloudinaryPublicId }) =>
      cloudinaryPublicId.startsWith(
        'sureimports/body-camera-solutions/documents/',
      ),
    ),
  );
  assert.doesNotMatch(JSON.stringify(bodyCameraDocuments), /sterling/i);
  assert.match(downloads, /\/api\/body-camera-documents\/\$\{document\.slug\}/);
  assert.match(route, /bodyCameraDocumentBySlug\.get\(slug\)/);
  assert.match(route, /Content-Disposition/);
});

test('the landing page has a gated Cloudflare Stream video embed', () => {
  const hub = read('app/(home)/body-camera-solutions/page.tsx');
  const video = read(
    'app/(home)/body-camera-solutions/_components/BodyCameraVideo.tsx',
  );
  const config = read('lib/bodyCameraSolutions/config.ts');

  assert.match(hub, /<BodyCameraVideo \/>/);
  assert.match(video, /loading="lazy"/);
  assert.match(video, /allowFullScreen/);
  assert.match(video, /bodyCameraVideo\.isReady/);
  assert.match(config, /NEXT_PUBLIC_HYTERA_BODY_CAMERA_VIDEO_ID/);
  assert.match(config, /cloudflarestream\.com/);
});
