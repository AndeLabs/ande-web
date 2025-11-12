export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ANDE Network',
    alternateName: 'ANDE Labs',
    url: 'https://ande.network',
    logo: 'https://ande.network/logo.png',
    description:
      'ANDE Network is a fast, cheap, and truly sovereign EVM rollup built for Latin America, using Celestia for Data Availability.',
    sameAs: [
      'https://twitter.com/ANDENetwork',
      'https://github.com/ANDELabs',
      'https://discord.gg/ande',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Technical Support',
      url: 'https://ande.network/contact',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ANDE Network',
    url: 'https://ande.network',
    description:
      'Fast, cheap, and truly sovereign EVM rollup for Latin America',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://ande.network/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
