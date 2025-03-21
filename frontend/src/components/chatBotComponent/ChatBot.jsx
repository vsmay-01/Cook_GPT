import { useContext } from "react";
import { assets } from "../../assets/assets";
import MediaButtons from "./Mediabuttons";
import "./chatBot.css";
import { Context } from "./Context";

const Main = () => {
	const {
		onSent,
		recentPrompt,
		showResults,
		loading,
		resultData,
		setInput,
		input,
	} = useContext(Context);

	const handleCardClick = (promptText) => {
		setInput(promptText);
	};

	return (
		<div className="main">
			<div className="nav">
				<p>AI Document Assistant</p>
				<img src={assets.user} alt="User Profile" />
			</div>
			<div className="main-container">
				{!showResults ? (
					<>
						<div className="greet">
							<p>
								<span>Welcome Back</span>
							</p>
							<p>How can I help you process and analyze your documents today?</p>
						</div>
						<div className="cards">
							<div className="card" onClick={() => handleCardClick("Extract insights from a PDF containing images and links.")}>
								<p>Extract insights from a PDF containing images and links.</p>
								<img src={assets.compass_icon} alt="PDF Processing" />
							</div>
							<div className="card" onClick={() => handleCardClick("Summarize key data points from a CSV file.")}>
								<p>Summarize key data points from a CSV file.</p>
								<img src={assets.message_icon} alt="CSV Analysis" />
							</div>
							<div className="card" onClick={() => handleCardClick("Transcribe and analyze content from a voice file.")}>
								<p>Transcribe and analyze content from a voice file.</p>
								<img src={assets.bulb_icon} alt="Voice File Processing" />
							</div>
							<div className="card" onClick={() => handleCardClick("Fetch and structure data from web links, including nested links.")}>
								<p>Fetch and structure data from web links, including nested links.</p>
								<img src={assets.code_icon} alt="Web Data Extraction" />
							</div>
						</div>
					</>
				) : (
					<div className="result">
						<div className="result-title">
							<img src={assets.user} alt="User Query" />
							<p>{recentPrompt}</p>
						</div>
						<div className="result-data">
							<img src={assets.gemini_icon} alt="AI Response" />
							{loading ? (
								<div className="loader">
									<hr />
									<hr />
									<hr />
								</div>
							) : (
								<p dangerouslySetInnerHTML={{ __html: resultData }}></p>
							)}
						</div>
					</div>
				)}

				<div className="main-bottom">
					<div className="search-box">
						<input onChange={(e) => setInput(e.target.value)} value={input} type="text" placeholder="Ask me anything about your documents..." />
						<div>
							<MediaButtons assets={assets} />
							<img src={assets.send_icon} alt="Send Query" onClick={onSent} />
						</div>
					</div>
					<div className="bottom-info">
						<p>Our AI-powered assistant helps you process PDFs, CSVs, voice files, and web data efficiently. Ensure clear formatting for best results.</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatBot;
