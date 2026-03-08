import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RANGE = 5;
const LERP_FACTOR = 0.08;
const Y_AMPLITUDE = 1.2;
const Y_FREQUENCY = 1.5;
const KEY_SPEED = 0.15;

export default function InteractiveLetter() {
  const groupRef = useRef<THREE.Group>(null!);
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef({ left: false, right: false, up: false, down: false });
  const thrusterRef1 = useRef<THREE.Mesh>(null!);
  const thrusterRef2 = useRef<THREE.Mesh>(null!);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.current.left = true;
      if (e.key === "ArrowRight") keys.current.right = true;
      if (e.key === "ArrowUp") keys.current.up = true;
      if (e.key === "ArrowDown") keys.current.down = true;
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") keys.current.left = false;
      if (e.key === "ArrowRight") keys.current.right = false;
      if (e.key === "ArrowUp") keys.current.up = false;
      if (e.key === "ArrowDown") keys.current.down = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useFrame((state) => {
    const { pointer, clock } = state;
    const k = keys.current;

    if (k.left) target.current.x -= KEY_SPEED;
    if (k.right) target.current.x += KEY_SPEED;
    if (k.up) target.current.z -= KEY_SPEED;
    if (k.down) target.current.z += KEY_SPEED;

    const mouseX = pointer.x * RANGE;
    const mouseZ = -pointer.y * RANGE;

    if (!k.left && !k.right) target.current.x = mouseX;
    if (!k.up && !k.down) target.current.z = mouseZ;

    target.current.x = THREE.MathUtils.clamp(target.current.x, -RANGE, RANGE);
    target.current.z = THREE.MathUtils.clamp(target.current.z, -RANGE, RANGE);

    const dist = Math.sqrt(target.current.x ** 2 + target.current.z ** 2) / RANGE;
    target.current.y =
      Math.sin(clock.elapsedTime * Y_FREQUENCY) * Y_AMPLITUDE + dist * 0.8;

    groupRef.current.position.lerp(target.current, LERP_FACTOR);
    groupRef.current.rotation.y += 0.008;

    // Thruster flicker
    const flicker = 0.7 + Math.sin(clock.elapsedTime * 30) * 0.3;
    if (thrusterRef1.current) thrusterRef1.current.scale.y = flicker;
    if (thrusterRef2.current) thrusterRef2.current.scale.y = flicker;
  });

  return (
    <group ref={groupRef} scale={0.8}>
      {/* Main fuselage */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.15, 0.5, 3, 8]} />
        <meshPhysicalMaterial color="#cccccc" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Cockpit dome */}
      <mesh position={[0, 0.15, -1]}>
        <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial color="#44aaff" metalness={0.3} roughness={0.1} transparent opacity={0.7} />
      </mesh>

      {/* Left wing */}
      <mesh position={[-1.2, 0, 0.3]} rotation={[0, 0, -0.15]}>
        <boxGeometry args={[2, 0.06, 1]} />
        <meshPhysicalMaterial color="#bbbbbb" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Right wing */}
      <mesh position={[1.2, 0, 0.3]} rotation={[0, 0, 0.15]}>
        <boxGeometry args={[2, 0.06, 1]} />
        <meshPhysicalMaterial color="#bbbbbb" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Left wing tip / cannon */}
      <mesh position={[-2.1, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.8, 6]} />
        <meshPhysicalMaterial color="#aaaaaa" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Right wing tip / cannon */}
      <mesh position={[2.1, 0, 0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 0.8, 6]} />
        <meshPhysicalMaterial color="#aaaaaa" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Rear fin - vertical */}
      <mesh position={[0, 0.4, 1.2]}>
        <boxGeometry args={[0.06, 0.7, 0.6]} />
        <meshPhysicalMaterial color="#cc3333" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Left rear stabilizer */}
      <mesh position={[-0.5, 0, 1.2]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.04, 0.4]} />
        <meshPhysicalMaterial color="#444455" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Right rear stabilizer */}
      <mesh position={[0.5, 0, 1.2]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.8, 0.04, 0.4]} />
        <meshPhysicalMaterial color="#444455" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Engine left */}
      <mesh position={[-0.4, -0.05, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.5, 8]} />
        <meshPhysicalMaterial color="#333344" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Engine right */}
      <mesh position={[0.4, -0.05, 1.3]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 0.5, 8]} />
        <meshPhysicalMaterial color="#333344" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Thruster glow left */}
      <mesh ref={thrusterRef1} position={[-0.4, -0.05, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.6, 8]} />
        <meshBasicMaterial color="#00ccff" transparent opacity={0.6} />
      </mesh>

      {/* Thruster glow right */}
      <mesh ref={thrusterRef2} position={[0.4, -0.05, 1.7]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.1, 0.6, 8]} />
        <meshBasicMaterial color="#00ccff" transparent opacity={0.6} />
      </mesh>

      {/* Accent stripe on fuselage */}
      <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.35, 2.5, 8]} />
        <meshBasicMaterial color="#c8ff00" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
