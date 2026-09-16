import { useRef, useMemo, MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { soundEngine } from '../utils/sfx';

export default function BlackHole3D({
  mass = 2.2,
  spin,
  zoom,
  scrollRef,
  warpIntensity = 0,
}: {
  mass?: number;
  spin?: number;
  zoom?: number;
  scrollRef?: MutableRefObject<number>;
  warpIntensity?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMass: { value: mass },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
      uCameraPos: { value: new THREE.Vector3() },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAudioBass: { value: 0.0 },
      uAudioHigh: { value: 0.0 },
      uWarp: { value: 0.0 },
    }),
    [mass, size]
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.getElapsedTime();
    mat.uniforms.uCameraPos.value.copy(state.camera.position);

    // Audio frequency reactivity
    const freqs = soundEngine.getAudioFrequencies();
    mat.uniforms.uAudioBass.value = THREE.MathUtils.lerp(mat.uniforms.uAudioBass.value, freqs.bass, 0.15);
    mat.uniforms.uAudioHigh.value = THREE.MathUtils.lerp(mat.uniforms.uAudioHigh.value, freqs.high, 0.15);
    mat.uniforms.uWarp.value = THREE.MathUtils.lerp(mat.uniforms.uWarp.value, warpIntensity, 0.08);

    // Smooth Mouse Rotation
    const targetRotX = state.pointer.y * 0.4;
    const targetRotY = state.pointer.x * 0.4;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);
    mat.uniforms.uMouse.value.lerp(state.pointer, 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[65, 32, 32]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          varying vec3 vWorldPosition;
          uniform float uMass;
          uniform float uTime;
          uniform vec3  uCameraPos;
          uniform vec2  uMouse;
          uniform float uAudioBass;
          uniform float uAudioHigh;
          uniform float uWarp;

          float hash(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
          }

          float noise(vec3 x) {
            vec3 i = floor(x); vec3 f = fract(x);
            f = f*f*(3.0-2.0*f);
            return mix(
              mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),
              mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);
          }

          // Optimized 2-octave noise for high FPS on laptops & mobile
          float fbmFast(vec3 p) {
            float f = 0.65 * noise(p);
            p *= 2.05;
            f += 0.35 * noise(p);
            return f;
          }

          // Full background nebula noise
          float fbm(vec3 p) {
            float f = 0.5 * noise(p); p *= 2.02;
            f += 0.25 * noise(p); p *= 2.03;
            f += 0.125 * noise(p);
            return f;
          }

          // Fire color ramp: white-yellow inner -> deep orange -> dark red outer
          vec3 diskColor(float radial, float intensity) {
            vec3 innerHot  = vec3(1.0,  0.95, 0.75);
            vec3 midOrange = vec3(1.0,  0.42, 0.04);
            vec3 outerRed  = vec3(0.55, 0.04, 0.0);
            vec3 c;
            if (radial < 0.4) {
              c = mix(innerHot, midOrange, radial / 0.4);
            } else {
              c = mix(midOrange, outerRed, (radial - 0.4) / 0.6);
            }
            return c * intensity;
          }

          vec3 getBackground(vec3 rd) {
            vec3 p = rd * 2.2;
            float n = fbm(p + uTime * 0.012);
            vec3 colorA = vec3(0.005, 0.01, 0.06);
            vec3 colorB = vec3(0.08, 0.01, 0.12);
            float density = pow(n, 3.5) * 0.35;
            vec3 nebula = mix(colorA, colorB, n) * density;
            float sHash = hash(floor(rd * 600.0));
            float starInt = smoothstep(0.996, 1.0, sHash);
            starInt *= 0.6 + 0.4 * sin(uTime * 1.2 + sHash * 25.0);
            vec3 stars = vec3(1.1, 1.05, 1.3) * starInt;
            return nebula + stars;
          }

          void main() {
            vec3 ro = uCameraPos;
            vec3 rd = normalize(vWorldPosition - uCameraPos);

            float rs = uMass;
            vec3  p  = ro;
            vec3  v  = rd;
            vec3  L  = cross(p, v);
            float h2 = dot(L, L);
            vec3  col = vec3(0.0);

            // Optimized step count & step size for smooth 60fps on laptops, phones, and tablets
            for (int i = 0; i < 90; i++) {
              float r = length(p);

              // Solid black interior
              if (r < rs) {
                col = vec3(0.0);
                break;
              }

              float prevY = p.y;
              vec3  nextP = p + v * 0.40;

              // Accretion disk — crosses y=0 plane
              if (prevY * nextP.y < 0.0) {
                float t  = abs(prevY) / (abs(prevY) + abs(nextP.y));
                vec3  ip = mix(p, nextP, t);
                float d2 = length(ip);

                float innerR = rs * 2.0;
                float outerR = rs * 14.0;

                if (d2 > innerR && d2 < outerR) {
                  float phi    = atan(ip.z, ip.x);
                  float radial = (d2 - innerR) / (outerR - innerR);
                  float speed  = mix(3.5, 0.6, radial);

                  float diskN  = fbmFast(vec3(d2 * 0.35 - uTime * speed, phi * 5.0 + uTime * 0.3, uTime * 0.05));
                  float diskN2 = fbmFast(vec3(phi * 3.0 + d2 * 0.2 - uTime * speed * 0.7, d2 * 0.5, 0.5));
                  float turb   = mix(diskN, diskN2, 0.4);

                  // Bright inner, fade outer
                  float radialFade = exp(-radial * 2.8) * (1.0 - exp(-(1.0 - radial) * 8.0));
                  float intensity  = smoothstep(0.1, 0.8, turb) * radialFade;

                  // Audio-reactive flare on bass and high shimmer
                  float audioBoost = 1.0 + uAudioBass * 1.6;
                  intensity *= audioBoost;

                  // Extra photon ring glow near event horizon
                  float photon = exp(-pow((d2 - rs * 2.6) / (rs * 0.4), 2.0)) * 2.0;
                  photon *= (1.0 + uAudioHigh * 2.2);
                  intensity += photon * smoothstep(0.3, 0.7, diskN);

                  col += diskColor(radial, intensity * 1.3);
                }
              }

              // Edge glow around event horizon (photon sphere halo)
              {
                float rEdge = rs * 1.5;
                float glow  = exp(-abs(r - rEdge) / (rs * 0.55)) * (0.4 + uAudioBass * 0.5);
                col += vec3(1.0, 0.5 + uAudioBass * 0.2, 0.08 + uAudioHigh * 0.4) * glow;
              }

              vec3 accel = -1.5 * rs * h2 * p / pow(r, 5.0);
              v = normalize(v + accel * 0.40);
              p = nextP;

              if (r > 48.0) {
                col += getBackground(v);
                break;
              }
              if (i == 89) col += getBackground(v);
            }

            // Relativistic Doppler speed streaks & blue-shift distortion during warp plunge
            if (uWarp > 0.01) {
              float angle = atan(v.z, v.x);
              float streak = pow(abs(sin(angle * 6.0 + uTime * 16.0)), 10.0) * uWarp * 2.5;
              col += vec3(0.35, 0.75, 1.5) * streak;
              col.b += uWarp * 0.55;
              col.r = mix(col.r, col.r * 1.4, uWarp);
            }

            // Tone map
            col = 1.0 - exp(-col * 2.8);
            col.r = pow(col.r, 0.92);
            col.g = pow(col.g, 0.97);

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}