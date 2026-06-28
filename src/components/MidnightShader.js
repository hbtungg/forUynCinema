'use client';

import { useEffect, useRef } from 'react';

export default function MidnightShader() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId;

    // Tự động đồng bộ kích thước Canvas chuẩn đét
    function syncSize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    // Sử dụng ResizeObserver chuẩn Linux/Web hiện đại giống mã thô của anh[cite: 6]
    const resizeObserver = new ResizeObserver(syncSize);
    resizeObserver.observe(canvas);
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    // Vertex Shader gốc của anh[cite: 6]
    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Fragment Shader chuẩn "Celestial Luxury" của anh[cite: 6]
    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      vec2 u_resolution;
      uniform vec2 u_mouse;

      float hash(vec2 p) {
          p = fract(p * vec2(123.34, 456.21));
          p += dot(p, p + 45.32);
          return fract(p.x * p.y);
      }

      float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          vec2 shift = vec2(100.0);
          mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
          for (int i = 0; i < 6; ++i) {
              v += a * noise(p);
              p = rot * p * 2.0 + shift;
              a *= 0.5;
          }
          return v;
      }

      void main() {
          vec2 uv = v_texCoord;
          vec2 p = uv * 2.0 - 1.0;
          vec2 res = vec2(1920.0, 1080.0); 
          p.x *= res.x / res.y;

          vec3 color = vec3(0.005, 0.006, 0.015); 

          vec2 q = vec2(0.0);
          q.x = fbm(p + 0.1 * u_time);
          q.y = fbm(p + vec2(1.0));

          vec2 r = vec2(0.0);
          r.x = fbm(p + 1.0 * q + vec2(1.7, 9.2) + 0.15 * u_time);
          r.y = fbm(p + 1.0 * q + vec2(8.3, 2.8) + 0.126 * u_time);

          float f = fbm(p + r);

          vec3 nebulaColor = mix(vec3(0.024, 0.031, 0.078), vec3(0.357, 0.42, 0.749), f);
          color = mix(color, nebulaColor, 0.5);

          float stars = pow(hash(uv * 100.0), 50.0) * (0.5 + 0.5 * sin(u_time * 2.0 + hash(uv) * 10.0));
          color += stars * 0.4;

          float dist = length(p - vec2(0.0, 0.8));
          float glow = smoothstep(1.5, 0.0, dist);
          color += glow * vec3(0.9, 0.78, 0.53) * 0.15; 

          gl_FragColor = vec4(color, 1.0);
      }
    `;

    function cs(type, src) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, cs(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, cs(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width;
        const ny = 1.0 - (event.clientY - rect.top) / rect.height;
        mouse.x = nx * canvas.width;
        mouse.y = ny * canvas.height;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    function render(t) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uMouse) gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }

    render(0);

    // DỌN DẸP BỘ NHỚ KHI THOÁT TRANG (Tránh lỗi ngốn RAM trên trình duyệt)
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: -10 }}>
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}