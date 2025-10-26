import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useSomaGame, type NPC } from "@/lib/stores/useSomaGame";
import * as THREE from "three";

interface NPCCharacterProps {
  npc: NPC;
}

export function NPCCharacter({ npc }: NPCCharacterProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const position = useSomaGame((state) => state.position);
  const startInteraction = useSomaGame((state) => state.startInteraction);
  const stats = useSomaGame((state) => state.stats);
  
  // Load appropriate sprite based on NPC type
  const addictTexture = useTexture("/sprites/Pixel_art_addict_NPC_sprite_747696e9.png");
  const cleanTexture = useTexture("/sprites/Pixel_art_clean_NPC_sprite_e5d1edc2.png");
  
  // Set pixel-perfect filtering for crisp pixel art
  useEffect(() => {
    if (addictTexture) {
      addictTexture.magFilter = THREE.NearestFilter;
      addictTexture.minFilter = THREE.NearestFilter;
    }
    if (cleanTexture) {
      cleanTexture.magFilter = THREE.NearestFilter;
      cleanTexture.minFilter = THREE.NearestFilter;
    }
  }, [addictTexture, cleanTexture]);
  
  const texture = npc.type === "addict" ? addictTexture : cleanTexture;
  
  // Pre-calculate random idle animation offset to avoid Math.random() in render
  const idleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (!spriteRef.current) return;

    // Idle bobbing animation
    const time = state.clock.getElapsedTime();
    spriteRef.current.position.z = 0.5 + Math.sin(time * 2 + idleOffset) * 0.1;

    // Check proximity to player
    const distance = Math.sqrt(
      Math.pow(position.x - npc.x, 2) + Math.pow(position.y - npc.y, 2)
    );

    // If close to player, trigger interaction possibility
    if (distance < 2.5) {
      if (npc.type === "addict") {
        // Temptation zone - check if dopamine is too low to resist
        if (stats.dopamine < 30 && distance < 1.5) {
          // Auto-trigger temptation if very close and low dopamine
          startInteraction("temptation", npc);
        }
      }
    }
  });

  return (
    <group position={[npc.x, npc.y, 0]}>
      <sprite ref={spriteRef} position={[0, 0, 0.5]} scale={[1.2, 1.2, 1]}>
        <spriteMaterial map={texture} transparent />
      </sprite>
      {/* Shadow indicator */}
      <mesh position={[0, 0, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
