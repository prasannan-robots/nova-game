import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrthographicCamera } from "@react-three/drei";
import { Suspense } from "react";
import { Player } from "./Player";
import { GameWorld } from "./GameWorld";
import { StatsUI } from "./StatsUI";
import { InteractionUI } from "./InteractionUI";
import { IntroScreen } from "./IntroScreen";
import { ProximityManager } from "./ProximityManager";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  interact = "interact",
}

const keyMap = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
  { name: Controls.interact, keys: ["KeyE", "Space"] },
];

export function GameScene() {
  return (
    <>
      <IntroScreen />
      <KeyboardControls map={keyMap}>
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
          <Canvas shadows>
            {/* Orthographic camera for 2D top-down view */}
            <OrthographicCamera
              makeDefault
              position={[0, 0, 50]}
              zoom={15}
              near={0.1}
              far={1000}
            />

            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 10, 10]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />

            <Suspense fallback={null}>
              <GameWorld />
              <Player />
              <ProximityManager />
            </Suspense>
          </Canvas>

          {/* UI Overlays */}
          <StatsUI />
          <InteractionUI />
        </div>
      </KeyboardControls>
    </>
  );
}
