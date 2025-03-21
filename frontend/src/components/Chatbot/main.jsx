
import ReactDOM from 'react-dom/client'
import Chatapp from './Chatapp.jsx'
import './index.css'
import ContextProvider from './context/Context.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
	<ContextProvider>
		<Chatapp />
	</ContextProvider>
);
