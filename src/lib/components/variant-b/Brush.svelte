<script lang="ts">
  let { class: className = '' }: { class?: string } = $props();
</script>

<svg class={className} viewBox="0 0 500 20" preserveAspectRatio="none" aria-hidden="true">
  <path
    d="M4 14 19 10 17 8 76 5 167 4 211 5 290 3 399 5 485 4 497 7 489 9 498 11 482 12 406 10 299 11 235 10 155 11 71 12 13 17Z"
    fill="currentColor"
  />
</svg>

<style>
  svg {
    width: 100%;
    height: 1em;
    display: block;
    pointer-events: none;
  }
</style>
