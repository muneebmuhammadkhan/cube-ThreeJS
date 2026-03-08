import { Canvas } from "@react-three/fiber";
import InteractiveLetter from "@/components/InteractiveCube";

const Index = () => {
  return (
    <div className="w-screen h-screen" style={{ background: "#d4ff00" }} tabIndex={0}>
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <InteractiveLetter />
      </Canvas>
    </div>
  );
};

export default Index;
