import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // Inline the portfolio styles to avoid blocking CSS round trips.
    inlineStyleThreshold: 40000,
    adapter: adapter({
      pages: 'dist',
      assets: 'dist'
    })
  }
};

export default config;
