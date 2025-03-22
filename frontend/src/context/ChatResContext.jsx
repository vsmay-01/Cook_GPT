import React, { createContext, useState } from "react";

export const ChatResContext = createContext();

export const ChatResProvider = ({ children }) => {
  const [rerankedDocuments, setRerankedDocuments] = useState([]);

  return (
    <ChatResContext.Provider value={{ rerankedDocuments, setRerankedDocuments }}>
      {children}
    </ChatResContext.Provider>
  );
};