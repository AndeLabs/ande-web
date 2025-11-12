import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://ande.network';

  // Static pages
  const staticPages = [
    '',
    '/about',
    '/technology',
    '/tokenomics',
    '/roadmap',
    '/team',
    '/docs',
    '/docs/getting-started',
    '/docs/developers',
    '/docs/api',
    '/faucet',
    '/staking',
    '/staking/light',
    '/staking/medium',
    '/staking/heavy',
    '/staking/rewards',
    '/staking/history',
    '/staking/leaderboard',
    '/staking/calculator',
    '/governance',
    '/governance/proposals',
    '/governance/create',
    '/governance/history',
    '/governance/delegation',
    '/dashboard',
    '/portfolio',
    '/defi',
    '/transactions',
    '/profile',
    '/connect',
    '/network-status',
    '/blog',
    '/stats',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? ('daily' as const) : ('weekly' as const),
    priority: route === '' ? 1 : route.includes('docs') ? 0.8 : 0.7,
  }));

  return staticPages;
}
