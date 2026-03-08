import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
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
    groupRef.current.rotation.y += 0.01;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          size={1.5}
          height={0.4}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.02}
        >
          MK
          <meshStandardMaterial color="lime" />
        </Text3D>
      </Center>
    </group>
  );
}
