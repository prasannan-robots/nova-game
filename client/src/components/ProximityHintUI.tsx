import { useEffect, useState } from "react";
import { useSomaGame } from "@/lib/stores/useSomaGame";

export function ProximityHintUI() {
  const position = useSomaGame((state) => state.position);
  const npcs = useSomaGame((state) => state.npcs);
  const buildings = useSomaGame((state) => state.buildings);
  const interaction = useSomaGame((state) => state.interaction);
  const phase = useSomaGame((state) => state.phase);
  
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    if (interaction.isActive || phase !== "playing") {
      setHint(null);
      return;
    }

    let nearestHint: string | null = null;
    let minDistance = Infinity;

    // Check NPCs
    npcs.forEach((npc) => {
      const distance = Math.sqrt(
        Math.pow(position.x - npc.x, 2) + Math.pow(position.y - npc.y, 2)
      );

      if (distance < 2.5 && distance < minDistance) {
        minDistance = distance;
        if (npc.type === "clean") {
          nearestHint = "Press E to talk";
        } else if (npc.type === "addict") {
          nearestHint = "⚠️ DANGER - Stay away!";
        }
      }
    });

    // Check buildings
    buildings.forEach((building) => {
      const distance = Math.sqrt(
        Math.pow(position.x - building.x, 2) + Math.pow(position.y - building.y, 2)
      );

      if (distance < 5 && distance < minDistance) {
        minDistance = distance;
        if (building.type === "library") {
          nearestHint = "Press E to enter Library";
        } else if (building.type === "gym") {
          nearestHint = "Press E to exercise";
        }
      }
    });

    setHint(nearestHint);
  }, [position, npcs, buildings, interaction.isActive, phase]);

  if (!hint) return null;

  const isDanger = hint.includes("DANGER");

  return (
    <div className={`fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 px-6 py-3 rounded-lg font-bold text-lg ${
      isDanger
        ? "bg-red-600 text-white animate-pulse"
        : "bg-white text-black border-2 border-black"
    }`}>
      {hint}
    </div>
  );
}
