import Banner from "@/components/sections/Banner";
import HomeStorefront from "@/components/sections/HomeStorefront";
import Service from "@/components/sections/Service";

export default function Home() {
  return (
    <main className="bg-[#f8f6ef] text-neutral-950">
      <Banner />
      <HomeStorefront />
      <Service />
    </main>
  );
}
