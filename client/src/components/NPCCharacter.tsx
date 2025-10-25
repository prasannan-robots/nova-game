import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useSomaGame, type NPC } from "@/lib/stores/useSomaGame";
import * as THREE from "three";

interface NPCCharacterProps {
  npc: NPC;
}

export function NPCCharacter({ npc }: NPCCharacterProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useSomaGame((state) => state.position);
  const startInteraction = useSomaGame((state) => state.startInteraction);
  const stats = useSomaGame((state) => state.stats);
  
  // Pre-calculate random idle animation offset to avoid Math.random() in render
  const idleOffset = useMemo(() => Math.random() * Math.PI * 2, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;

    // Idle bobbing animation
    const time = state.clock.getElapsedTime();
    meshRef.current.position.z = 0.5 + Math.sin(time * 2 + idleOffset) * 0.1;

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

  const color = npc.type === "addict" ? "#E74C3C" : "#2ECC71"; // Red for addicts, green for clean

  return (
    <group position={[npc.x, npc.y, 0]}>
      <mesh ref={meshRef} position={[0, 0, 0.5]}>
        <boxGeometry args={[0.8, 0.8, 1.2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Shadow indicator */}
      <mesh position={[0, 0, 0.01]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
