const canvas = document.getElementById('aurora-canvas');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const gl = reducedMotion ? null : canvas.getContext('webgl', { alpha: false, antialias: false });

if (gl) {
  const vertex = `attribute vec2 position; void main(){ gl_Position=vec4(position,0.0,1.0); }`;
  const fragment = `
    precision mediump float;
    uniform float u_time;
    uniform vec2 u_resolution;
    uniform vec2 u_mouse;

    // UV coordinates turn each screen pixel into a simple 0-to-1 map.
    // Centering them makes the middle of the screen the origin.
    vec2 uvMap(){ return (gl_FragCoord.xy / u_resolution.xy) * 2.0 - 1.0; }

    float noise(vec2 p){
      return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
    }

    void main(){
      vec2 uv = uvMap();
      // Correct for the screen aspect ratio so the flow is not stretched.
      uv.x *= u_resolution.x / u_resolution.y;
      // Convert the mouse from pixels into a soft, centered influence.
      vec2 mouse = (u_mouse / u_resolution) * 2.0 - 1.0;
      float distToMouse = length(uv - mouse * vec2(1.2, .7));
      // Time makes the layered waves drift smoothly.
      float time = u_time * .18;
      float waveA = sin(uv.x * 2.0 + sin(uv.y * 2.3 + time) + time) * .5 + .5;
      float waveB = sin(uv.x * 3.4 - uv.y * 1.5 - time * 1.4) * .5 + .5;
      float pull = smoothstep(1.4, 0.0, distToMouse) * .18;
      waveA += pull;
      // Aurora color layers: blue, teal, purple, with a small green glow.
      vec3 navy = vec3(.015, .035, .12);
      vec3 blue = vec3(.05, .25, .9) * smoothstep(.22, .9, waveA);
      vec3 teal = vec3(.0, .65, .62) * smoothstep(.5, .95, waveB) * .65;
      vec3 purple = vec3(.42, .08, .78) * smoothstep(.35, .85, 1.0 - waveA) * .7;
      vec3 green = vec3(.18, .75, .35) * smoothstep(.78, 1.0, waveA + waveB) * .22;
      vec3 color = navy + blue + teal + purple + green;
      // Gentle grain keeps the dark gradient from looking too flat.
      color += (noise(gl_FragCoord.xy + u_time) - .5) * .025;
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  function compile(type, source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);return shader;}
  const program=gl.createProgram(); gl.attachShader(program,compile(gl.VERTEX_SHADER,vertex)); gl.attachShader(program,compile(gl.FRAGMENT_SHADER,fragment)); gl.linkProgram(program); gl.useProgram(program);
  const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const position=gl.getAttribLocation(program,'position'); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  const timeLocation=gl.getUniformLocation(program,'u_time'),resolutionLocation=gl.getUniformLocation(program,'u_resolution'),mouseLocation=gl.getUniformLocation(program,'u_mouse');
  let start=performance.now(), mouseX=0, mouseY=0, frameId=0, paused=document.hidden;
  function resize(){const dpr=Math.min(window.devicePixelRatio||1,1.5);canvas.width=Math.floor(innerWidth*dpr);canvas.height=Math.floor(innerHeight*dpr);gl.viewport(0,0,canvas.width,canvas.height);gl.uniform2f(resolutionLocation,canvas.width,canvas.height)}
  function render(now){if(paused)return;gl.uniform1f(timeLocation,(now-start)/1000);gl.uniform2f(mouseLocation,mouseX,mouseY);gl.drawArrays(gl.TRIANGLES,0,6);frameId=requestAnimationFrame(render)}
  addEventListener('resize',resize); addEventListener('pointermove',event=>{mouseX=event.clientX*(canvas.width/innerWidth);mouseY=(innerHeight-event.clientY)*(canvas.height/innerHeight)}); document.addEventListener('visibilitychange',()=>{paused=document.hidden;if(!paused){start=performance.now();cancelAnimationFrame(frameId);frameId=requestAnimationFrame(render)}}); resize(); frameId=requestAnimationFrame(render);
}
