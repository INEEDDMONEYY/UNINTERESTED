import './index.css';
import Home from './pages/homePage.jsx';
import ScrollToTop from "./components/ScrollToTop.jsx";

function App() {
  return (
    <>
      <ScrollToTop />
      <main>
        <div>
          <Home />
        </div>
      </main>
    </>
  );
}

export default App;