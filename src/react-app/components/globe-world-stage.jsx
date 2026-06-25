import { World } from "@/react-app/components/ui/globe";

export default function GlobeWorldStage({ data, globeConfig }) {
  return <World data={data} globeConfig={globeConfig} />;
}
