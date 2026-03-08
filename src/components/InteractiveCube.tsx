import { useRef, useEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text3D, Center } from "@react-three/drei";
import * as THREE from "three";

const RANGE = 5;
const LERP_FACTOR = 0.08;
const Y_AMPLITUDE = 1.2;
const Y_FREQUENCY = 1.5;
const KEY_SPEED = 0.15;
const TRAIL_LENGTH = 12;
const TRAIL_INTERVAL = 0.04; // seconds between trail snapshots

export default function InteractiveLetter() {
  const groupRef = useRef<THREE.Group>(null!);
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const keys = useRef({ left: false, right: false, up: false, down: false });

  // Trail state
  const trailRefs = useRef<THREE.Mesh[]>([]);
  const trailPositions = useRef<THREE.Vector3[]>(
    Array.from({ length: TRAIL_LENGTH }, () => new THREE.Vector3(0, 0, 0))
  );
  const trailRotations = useRef<number[]>(Array(TRAIL_LENGTH).fill(0));
  const lastTrailTime = useRef(0);

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

  const trailMaterials = useMemo(
    () =>
      Array.from({ length: TRAIL_LENGTH }, (_, i) => {
        const opacity = ((TRAIL_LENGTH - i) / TRAIL_LENGTH) * 0.35;
        return new THREE.MeshStandardMaterial({
          color: new THREE.Color("lime"),
          transparent: true,
          opacity,
          depthWrite: false,
        });
      }),
    []
  );

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

    // Update trail
    const t = clock.elapsedTime;
    if (t - lastTrailTime.current > TRAIL_INTERVAL) {
      lastTrailTime.current = t;
      // Shift trail positions
      for (let i = TRAIL_LENGTH - 1; i > 0; i--) {
        trailPositions.current[i].copy(trailPositions.current[i - 1]);
        trailRotations.current[i] = trailRotations.current[i - 1];
      }
      trailPositions.current[0].copy(groupRef.current.position);
      trailRotations.current[0] = groupRef.current.rotation.y;
    }

    // Apply trail mesh transforms
    trailRefs.current.forEach((mesh, i) => {
      if (mesh) {
        mesh.position.copy(trailPositions.current[i]);
        mesh.rotation.y = trailRotations.current[i];
      }
    });
  });

  return (
    <>
      {/* Trail ghosts */}
      {trailMaterials.map((mat, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) trailRefs.current[i] = el as unknown as THREE.Mesh;
          }}
        >
          <Center>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={1.5}
              height={0.4}
              bevelEnabled
              bevelThickness={0.05}
              bevelSize={0.02}
              material={mat}
            >
              MK
            </Text3D>
          </Center>
        </group>
      ))}

      {/* Main letter */}
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
    </>
  );
}
