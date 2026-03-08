import { Canvas } from "@react-three/fiber";
import InteractiveLetter from "@/components/InteractiveCube";

const Index = () => {
  return (
    <div className="w-screen h-screen" style={{ background: "#d4ff00" }} tabIndex={0}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        {/* Ambient fill */}
        <ambientLight intensity={0.3} />

        {/* Key light - warm from top-right */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {/* Fill light - cool from left */}
        <directionalLight position={[-4, 3, 2]} intensity={0.6} color="#8899ff" />

        {/* Rim/back light */}
        <pointLight position={[0, 3, -5]} intensity={1} color="#ffcc44" />

        {/* Bottom accent */}
        <pointLight position={[0, -3, 2]} intensity={0.4} color="#d4ff00" />

        <InteractiveLetter />
      </Canvas>
    </div>
  );
};

export default Index;
