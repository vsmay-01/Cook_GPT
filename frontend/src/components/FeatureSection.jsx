    import { features } from "../constants";

    const FeatureSection = () => {
      return (
        <div className="relative mt-20 border-b border-neutral-800 min-h-[800px] px-6" id="feature-section">
          {/* Header Section */}
          <div className="text-center max-w-4xl mx-auto">
            <span className="bg-neutral-900 text-blue-400 rounded-full h-6 text-sm font-medium px-3 py-1 uppercase">
              Features
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl mt-10 lg:mt-20 tracking-wide">
              Easily analyze{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                your document.
              </span>
            </h2>
            <p className="text-lg text-neutral-300 mt-4">
              AI-powered tools to summarize, extract, and understand your documents with ease.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-start bg-neutral-900 p-6 rounded-2xl shadow-lg hover:shadow-blue-500/40 transition-shadow duration-300"
              >
                <div className="flex-shrink-0 h-12 w-12 flex items-center justify-center bg-blue-500/20 text-blue-400 rounded-full">
                  {feature.icon}
                </div>
                <div className="ml-4">
                  <h5 className="text-xl font-semibold text-white">{feature.text}</h5>
                  <p className="text-md text-neutral-300 mt-2">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    };

    export default FeatureSection;
