import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RANGE = 5;
const LERP_FACTOR = 0.08;
const Y_AMPLITUDE = 1.2;
const Y_FREQUENCY = 1.5;
const KEY_SPEED = 0.15;

function createBatShape() {
  const shape = new THREE.Shape();
  // Center body
  shape.moveTo(0, 0.3);
  // Head ears
  shape.lineTo(0.15, 0.8);
  shape.lineTo(0.25, 0.5);
  shape.lineTo(0.35, 0.9);
  shape.lineTo(0.4, 0.45);
  // Right wing top
  shape.lineTo(0.8, 0.6);
  shape.lineTo(1.4, 0.7);
  shape.lineTo(1.8, 0.5);
  shape.lineTo(2.0, 0.35);
  // Right wing tip
  shape.lineTo(2.2, 0.2);
  // Right wing bottom scallops
  shape.lineTo(1.7, 0.05);
  shape.lineTo(1.5, -0.15);
  shape.lineTo(1.1, 0.0);
  shape.lineTo(0.8, -0.2);
  shape.lineTo(0.5, -0.05);
  // Bottom center
  shape.lineTo(0.2, -0.3);
  shape.lineTo(0, -0.15);
  // Mirror left side
  shape.lineTo(-0.2, -0.3);
  shape.lineTo(-0.5, -0.05);
  shape.lineTo(-0.8, -0.2);
  shape.lineTo(-1.1, 0.0);
  shape.lineTo(-1.5, -0.15);
  shape.lineTo(-1.7, 0.05);
  shape.lineTo(-2.2, 0.2);
  shape.lineTo(-2.0, 0.35);
  shape.lineTo(-1.8, 0.5);
  shape.lineTo(-1.4, 0.7);
  shape.lineTo(-0.8, 0.6);
  shape.lineTo(-0.4, 0.45);
  shape.lineTo(-0.35, 0.9);
  shape.lineTo(-0.25, 0.5);
  shape.lineTo(-0.15, 0.8);
  shape.lineTo(0, 0.3);
  return shape;
}

export default function InteractiveLetter() {
  const groupRef = useRef<THREE.Group>(null!);
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef({ left: false, right: false, up: false, down: false });

  const batShape = useMemo(() => createBatShape(), []);
  const extrudeSettings = useMemo(
    () => ({
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.05,
      bevelSegments: 3,
    }),
    []
  );

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
    groupRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={groupRef} scale={1.5}>
      {/* Solid bat */}
      <mesh rotation={[0, 0, 0]} position={[0, -0.2, -0.2]}>
        <extrudeGeometry args={[batShape, extrudeSettings]} />
        <meshPhysicalMaterial
          color="#1a1a1a"
          metalness={0.7}
          roughness={0.3}
          clearcoat={0.4}
          clearcoatRoughness={0.2}
          emissive="#1a1a1a"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Lime outline - slightly larger */}
      <mesh rotation={[0, 0, 0]} position={[0, -0.2, -0.2]} scale={1.04}>
        <extrudeGeometry args={[batShape, { ...extrudeSettings, depth: 0.42 }]} />
        <meshBasicMaterial color="#c8ff00" side={THREE.BackSide} />
      </mesh>
    </group>
  );
}
