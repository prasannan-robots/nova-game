import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import { useSomaGame, type Building as BuildingType } from "@/lib/stores/useSomaGame";
import * as THREE from "three";

interface BuildingProps {
  building: BuildingType;
}

export function Building({ building }: BuildingProps) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const position = useSomaGame((state) => state.position);
  
  // Load building textures
  const libraryTexture = useTexture("/sprites/Pixel_art_library_building_24a57e21.png");
  const gymTexture = useTexture("/sprites/Pixel_art_gym_building_4a28435b.png");
  
  // Set pixel-perfect filtering for crisp pixel art
  useEffect(() => {
    if (libraryTexture) {
      libraryTexture.magFilter = THREE.NearestFilter;
      libraryTexture.minFilter = THREE.NearestFilter;
    }
    if (gymTexture) {
      gymTexture.magFilter = THREE.NearestFilter;
      gymTexture.minFilter = THREE.NearestFilter;
    }
  }, [libraryTexture, gymTexture]);
  
  const isNearRef = useRef(false);

  useFrame(() => {
    if (!spriteRef.current) return;

    // Check proximity to player
    const distance = Math.sqrt(
      Math.pow(position.x - building.x, 2) + Math.pow(position.y - building.y, 2)
    );

    const isNear = distance < 5;
    
    if (isNear && !isNearRef.current) {
      isNearRef.current = true;
    } else if (!isNear && isNearRef.current) {
      isNearRef.current = false;
    }
  });

  const getBuildingTexture = () => {
    switch (building.type) {
      case "library":
        return libraryTexture;
      case "gym":
        return gymTexture;
      default:
        return libraryTexture;
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

  const getBuildingColor = () => {
    switch (building.type) {
      case "library":
        return "#9B59B6";
      case "gym":
        return "#E67E22";
      case "home":
        return "#95A5A6";
      default:
        return "#BDC3C7";
    }
  };

  // Use sprite for library and gym, simple box for home
  if (building.type === "library" || building.type === "gym") {
    return (
      <group position={[building.x, building.y, 0]}>
        <sprite ref={spriteRef} position={[0, 0, 1.5]} scale={[building.width, building.height, 1]}>
          <spriteMaterial map={getBuildingTexture()} transparent />
        </sprite>
        {/* Building label */}
        <Text
          position={[0, 0, 3.5]}
          fontSize={0.5}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {getBuildingLabel()}
        </Text>
        {/* Base/foundation */}
        <mesh position={[0, 0, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[building.width + 0.5, building.height + 0.5]} />
          <meshBasicMaterial color="#34495E" transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }

  // Simple box for home
  return (
    <group position={[building.x, building.y, 0]}>
      <mesh position={[0, 0, 1.5]}>
        <boxGeometry args={[building.width, building.height, 3]} />
        <meshStandardMaterial color={getBuildingColor()} />
      </mesh>
      <Text
        position={[0, 0, 3.5]}
        fontSize={0.5}
        color="#FFFFFF"
        anchorX="center"
        anchorY="middle"
      >
        {getBuildingLabel()}
      </Text>
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[building.width + 0.5, building.height + 0.5, 0.1]} />
        <meshStandardMaterial color="#34495E" />
      </mesh>
    </group>
  );
}
