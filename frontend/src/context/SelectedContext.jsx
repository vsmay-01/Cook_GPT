import { createContext, useState } from "react";

export const SelectedCollectionContext = createContext(); // Ensure this is exported

export const SelectedCollectionProvider = ({ children }) => {
  const [selected, setSelected] = useState();

  return (
    <SelectedCollectionContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectedCollectionContext.Provider>
  );
};
