import { useState } from "react";

const assistants = [
  { name: "Liam", role: "YouTube Script Writer", icon: "\uD83C\uDFAC" },
  { name: "Olivia", role: "Email Writer & Reply Assistant", icon: "\uD83D\uDCE9" },
  { name: "Emma", role: "Grammar Fixer", icon: "\u270D\uFE0F" }
];

export default function Dashboard() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="flex h-screen w-full">
       
      {/* Chat Area */}
      <div className="flex-1 flex flex-col p-6">
        {/* <h1 className="text-2xl font-bold text-center mb-4">How can I Assist You?</h1> */}
        <div className="space-y-3">
       
        </div>
        <div className="mt-auto border-t pt-4 flex items-center w-full">
          <input
            type="text"
            placeholder="Start typing here..."
            className="flex-1 p-2 border rounded-lg w-[70%]"
          />
          <label className="ml-2 bg-gray-200 text-black p-2 rounded-lg cursor-pointer">
            📁
            <input
              type="file"
              className="hidden"
              onChange={(e) => console.log(e.target.files[0])}
            />
          </label>
          <button className="ml-2 bg-black text-white p-2 rounded-lg">➤</button>
        </div>
      </div>
    </div>
  );
}
