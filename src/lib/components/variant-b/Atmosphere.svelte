<script lang="ts">
  import { onMount } from 'svelte';
  let { paused = false }: { paused?: boolean } = $props();
  let canvas: HTMLCanvasElement;

  onMount(() => {
    let disposed = false;
    let cleanup = () => {};
    // Keep touch devices and reduced-motion visits on the lightweight visual layer.
    if (matchMedia('(pointer: coarse), (prefers-reduced-motion: reduce)').matches) return;
    // Load the GPU layer separately; real HTML remains usable without WebGL.
    import('three')
      .then((THREE) => {
        if (disposed) return;
        let renderer: import('three').WebGLRenderer;
        try {
          renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: false,
            alpha: true,
            powerPreference: 'low-power'
          });
        } catch {
          return;
        }
        const scene = new THREE.Scene();
        const camera = new THREE.Camera();
        const uniforms = {
          uTime: { value: 0 },
          uAspect: { value: 1 },
          uPointer: { value: new THREE.Vector2(0.5, 0.5) }
        };
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader: 'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position,1.0);}',
          fragmentShader: `
          precision mediump float;
          varying vec2 vUv;
          uniform float uTime;
          uniform float uAspect;
          uniform vec2 uPointer;
          float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
          void main(){
            vec2 p=vUv; vec2 q=(p-.5)*vec2(uAspect,1.);
            float fog=noise(q*2.8+vec2(uTime*.015,0.));
            fog+=noise(q*6.4-vec2(0.,uTime*.011))*.35;
            float vignette=1.-smoothstep(.18,.88,length(q*vec2(.6,1.)));
            vec3 base=mix(vec3(.019,.019,.025),vec3(.087,.087,.10),fog*.55+vignette*.3);
            vec2 focal=(p-vec2(.33,.66)-(uPointer-.5)*.04)*vec2(uAspect,1.);
            float curl=sin(focal.x*5.+uTime*.04)*.14+noise(focal*5.+uTime*.02)*.15;
            float ribbon=exp(-pow((focal.y-curl)*7.,2.))*exp(-dot(focal,focal)*5.);
            float dots=step(.7,fract(gl_FragCoord.x*.5))*step(.7,fract(gl_FragCoord.y*.5));
            base+=vec3(.45,.075,.012)*ribbon*pow(fog,1.6)*(.35+.55*dots);
            vec2 cells=p*vec2(22.,14.);vec2 cell=floor(cells);vec2 c=fract(cells)-.5;
            float dust=pow(max(0.,1.-length(c)*3.),6.)*step(.94,hash(cell))*noise(cell+uTime*.035);
            base+=vec3(.10)*dust;
            base+=(hash(gl_FragCoord.xy)-.5)*.016;
            gl_FragColor=vec4(base,1.);
          }`
        });
        scene.add(new THREE.Mesh(geometry, material));
        let shaderReady = false;
        const resize = () => {
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
          renderer.setSize(window.innerWidth, window.innerHeight);
          uniforms.uAspect.value = window.innerWidth / window.innerHeight;
          if (shaderReady) renderer.render(scene, camera);
        };
        const pointer = (event: PointerEvent) => {
          if (!paused && event.pointerType === 'mouse')
            uniforms.uPointer.value.set(
              event.clientX / innerWidth,
              1 - event.clientY / innerHeight
            );
        };
        let last = 0;
        renderer.setAnimationLoop((time) => {
          if (!shaderReady || document.hidden || paused || time - last < 32) return;
          uniforms.uTime.value += Math.min((time - last) / 1000, 0.05);
          last = time;
          renderer.render(scene, camera);
        });
        resize();
        renderer
          .compileAsync(scene, camera)
          .then(() => {
            if (!disposed) shaderReady = true;
          })
          .catch(() => {});
        window.addEventListener('resize', resize);
        window.addEventListener('pointermove', pointer, { passive: true });
        cleanup = () => {
          window.removeEventListener('resize', resize);
          window.removeEventListener('pointermove', pointer);
          renderer.setAnimationLoop(null);
          material.dispose();
          geometry.dispose();
          renderer.dispose();
        };
      })
      .catch(() => {
        /* The CSS background remains the no-WebGL fallback. */
      });
    return () => {
      disposed = true;
      cleanup();
    };
  });
</script>

<div class="b-atmosphere-fallback" aria-hidden="true"></div>
<canvas bind:this={canvas} class="b-atmosphere" aria-hidden="true"></canvas>

<style>
  .b-atmosphere {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
  .b-atmosphere-fallback {
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    background:
      radial-gradient(ellipse at 35% 30%, #55261e55, transparent 28%),
      radial-gradient(ellipse at 75% 80%, #222226, transparent 65%), #0e0e11;
  }
</style>
