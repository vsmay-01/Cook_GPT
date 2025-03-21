import { motion } from "framer-motion";
import CustomCursor from "./components/CustomCursor";  // Import Cursor
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";

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
        <motion.div>
          <HeroSection />
        </motion.div>
        <motion.div>
          <FeatureSection />
        </motion.div>
        <motion.div>
          <Workflow />
        </motion.div>
        <motion.div>
          <Pricing />
        </motion.div>
        <motion.div>
          <Footer />
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
