// Type declarations for Vercel packages
// These packages export their own types but TypeScript may not find them

declare module '@vercel/analytics/react' {
  import { FC } from 'react';
  export const Analytics: FC;
}

declare module '@vercel/speed-insights/next' {
  import { FC } from 'react';
  export const SpeedInsights: FC;
}
