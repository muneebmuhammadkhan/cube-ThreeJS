import { useRef, useEffect } from "react";
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
    groupRef.current.rotation.y += 0.005;
  });

  // Rope positions (4 corners of basket to balloon edge)
  const ropeOffsets = [
    [0.25, 0, 0.25],
    [-0.25, 0, 0.25],
    [0.25, 0, -0.25],
    [-0.25, 0, -0.25],
  ] as const;

  return (
    <group ref={groupRef}>
      {/* Balloon envelope */}
      <mesh position={[0, 1.8, 0]}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* Balloon stripes */}
      <mesh position={[0, 1.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <sphereGeometry args={[1.21, 32, 32, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#f39c12" />
      </mesh>
      <mesh position={[0, 1.8, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <sphereGeometry args={[1.21, 32, 32, Math.PI, Math.PI * 0.5]} />
        <meshStandardMaterial color="#f39c12" />
      </mesh>

      {/* Balloon bottom skirt */}
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.6, 0.3, 0.3, 16]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>

      {/* Ropes */}
      {ropeOffsets.map(([x, , z], i) => {
        const points = [
          new THREE.Vector3(x * 3, 0.55, z * 3),
          new THREE.Vector3(x, -0.6, z),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        return (
          <line key={i} geometry={geometry}>
            <lineBasicMaterial color="#8B7355" linewidth={1} />
          </line>
        );
      })}

      {/* Basket */}
      <mesh position={[0, -0.85, 0]}>
        <cylinderGeometry args={[0.35, 0.3, 0.5, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Basket rim */}
      <mesh position={[0, -0.6, 0]}>
        <torusGeometry args={[0.35, 0.04, 8, 16]} />
        <meshStandardMaterial color="#A0522D" />
      </mesh>
    </group>
  );
}
