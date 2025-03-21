import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const moveCursor = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", moveCursor);
    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, []);

  return (
    <motion.div
      className={`fixed top-0 left-0 w-6 h-6 rounded-full pointer-events-none z-50 transition-colors duration-300 ${
        isHovered ? "bg-purple-500 scale-125" : "bg-blue-400"
      }`}
      animate={{ x: position.x - 12, y: position.y - 12 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    />
  );
};

export default CustomCursor;
