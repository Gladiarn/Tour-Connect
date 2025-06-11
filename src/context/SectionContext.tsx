import React, { createContext, ReactNode, useContext, useState } from "react";

type ActiveSection = "packages" | "destinations" | "popular";

interface SectionContextType {
  activeSection: ActiveSection;
  setActiveSection: (section: ActiveSection) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export const useSection = () => {
  const context = useContext(SectionContext);
  if (context === undefined) {
    throw new Error("useSection must be used within a SectionProvider");
  }
  return context;
};

interface SectionProviderProps {
  children: ReactNode;
}

export const SectionProvider: React.FC<SectionProviderProps> = ({
  children,
}) => {

  const [activeSection, setActiveSection] = useState<ActiveSection>("packages")
  return (
    <SectionContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </SectionContext.Provider>
  );
};
