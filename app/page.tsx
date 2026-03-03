import AnimatedBackground from "@/components/AnimatedBackground";
import FormWidget from "@/components/FormWidget";

export default function Home() {
  return (
    <div className="grid place-content-center h-screen">
      <AnimatedBackground />
      <FormWidget />
    </div>
  );
}
