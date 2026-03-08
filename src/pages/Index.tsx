import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import InteractiveLetter from "@/components/InteractiveCube";

const Index = () => {
  return (
    <div className="w-screen h-screen" style={{ background: "#000010" }} tabIndex={0}>
      <Canvas
        camera={{ position: [0, 2, 8], fov: 45 }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        {/* Galaxy background */}
        <color attach="background" args={["#000010"]} />
        <fog attach="fog" args={["#000020", 10, 40]} />
        <Stars radius={50} depth={60} count={3000} factor={5} saturation={0.8} fade speed={1.5} />

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

        {/* Purple nebula accent */}
        <pointLight position={[-5, -2, -3]} intensity={0.8} color="#9b59b6" />
        <pointLight position={[4, -1, 3]} intensity={0.5} color="#3498db" />

        <InteractiveLetter />
      </Canvas>
    </div>
  );
};

export default Index;
