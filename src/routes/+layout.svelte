<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';
  import { siteMetadataUrls } from '../../scripts/validate-site-url.mjs';
  let { children }: { children: Snippet } = $props();
  import * as publicEnvironment from '$env/static/public';
  const configuredSiteUrl = Object.entries(publicEnvironment as Record<string, string>).find(
    ([key]) => key === 'PUBLIC_SITE_URL'
  )?.[1];
  const { canonicalUrl, socialImageUrl } = siteMetadataUrls(configuredSiteUrl);
  const description =
    'Paul Bai Kanu is Flot Product Manager and Mocha co-founder. His team processed over $2.5M across Mocha services from May 2024 to June 2025.';
</script>

<svelte:head>
  <title>Paul Bai Kanu | Product Manager at Flot, Mocha Co-Founder</title>
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#17171a" />
  {#if canonicalUrl}
    <meta property="og:url" content={canonicalUrl} />
    <link rel="canonical" href={canonicalUrl} />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Paul Bai Kanu | Product Manager at Flot, Mocha Co-Founder" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={socialImageUrl} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta
    property="og:image:alt"
    content="Paul Bai, designing for the way Africa moves, with a brass sculpture of Africa"
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Paul Bai Kanu | Product Manager at Flot, Mocha Co-Founder" />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={socialImageUrl} />
  <link rel="icon" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/favicon.png" />
</svelte:head>

{@render children()}
