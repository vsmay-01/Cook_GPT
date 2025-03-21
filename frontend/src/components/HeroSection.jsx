import { motion } from "framer-motion";
import videoBg from "../assets/videobg.mp4";
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";


const HeroSection = () => {
  return (
    <div className="relative flex flex-col items-center mt-6 lg:mt-20 px-6 text-center">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        className="absolute top-0 left-0 w-full h-full object-cover -z-10"
      >
        {/* <source src={videoBg} type="video/mp4" /> */}
        Your browser does not support the video tag.
      </video>
      
      {/* Heading Animation */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl sm:text-6xl lg:text-7xl tracking-wide text-white"
      >
        Chat {" "}
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="bg-gradient-to-r from-orange-500 to-red-800 text-transparent bg-clip-text"
        >
          with Documents
        </motion.span>
      </motion.h1>

      {/* Subtitle Animation */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
        className="mt-6 text-lg text-neutral-300 max-w-3xl"
      >
        AI-powered tools to summarize, extract key insights, and chat with your PDFs effortlessly.
      </motion.p>

      {/* Call to Action Buttons */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
        className="flex justify-center mt-8 space-x-4"
      >
        <a
          href="#"
          className="bg-gradient-to-r from-orange-500 to-orange-800 text-white py-3 px-6 rounded-lg font-medium transition-transform hover:scale-105"
        >
          Start for Free
        </a>
        <a
          href="#"
          className="py-3 px-6 rounded-lg border border-neutral-700 text-neutral-300 hover:bg-neutral-800 transition-colors"
        >
          Documentation
        </a>
      </motion.div>

      {/* Videos Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.8 }}
        className="flex flex-col lg:flex-row items-center mt-12 gap-6"
      >
        <motion.video
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1 }}
          autoPlay
          loop
          muted
          className="rounded-xl w-full lg:w-1/2 border border-orange-700 shadow-md shadow-orange-500/40"
        >
          {/* <source src={video1} type="video/mp4" /> */}
          Your browser does not support the video tag.
        </motion.video>

        <motion.video
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 1.2 }}
          autoPlay
          loop
          muted
          className="rounded-xl w-full lg:w-1/2 border border-orange-700 shadow-md shadow-orange-500/40"
        >
          {/* <source src={video2} type="video/mp4" /> */}
          Your browser does not support the video tag.
        </motion.video>
      </motion.div>
    </div>
  );
};

export default HeroSection;
