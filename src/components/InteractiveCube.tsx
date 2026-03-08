import { useRef } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

/**
 * InteractiveCube — a cube that follows the mouse in 3D space.
 *
 * Mouse mapping:
 * - Mouse X (normalized -1 to 1) → Cube X position (scaled by a range factor)
 * - Mouse Y (normalized -1 to 1) → Cube Z position (depth, scaled and inverted)
 *
 * The Y (vertical) position is independent:
 * - A sine wave based on elapsed time provides gentle oscillation
 * - The distance of the cursor from screen center adds extra vertical lift,
 *   so moving to edges raises the cube higher
 *
 * Smooth motion is achieved via lerp (linear interpolation) each frame,
 * so the cube damps toward the target rather than snapping.
 */

const RANGE = 5; // max displacement in X and Z
const LERP_FACTOR = 0.08; // lower = smoother / slower follow
const Y_AMPLITUDE = 1.2; // sine wave amplitude
const Y_FREQUENCY = 1.5; // sine wave speed

export default function InteractiveCube() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const { pointer, clock } = state;

    // --- Convert 2D mouse to 3D target ---
    // pointer.x/y are normalised device coords in [-1, 1]
    const targetX = pointer.x * RANGE;
    const targetZ = -pointer.y * RANGE; // invert so "up" = further away

    // Distance from screen centre drives extra vertical lift
    const dist = Math.sqrt(pointer.x ** 2 + pointer.y ** 2);
    const targetY =
      Math.sin(clock.elapsedTime * Y_FREQUENCY) * Y_AMPLITUDE +
      dist * 0.8; // lift when cursor moves outward

    target.current.set(targetX, targetY, targetZ);

    // --- Smooth interpolation (lerp) toward target each frame ---
    meshRef.current.position.lerp(target.current, LERP_FACTOR);

    // Gentle rotation so the cube feels alive
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hsl(220, 80%, 55%)" />
    </mesh>
  );
}
