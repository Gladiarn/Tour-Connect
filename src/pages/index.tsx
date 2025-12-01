import dynamic from "next/dynamic";

const Destinations = dynamic(() => import("@/components/Destinations/Destinations"), {
  loading: () => <div>Loading...</div>
});
const Packages = dynamic(() => import("@/components/Packages/Packages"), {
  loading: () => <div>Loading...</div>
});
const PopularDestinations = dynamic(() => import("@/components/PopularDestinations/PopularDestinations"), {
  loading: () => <div>Loading...</div>
});

import Landing from "@/components/Landing/Home";
import First from "@/components/Messages/First";
import { useSection } from "@/context/SectionContext";

export default function Home() {
  const {activeSection} = useSection();

  const sectionComponents = {
    "packages": <Packages />,
    "destinations": <Destinations />,
    "popular" : <PopularDestinations/>
  }


  return (
    <div className="bg-white">
      <Landing />
      <First />
      
    {
      sectionComponents[activeSection] || <div>Loading Component...</div>
    }
    
    </div>
  );
}
