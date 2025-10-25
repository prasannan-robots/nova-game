import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useSomaGame, type NPC, type Building, type InteractionType } from "@/lib/stores/useSomaGame";

enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
  interact = "interact",
}

interface NearestInteraction {
  type: InteractionType;
  target: NPC | Building;
  distance: number;
}

export function ProximityManager() {
  const position = useSomaGame((state) => state.position);
  const npcs = useSomaGame((state) => state.npcs);
  const buildings = useSomaGame((state) => state.buildings);
  const interaction = useSomaGame((state) => state.interaction);
  const startInteraction = useSomaGame((state) => state.startInteraction);
  
  const [, getKeys] = useKeyboardControls<Controls>();
  const nearestRef = useRef<NearestInteraction | null>(null);

  useFrame(() => {
    if (interaction.isActive) return;

    let nearest: NearestInteraction | null = null;
    let minDistance = Infinity;

    // Check proximity to NPCs
    npcs.forEach((npc) => {
      const distance = Math.sqrt(
        Math.pow(position.x - npc.x, 2) + Math.pow(position.y - npc.y, 2)
      );

      if (distance < 2.5 && distance < minDistance) {
        minDistance = distance;
        if (npc.type === "clean") {
          nearest = { type: "conversation" as InteractionType, target: npc, distance };
        }
      }
    });

    // Check proximity to buildings
    buildings.forEach((building) => {
      const distance = Math.sqrt(
        Math.pow(position.x - building.x, 2) + Math.pow(position.y - building.y, 2)
      );

      if (distance < 5 && distance < minDistance) {
        minDistance = distance;
        if (building.type === "library") {
          nearest = { type: "library" as InteractionType, target: building, distance };
        } else if (building.type === "gym") {
          nearest = { type: "exercise" as InteractionType, target: building, distance };
        }
      }
    });

    nearestRef.current = nearest;

    // Check for interact key press
    const { interact } = getKeys();
    if (interact && nearest) {
      startInteraction(nearest.type, nearest.target);
    }
  });

  // Render proximity hint
  return nearestRef.current ? (
    <group position={[position.x, position.y, 2]}>
      <sprite scale={[1.5, 0.5, 1]}>
        <spriteMaterial color="#FFFFFF" opacity={0.8} />
      </sprite>
    </group>
  ) : null;
}
