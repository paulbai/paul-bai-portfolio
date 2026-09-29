<script lang="ts">
  import '../app.css';
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
  import * as publicEnvironment from '$env/static/public';
  const siteUrl = Object.entries(publicEnvironment as Record<string, string>)
    .find(([key]) => key === 'PUBLIC_SITE_URL')?.[1]
    ?.replace(/\/$/, '');
  const canonicalUrl = siteUrl ? `${siteUrl}/` : undefined;
  const description =
    'Paul Bai Kanu is Product Manager at Flot and Mocha co-founder. His team built a WhatsApp-based money product that has processed over $2.5M.';
</script>

<svelte:head>
  <title>Paul Bai Kanu | Product Manager, Flot &amp; Mocha</title>
  <meta name="description" content={description} />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#17171a" />
  {#if siteUrl}
    <meta property="og:url" content={canonicalUrl} />
    <link rel="canonical" href={canonicalUrl} />
  {/if}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Paul Bai Kanu | Product Manager, Flot &amp; Mocha" />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={`${siteUrl ?? ''}/og-v2.jpg`} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta
    property="og:image:alt"
    content="Paul Bai, designing for the way Africa moves, with a brass sculpture of Africa"
  />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Paul Bai Kanu | Product Manager, Flot &amp; Mocha" />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={`${siteUrl ?? ''}/og-v2.jpg`} />
  <link rel="icon" href="/favicon.png" />
  <link rel="apple-touch-icon" href="/favicon.png" />
</svelte:head>

{@render children()}
