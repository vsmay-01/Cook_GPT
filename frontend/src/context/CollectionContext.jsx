import React, { createContext, useState, useContext } from "react";

const CollectionContext = createContext();

export const CollectionProvider = ({ children }) => {
  const [collectionName, setCollectionName] = useState("");

  return (
    <CollectionContext.Provider value={{ collectionName, setCollectionName }}>
      {children}
    </CollectionContext.Provider>
  );
};

export const useCollection = () => useContext(CollectionContext);
