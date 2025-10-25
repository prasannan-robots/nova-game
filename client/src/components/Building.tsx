import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useSomaGame, type Building as BuildingType } from "@/lib/stores/useSomaGame";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface BuildingProps {
  building: BuildingType;
}

export function Building({ building }: BuildingProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const position = useSomaGame((state) => state.position);
  const startInteraction = useSomaGame((state) => state.startInteraction);
  const interaction = useSomaGame((state) => state.interaction);
  
  const isNearRef = useRef(false);

  useFrame(() => {
    if (!meshRef.current) return;

    // Check proximity to player
    const distance = Math.sqrt(
      Math.pow(position.x - building.x, 2) + Math.pow(position.y - building.y, 2)
    );

    const isNear = distance < 3;
    
    if (isNear && !isNearRef.current) {
      isNearRef.current = true;
    } else if (!isNear && isNearRef.current) {
      isNearRef.current = false;
    }
  });

  const getBuildingColor = () => {
    switch (building.type) {
      case "library":
        return "#9B59B6"; // Purple
      case "gym":
        return "#E67E22"; // Orange
      case "home":
        return "#95A5A6"; // Gray
      default:
        return "#BDC3C7";
    }
  };

  const getBuildingLabel = () => {
    switch (building.type) {
      case "library":
        return "LIBRARY";
      case "gym":
        return "GYM";
      case "home":
        return "HOME";
      default:
        return "";
    }
  };

  return (
    <group position={[building.x, building.y, 0]}>
      <mesh ref={meshRef} position={[0, 0, building.type === "library" ? 2 : 1.5]}>
        <boxGeometry args={[building.width, building.height, building.type === "library" ? 4 : 3]} />
        <meshStandardMaterial color={getBuildingColor()} />
      </mesh>
      {/* Building label */}
      <Text
        position={[0, 0, building.type === "library" ? 4.5 : 3.5]}
        fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {getBuildingLabel()}
      </Text>
      {/* Base/foundation */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[building.width + 0.5, building.height + 0.5, 0.1]} />
        <meshStandardMaterial color="#34495E" />
      </mesh>
    </group>
  );
}
