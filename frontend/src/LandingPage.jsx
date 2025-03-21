import { motion } from "framer-motion";
import CustomCursor from "./components/CustomCursor";  // Import Cursor
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";

// Scroll Reveal Animation Variant
const revealVariant = {
  hidden: { opacity: 0, y: 50 },  // Start faded & moved down
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const LandingPage = () => {
  return (
    <div className="relative">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        Your browser does not support the video tag.
      </video>

      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6 relative z-10">
        <motion.div 
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <HeroSection />
        </motion.div>

        <motion.div 
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <FeatureSection />
        </motion.div>

        <motion.div 
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Workflow />
        </motion.div>

        <motion.div 
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Pricing />
        </motion.div>

        <motion.div 
          variants={revealVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Footer />
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
