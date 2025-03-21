import { useState } from "react";

const assistants = [
  { name: "Liam", role: "YouTube Script Writer", icon: "\uD83C\uDFAC" },
  { name: "Olivia", role: "Email Writer & Reply Assistant", icon: "\uD83D\uDCE9" },
  { name: "Emma", role: "Grammar Fixer", icon: "\u270D\uFE0F" }
];

export default function Dashboard() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gray-100 p-4 border-r flex flex-col">
        <button className="w-full bg-black text-white py-2 rounded-lg mb-4">
          + Add new Assistant
        </button>
        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 mb-4 border rounded-lg"
        />
        <div className="space-y-2">
          {assistants.map((assistant, index) => (
            <div
              key={index}
              className={`flex items-center p-3 rounded-lg cursor-pointer ${
                selected === index ? "bg-gray-300" : "hover:bg-gray-200"
              }`}
              onClick={() => setSelected(index)}
            >
              <span className="text-xl mr-3">{assistant.icon}</span>
              <div>
                <p className="font-semibold">{assistant.name}</p>
                <p className="text-sm text-gray-600">{assistant.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto border-t pt-4">
          <p className="text-sm text-gray-600">Prince Kumar <span className="text-blue-600">(free plan)</span></p>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        <h1 className="text-2xl font-bold text-center mb-4">How can I Assist You?</h1>
        <div className="space-y-3">
          <button className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            📄 Can you write a formal email for a job application?
          </button>
          <button className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            🙏 How do I politely decline an invitation via email?
          </button>
          <button className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            ⏳ Can you help me write a follow-up email?
          </button>
          <button className="w-full text-left p-3 bg-gray-100 rounded-lg hover:bg-gray-200">
            🎓 How do I start an email to a professor?
          </button>
        </div>
        <div className="mt-auto border-t pt-4 flex items-center">
          <input
            type="text"
            placeholder="Start typing here..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button className="ml-2 bg-black text-white p-2 rounded-lg">➤</button>
        </div>
      </div>
    </div>
  );
}
