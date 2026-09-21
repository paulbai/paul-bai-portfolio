<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { ArrowLeft, ArrowRight, Pause, Play } from '@lucide/svelte';
  import { projects, type Project } from '$lib/data/projects';
  let { paused = false, onopen }: { paused?: boolean; onopen: (project: Project) => void } =
    $props();
  let active = $state(0);
  let stopped = $state(false);
  let hover = $state(false);
  let focus = $state(false);
  let visible = false;
  let region: HTMLElement;
  let downX = 0;
  let downY = 0;
  let pointerId: number | null = null;
  let suppressClick = false;
  function offset(index: number) {
    let value = index - active;
    if (value > projects.length / 2) value -= projects.length;
    if (value < -projects.length / 2) value += projects.length;
    return value;
  }
  function advance(direction: number) {
    active = (active + direction + projects.length) % projects.length;
  }
  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    observer.observe(region);
    const timer = window.setInterval(() => {
      if (!paused && !stopped && !hover && !focus && visible && !document.hidden) advance(1);
    }, 3000);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  });
</script>

<div
  class="b-project-rail"
  bind:this={region}
  role="region"
  aria-label="Selected projects carousel"
  onmouseenter={() => (hover = true)}
  onmouseleave={() => (hover = false)}
  onfocusin={() => (focus = true)}
  onfocusout={(e) => (focus = !!e.relatedTarget && region.contains(e.relatedTarget as Node))}
>
  <div
    class="b-rail-stage"
    role="group"
    aria-label="Project previews. Swipe to browse."
    onpointerdown={(e) => {
      if (!e.isPrimary || e.button !== 0) return;
      pointerId = e.pointerId;
      downX = e.clientX;
      downY = e.clientY;
      suppressClick = false;
      (e.target as HTMLElement).closest('button')?.setPointerCapture(e.pointerId);
    }}
    onpointerup={(e) => {
      if (pointerId !== e.pointerId) return;
      pointerId = null;
      const dx = e.clientX - downX;
      const dy = e.clientY - downY;
      suppressClick = Math.hypot(dx, dy) > 12;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        advance(dx < 0 ? 1 : -1);
      }
    }}
    onpointercancel={() => {
      pointerId = null;
      suppressClick = true;
    }}
  >
    {#each projects as project, i}
      {@const distance = offset(i)}
      <button
        class="b-rail-card"
        class:b-rail-current={distance === 0}
        class:b-rail-visible={Math.abs(distance) <= 3}
        type="button"
        style:--offset={distance}
        style:--depth={Math.abs(distance)}
        style:z-index={10 - Math.abs(distance)}
        aria-label={`Read a summary of ${project.title} / ${project.number}`}
        tabindex={distance === 0 ? 0 : -1}
        aria-hidden={Math.abs(distance) > 3}
        onkeydown={async (e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            e.preventDefault();
            advance(e.key === 'ArrowRight' ? 1 : -1);
            await tick();
            region
              .querySelector<HTMLButtonElement>('.b-rail-current')
              ?.focus({ preventScroll: true });
          }
        }}
        onclick={(e) => {
          if (!suppressClick || e.detail === 0) {
            active = i;
            onopen(project);
          }
        }}
      >
        <img
          src={project.image}
          alt={`${project.title} project preview`}
          width="640"
          height="480"
          loading="lazy"
          draggable="false"
        />
        <span class="b-rail-label"
          ><i></i>{project.title}<span aria-hidden="true">/ {project.number}</span></span
        >
      </button>
    {/each}
  </div>
  <div class="b-rail-tools">
    <div class="b-rail-arrows">
      <button type="button" onclick={() => advance(-1)} aria-label="Previous project"
        ><ArrowLeft size={18} /></button
      >
      <button type="button" onclick={() => advance(1)} aria-label="Next project"
        ><ArrowRight size={18} /></button
      >
      <button
        type="button"
        onclick={() => (stopped = !stopped)}
        aria-label={stopped || paused ? 'Play project rotation' : 'Pause project rotation'}
        disabled={paused}
      >
        {#if stopped || paused}<Play size={15} />{:else}<Pause size={15} />{/if}
      </button>
    </div>
    <label class="b-project-picker"
      ><span class="b-sr-only">Choose a project</span>
      <span aria-hidden="true">{String(active + 1).padStart(2, '0')} / 21</span>
      <select
        aria-label="Choose a project"
        value={active}
        onchange={(e) => {
          active = Number(e.currentTarget.value);
          stopped = true;
        }}
      >
        {#each projects as project, i}<option value={i}>{project.title}</option>{/each}
      </select>
    </label>
  </div>
</div>
