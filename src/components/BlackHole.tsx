import { useRef, useMemo, MutableRefObject } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function BlackHole3D({ mass = 2.2, spin, zoom, scrollRef }: { mass?: number, spin?: number, zoom?: number, scrollRef?: MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  const uniforms = useMemo(() => ({
    uTime:       { value: 0 },
    uMass:       { value: mass },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uCameraPos:  { value: new THREE.Vector3() },
    uMouse:      { value: new THREE.Vector2(0, 0) },
  }), [mass, size]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.getElapsedTime();
    mat.uniforms.uCameraPos.value.copy(state.camera.position);

    // Smooth Mouse Rotation (Controls the tilt/angle)
    const targetRotX = state.pointer.y * 0.4;
    const targetRotY = state.pointer.x * 0.4;
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.05);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.05);
    mat.uniforms.uMouse.value.lerp(state.pointer, 0.05);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[65, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPosition;
          void main() {
            // Respect the mesh rotation/mouse control
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

          float fbm(vec3 p) {
            float f = 0.5 * noise(p); p *= 2.02;
            f += 0.25 * noise(p); p *= 2.03;
            f += 0.125 * noise(p);
            return f;
          }

          // ---- UPDATED BACKGROUND (THINNER NEBULA) ----
          vec3 getBackground(vec3 rd) {
            vec3 p = rd * 2.2; 
            
            // Domain warping for nebula
            float n = fbm(p + fbm(p + uTime * 0.02));
            
            // Nebula Colors (Slightly more vibrant but darker base)
            vec3 colorA = vec3(0.01, 0.04, 0.15); // Deep space blue
            vec3 colorB = vec3(0.15, 0.02, 0.2);  // Deep magenta/purple
            
            // THINNING LOGIC:
            // Using pow(n, 4.0) makes the clouds very sparse and wispy.
            // A lower multiplier (0.4) ensures it doesn't wash out the screen.
            float density = pow(n, 4.0) * 0.4; 
            vec3 nebula = mix(colorA, colorB, n) * density;

            // Stars (Increased density slightly to compensate for thin nebula)
            float sHash = hash(floor(rd * 500.0));
            float starInt = smoothstep(0.997, 1.0, sHash);
            starInt *= 0.5 + 0.5 * sin(uTime * 1.5 + sHash * 20.0);
            vec3 stars = vec3(1.2, 1.2, 1.4) * starInt;

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

            for (int i = 0; i < 160; i++) {
              float r = length(p);
              if (r < rs) { col = vec3(0.0); break; }

              float prevY = p.y;
              vec3  nextP = p + v * 0.3;
              if (prevY * nextP.y < 0.0) {
                float t  = abs(prevY) / (abs(prevY) + abs(nextP.y));
                vec3  ip = mix(p, nextP, t);
                float d2 = length(ip);
                if (d2 > rs*2.4 && d2 < rs*11.0) {
                  float phi = atan(ip.z, ip.x);
                  float diskN = fbm(vec3(d2*0.4 - uTime*1.8, phi*4.0, 0.0));
                  float intensity = smoothstep(0.15, 0.85, diskN);
                  
                  // Boosted disk glow
                  vec3 fire = mix(vec3(1.0, 0.2, 0.0), vec3(1.0, 0.95, 0.7), intensity);
                  col += fire * intensity * 0.6; 
                }
              }

              vec3 accel = -1.5 * rs * h2 * p / pow(r, 5.0);
              v = normalize(v + accel * 0.3);
              p = nextP;

              if (r > 60.0) {
                col += getBackground(v);
                break;
              }
              if (i == 159) col += getBackground(v);
            }

            // Post-processing: Boosted exposure to make the glow stand out
            col = 1.0 - exp(-col * 2.5); 
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}