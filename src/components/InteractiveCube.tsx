import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

const RANGE = 5;
const LERP_FACTOR = 0.08;
const Y_AMPLITUDE = 1.2;
const Y_FREQUENCY = 1.5;

export default function InteractiveLetter() {
  const groupRef = useRef<THREE.Group>(null!);
  const target = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state) => {
    const { pointer, clock } = state;

    const targetX = pointer.x * RANGE;
    const targetZ = -pointer.y * RANGE;
    const dist = Math.sqrt(pointer.x ** 2 + pointer.y ** 2);
    const targetY =
      Math.sin(clock.elapsedTime * Y_FREQUENCY) * Y_AMPLITUDE + dist * 0.8;

    target.current.set(targetX, targetY, targetZ);
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
          M
          <meshStandardMaterial color="hsl(220, 80%, 55%)" />
        </Text3D>
      </Center>
    </group>
  );
}
