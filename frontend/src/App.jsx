import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import Workflow from "./components/Workflow";
import Footer from "./components/Footer";
import Pricing from "./components/Pricing";
import videoBg from "./assets/videoBg.mp4";
// import Testimonials from "./components/Testimonials";

const App = () => {
  return (
    <div className="relative">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        <source src={videoBg} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20 px-6 relative z-10">
        <HeroSection />
        <FeatureSection />
        <Workflow />
        <Pricing />
        {/* <Testimonials /> */}
        <Footer />
      </div>
    </div>
  );
};

export default App;
