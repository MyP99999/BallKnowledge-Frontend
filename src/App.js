import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { LandingPage } from "./pages/LandingPage";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar fix */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navbar />
      </div>

      {/* Conținut: începe sub navbar */}
      <div className="">
        <LandingPage />
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Footer />
      </div>
    </div>
  );
}

export default App;
