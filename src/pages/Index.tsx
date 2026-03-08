import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import InteractiveLetter from "@/components/InteractiveCube";

const Index = () => {
  return (
    <div className="w-screen h-screen" style={{ background: "#000" }}>
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <gridHelper args={[20, 20, "#444444", "#222222"]} />
        <axesHelper args={[6]} />
        <InteractiveLetter />
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
};

export default Index;
