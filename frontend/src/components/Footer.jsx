import { aiToolsLinks, integrationsLinks, supportLinks } from "../constants";

const Footer = () => {
  return (
    <footer className="mt-20 border-t border-neutral-700 bg-neutral-950 py-14 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-neutral-300">
        {/* AI Tools Section */}
        <div>
          <h3 className="text-xl font-semibold mb-5 text-white">AI Tools</h3>
          <ul className="space-y-3">
            {aiToolsLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Integrations Section */}
        <div>
          <h3 className="text-xl font-semibold mb-5 text-white">Integrations</h3>
          <ul className="space-y-3">
            {integrationsLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="hover:text-purple-400 transition-colors duration-300"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Support & Community Section */}
        <div>
          <h3 className="text-xl font-semibold mb-5 text-white">Support & Community</h3>
          <ul className="space-y-3">
            {supportLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.href}
                  className="hover:text-blue-400 transition-colors duration-300"
                >
                  {link.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom Text */}
      <p className="text-center text-neutral-500 mt-12 text-sm">
        🚀 Powered by AI. © {new Date().getFullYear()} CookAI. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
