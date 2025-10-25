import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useSomaGame } from "@/lib/stores/useSomaGame";
import * as THREE from "three";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  interact = "interact",
}

export function Player() {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useSomaGame((state) => state.position);
  const updatePosition = useSomaGame((state) => state.updatePosition);
  const incrementWalkingTime = useSomaGame((state) => state.incrementWalkingTime);
  const phase = useSomaGame((state) => state.phase);
  
  const [, getKeys] = useKeyboardControls<Controls>();
  
  const velocityRef = useRef({ x: 0, y: 0 });
  const isMovingRef = useRef(false);

  useEffect(() => {
    console.log("Player initialized at position:", position);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current || phase !== "playing") return;

    const { forward, back, left, right } = getKeys();
    
    // Movement speed
    const speed = 5;
    let targetVelX = 0;
    let targetVelY = 0;
    let moving = false;

    // Calculate target velocity based on input
    if (forward) {
      targetVelY = speed;
      moving = true;
    }
    if (back) {
      targetVelY = -speed;
      moving = true;
    }
    if (left) {
      targetVelX = -speed;
      moving = true;
    }
    if (right) {
      targetVelX = speed;
      moving = true;
    }

    // Smooth movement
    velocityRef.current.x += (targetVelX - velocityRef.current.x) * 0.1;
    velocityRef.current.y += (targetVelY - velocityRef.current.y) * 0.1;

    // Update position
    const newX = position.x + velocityRef.current.x * delta;
    const newY = position.y + velocityRef.current.y * delta;

    // Boundary constraints (keep player in game area)
    const boundX = Math.max(-50, Math.min(50, newX));
    const boundY = Math.max(-50, Math.min(50, newY));

    if (boundX !== position.x || boundY !== position.y) {
      updatePosition(boundX, boundY);
    }

    // Update mesh position
    meshRef.current.position.set(boundX, boundY, 0.5);

    // Track walking for dopamine increase
    if (moving && !isMovingRef.current) {
      console.log("Player started moving");
      isMovingRef.current = true;
    } else if (!moving && isMovingRef.current) {
      console.log("Player stopped moving");
      isMovingRef.current = false;
    }

    if (moving) {
      incrementWalkingTime(delta);
    }
  });

  return (
    <mesh ref={meshRef} position={[position.x, position.y, 0.5]}>
      {/* Pixelated player - simple cube */}
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#4A90E2" />
    </mesh>
  );
}
