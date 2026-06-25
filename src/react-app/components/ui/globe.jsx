"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Color, Fog, Scene, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { Canvas, extend, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { globeFeatures } from "@/react-app/data/globe";

extend({ ThreeGlobe });

const RING_PROPAGATION_SPEED = 3;
const CAMERA_Z = 470;

function Globe({ globeConfig, data }) {
  const globeRef = useRef(null);
  const groupRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = useMemo(
    () => ({
      pointSize: 1,
      atmosphereColor: "#ffffff",
      showAtmosphere: true,
      atmosphereAltitude: 0.1,
      polygonColor: "rgba(255,255,255,0.7)",
      globeColor: "#1d072e",
      emissive: "#000000",
      emissiveIntensity: 0.1,
      shininess: 0.9,
      arcTime: 2000,
      arcLength: 0.9,
      rings: 1,
      maxRings: 3,
      ...globeConfig,
    }),
    [globeConfig],
  );

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
  }, [
    defaultProps.emissive,
    defaultProps.emissiveIntensity,
    defaultProps.globeColor,
    defaultProps.shininess,
    isInitialized,
  ]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data.length) return;

    const points = [];
    data.forEach((arc) => {
      points.push({ size: defaultProps.pointSize, order: arc.order, color: arc.color, lat: arc.startLat, lng: arc.startLng });
      points.push({ size: defaultProps.pointSize, order: arc.order, color: arc.color, lat: arc.endLat, lng: arc.endLng });
    });

    const filteredPoints = points.filter(
      (point, index, array) =>
        array.findIndex((candidate) => candidate.lat === point.lat && candidate.lng === point.lng) === index,
    );

    globeRef.current
      .hexPolygonsData(globeFeatures)
      .hexPolygonResolution(3)
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    globeRef.current
      .arcsData(data)
      .arcStartLat((arc) => arc.startLat)
      .arcStartLng((arc) => arc.startLng)
      .arcEndLat((arc) => arc.endLat)
      .arcEndLng((arc) => arc.endLng)
      .arcColor((arc) => arc.color)
      .arcAltitude((arc) => arc.arcAlt)
      .arcStroke((arc) => [0.32, 0.28, 0.3][arc.order % 3])
      .arcDashLength(defaultProps.arcLength)
      .arcDashInitialGap((arc) => arc.order)
      .arcDashGap(15)
      .arcDashAnimateTime(() => defaultProps.arcTime);

    globeRef.current
      .pointsData(filteredPoints)
      .pointColor((point) => point.color)
      .pointsMerge(true)
      .pointAltitude(0)
      .pointRadius(2);

    globeRef.current
      .ringsData([])
      .ringColor(() => defaultProps.polygonColor)
      .ringMaxRadius(defaultProps.maxRings)
      .ringPropagationSpeed(RING_PROPAGATION_SPEED)
      .ringRepeatPeriod((defaultProps.arcTime * defaultProps.arcLength) / defaultProps.rings);
  }, [data, defaultProps, isInitialized]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data.length) return undefined;

    const interval = window.setInterval(() => {
      if (!globeRef.current) return;

      const activeRingIndexes = genRandomNumbers(0, data.length, Math.floor((data.length * 4) / 5));
      const ringsData = data
        .filter((_, index) => activeRingIndexes.includes(index))
        .map((arc) => ({ lat: arc.startLat, lng: arc.startLng, color: arc.color }));

      globeRef.current.ringsData(ringsData);
    }, 2000);

    return () => window.clearInterval(interval);
  }, [data, isInitialized]);

  return <group ref={groupRef} />;
}

function WebGLRendererConfig() {
  const { gl, size } = useThree();

  useEffect(() => {
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setSize(size.width, size.height);
    gl.setClearColor(0x05070d, 1);
  }, [gl, size.height, size.width]);

  return null;
}

export function World(props) {
  const { globeConfig } = props;
  const scene = useMemo(() => {
    const nextScene = new Scene();
    nextScene.fog = new Fog(0xffffff, 400, 2000);
    return nextScene;
  }, []);

  return (
    <Canvas className="!bg-[#05070D]" scene={scene} camera={{ fov: 46, aspect: 1.2, near: 180, far: 1800, position: [0, 0, CAMERA_Z] }}>
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight color={globeConfig.directionalLeftLight} position={new Vector3(-400, 100, 400)} />
      <directionalLight color={globeConfig.directionalTopLight} position={new Vector3(-200, 500, 200)} />
      <pointLight color={globeConfig.pointLight} position={new Vector3(-200, 500, 200)} intensity={0.8} />
      <Globe {...props} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={CAMERA_Z}
        maxDistance={CAMERA_Z}
        autoRotate={globeConfig.autoRotate ?? true}
        autoRotateSpeed={globeConfig.autoRotateSpeed ?? 1}
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}

function genRandomNumbers(min, max, count) {
  const numbers = [];
  while (numbers.length < count) {
    const value = Math.floor(Math.random() * (max - min)) + min;
    if (!numbers.includes(value)) numbers.push(value);
  }

  return numbers;
}
