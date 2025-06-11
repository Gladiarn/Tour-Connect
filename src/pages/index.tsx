import Destinations from "@/components/Destinations/Destinations";
import Landing from "@/components/Landing/Home";
import First from "@/components/Messages/First";
import Packages from "@/components/Packages/Packages";
import Popular from "@/components/Popular/Popular";
import { useSection } from "@/context/SectionContext";

export default function Home() {
  const {activeSection} = useSection();

  const sectionComponents = {
    "packages": <Packages />,
    "destinations": <Destinations />,
    "popular" : <Popular />,
  }
  return (
    <div className="bg-[url]">
      <Landing />
      <First />
    {
      activeSection in sectionComponents ? sectionComponents[activeSection] : null
    }
    
    </div>
  );
}
