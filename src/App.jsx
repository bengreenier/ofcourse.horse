import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, useGLTF, Center, Text3D } from "@react-three/drei";
import { Euler, Vector3 } from "three";
import { degToRad, randFloat } from "three/src/math/MathUtils";
import horseModelPath from "./assets/horse.gltf";
import interBoldFont from "./assets/Inter_Bold.json";

const horseNodeName = "16274_Morgan_Horse_Galloping_V1";
const horseScale = new Vector3(0.15, 0.15, 0.15);
const horsePosition = new Vector3(0, -1, -1);
const horseRotation = new Euler(degToRad(-90), degToRad(0), degToRad(0));
const textPosition = new Vector3(horsePosition.x - 0.7, horsePosition.y + 1, horsePosition.z + 1);
const miniHorseScale = new Vector3(0.05, 0.05, 0.05);
const mouseRotationScaler = 0.05;

const Scene = () => {
  const { viewport } = useThree();
  const { nodes } = useGLTF(horseModelPath);

  const ref = useRef();
  useFrame(({ mouse }) => {
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    ref.current.rotation.set(-y * mouseRotationScaler, x * mouseRotationScaler, 0);
  });

  /**
   * re-usable mini horse generator to avoid pasting the group a bunch
   * @param {Number} count
   * @returns
   */
  const randomMiniHorses = count => {
    const ret = [];
    for (let i = 0; i < count; i++) {
      ret.push(
        <group
          key={`${crypto.randomUUID()}-${i}`}
          rotation={[degToRad(randFloat(-90, 90)), degToRad(randFloat(-90, 90)), 0]}
          position={[randFloat(-2, 2), randFloat(-2, 2), randFloat(-2, 2)]}
        >
          <mesh scale={miniHorseScale} geometry={nodes[horseNodeName].geometry} castShadow receiveShadow>
            <meshNormalMaterial />
          </mesh>
        </group>
      );
    }

    return ret;
  };

  return (
    <group ref={ref}>
      <Float rotationIntensity={2}>
        <group rotation={horseRotation} position={horsePosition}>
          <mesh scale={horseScale} geometry={nodes[horseNodeName].geometry} castShadow receiveShadow>
            <meshNormalMaterial />
          </mesh>
        </group>
        <Center position={textPosition}>
          <Text3D letterSpacing={-0.06} size={0.5} font={interBoldFont}>
            ofc.
            <meshNormalMaterial />
          </Text3D>
        </Center>
        {randomMiniHorses(10)}
        <ambientLight />
      </Float>
    </group>
  );
};

const App = () => {
  return (
    <Canvas camera={{ fov: 70, position: [0, 0, 3] }}>
      <Scene />
    </Canvas>
  );
};

export default App;
