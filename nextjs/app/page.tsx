import Banner from "@/components/sections/Banner";
import HomeStorefront from "@/components/sections/HomeStorefront";
import Service from "@/components/sections/Service";

export default function Home() {
  return (
    <main className="text-neutral-950">
      <Banner />
      <HomeStorefront />
      <Service />
    </main>
  );
}
