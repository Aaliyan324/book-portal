import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opt out of Next.js 16's Cache Components / Partial Prerendering (PPR) mode.
  // Our pages call cookies() and Prisma at the top level without <Suspense>
  // wrappers, which is the traditional dynamic-rendering pattern. Without this
  // flag, PPR tries to prerender a static shell at build time and fails on
  // Vercel, producing "page not found" for every dynamic route such as
  // /courses/[courseSlug] and /admin/courses/[courseId]/edit.
  cacheComponents: false,
};

export default nextConfig;
