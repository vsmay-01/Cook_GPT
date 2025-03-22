import React from "react";

export default function Loader({ type = "spinner" }) {
  return (
    <div className="flex items-center justify-center p-4">
      {type === "spinner" ? (
        <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      ) : (
        <div className="w-20 h-2 bg-gray-200 relative overflow-hidden">
          <div className="absolute w-1/2 h-full bg-blue-500 animate-pulse"></div>
        </div>
      )}
    </div>
  );
}
