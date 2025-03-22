import { CheckCircle2 } from "lucide-react";

const features = [
  "Instantly chat with your PDFs",
  "AI-powered summaries & insights",
  "Ask questions and get precise answers",
  "Supports multiple document formats",
  "Secure & private document handling",
];

const AIChatSection = () => {
  return (
    <div className="mt-20 text-white text-center">
      <h2 className="text-3xl sm:text-5xl lg:text-6xl my-8 tracking-wide">
        AI Chat for Documents and PDFs
      </h2>
      <p className="max-w-3xl mx-auto text-lg text-neutral-300">
        Upload your PDFs and interact with them like never before. AI extracts key insights, answers your queries, and makes document reading effortless.
      </p>

      <div className="flex flex-wrap justify-center mt-12">
        {features.map((feature, index) => (
          <div key={index} className="w-full sm:w-1/2 lg:w-1/3 p-4">
            <div className="p-6 border border-neutral-700 rounded-xl bg-neutral-900 flex items-center">
              <CheckCircle2 className="text-blue-400" />
              <span className="ml-3 text-neutral-300">{feature}</span>
            </div>
          </div>
        ))}
      </div>

      {/* <a
        href="#"
        className="inline-flex justify-center items-center text-center w-auto h-12 px-6 mt-12 tracking-tight text-xl border border-blue-500 rounded-lg transition duration-200 bg-gradient-to-r from-blue-500 to-purple-800 text-white hover:opacity-90"
      >
        Try for Free
      </a> */}
    </div>
  );
};

export default AIChatSection;
