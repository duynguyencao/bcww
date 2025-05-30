import { BrowserRouter as Router } from "react-router-dom";
import AppLayout from "./components/AppLayout/AppLayout";
import "./styles.css";

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
