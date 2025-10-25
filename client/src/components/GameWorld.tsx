import { useMemo } from "react";
import { useSomaGame } from "@/lib/stores/useSomaGame";
import { NPCCharacter } from "./NPCCharacter";
import { Building } from "./Building";
import * as THREE from "three";

export function GameWorld() {
  const npcs = useSomaGame((state) => state.npcs);
  const buildings = useSomaGame((state) => state.buildings);
  const initializeWorld = useSomaGame((state) => state.initializeWorld);

  // Initialize world on first render with useMemo
  const worldData = useMemo(() => {
    // Create NPCs - scattered around the world
    const npcList = [
      // Drug addicts (red) - mostly in the streets
      { id: "addict-1", type: "addict" as const, x: -15, y: -10 },
      { id: "addict-2", type: "addict" as const, x: -20, y: 5 },
      { id: "addict-3", type: "addict" as const, x: -8, y: -15 },
      { id: "addict-4", type: "addict" as const, x: 10, y: -18 },
      { id: "addict-5", type: "addict" as const, x: 5, y: -5 },
      { id: "addict-6", type: "addict" as const, x: -25, y: -20 },
      
      // Clean people (green) - near safe zones
      { id: "clean-1", type: "clean" as const, x: 18, y: 15, message: "Stay strong, you can do this!" },
      { id: "clean-2", type: "clean" as const, x: 25, y: 20, message: "I used to struggle too. Exercise helped me." },
      { id: "clean-3", type: "clean" as const, x: 22, y: 8, message: "Reading changed my life." },
      { id: "clean-4", type: "clean" as const, x: 15, y: 25, message: "One day at a time, friend." },
    ];

    // Create buildings
    const buildingList = [
      { id: "library-1", type: "library" as const, x: 20, y: 15, width: 6, height: 5 },
      { id: "gym-1", type: "gym" as const, x: 20, y: -10, width: 5, height: 4 },
      { id: "home-1", type: "home" as const, x: -30, y: 25, width: 4, height: 4 },
    ];

    return { npcs: npcList, buildings: buildingList };
  }, []);

  // Initialize world using proper state setter
  useMemo(() => {
    if (npcs.length === 0 && buildings.length === 0) {
      initializeWorld(worldData.npcs, worldData.buildings);
    }
  }, [npcs.length, buildings.length, initializeWorld, worldData])

  return (
    <group>
      {/* Ground plane - pixelated look */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 100, 10, 10]} />
        <meshStandardMaterial color="#2C3E50" wireframe={false} />
      </mesh>

      {/* Street grid pattern */}
      <gridHelper args={[100, 20, "#34495E", "#34495E"]} position={[0, 0, 0.01]} />

      {/* Safe zone indicator (around library and gym) */}
      <mesh position={[20, 15, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshBasicMaterial color="#27AE60" transparent opacity={0.2} />
      </mesh>

      {/* Danger zone indicator (streets with addicts) */}
      <mesh position={[-15, -10, 0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[12, 32]} />
        <meshBasicMaterial color="#E74C3C" transparent opacity={0.15} />
      </mesh>

      {/* Render NPCs */}
      {npcs.map((npc) => (
        <NPCCharacter key={npc.id} npc={npc} />
      ))}

      {/* Render Buildings */}
      {buildings.map((building) => (
        <Building key={building.id} building={building} />
      ))}
    </group>
  );
}
