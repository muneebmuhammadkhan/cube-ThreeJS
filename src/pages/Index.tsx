import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import InteractiveCube from "@/components/InteractiveCube";

const Index = () => {
  return (
    <div className="w-screen h-screen bg-black">
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />

        {/* Spatial helpers so 3D motion is clearly visible */}
        <gridHelper args={[20, 20, "#444444", "#222222"]} />
        <axesHelper args={[6]} />

        {/* The interactive cube */}
        <InteractiveCube />

        {/* Allow orbiting the camera for different perspectives */}
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Index;
