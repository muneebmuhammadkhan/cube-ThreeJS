import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import InteractiveLetter from "@/components/InteractiveCube";

const Index = () => {
  return (
    <div className="w-screen h-screen" style={{ background: "#000" }} tabIndex={0}>
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
        style={{ width: "100%", height: "100%" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1} />
        <InteractiveLetter />
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
            intensity={1.5}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
};

export default Index;
