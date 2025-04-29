import React, { useState } from "react";
import Navbar from "./components/Navbar"; // Navbar component
import AdminUpload from "./components/AdminUpload";
import AdminResults from "./components/AdminResults";
import DisclaimerEditor from "./components/DisclaimerEditor";
import QuestionList from "./components/QuestionList";
import AdminLogin from "./components/AdminLogin";
import AddLivePage from "./components/AddLivePage"; // ✅ import live page

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("login"); // Default page is login

  const renderPage = () => {
    if (!isLoggedIn) {
      return <AdminLogin onLogin={() => setIsLoggedIn(true)} />;
    }

    switch (activePage) {
      case "results":
        return <AdminResults />;
      case "upload":
        return <AdminUpload />;
      case "disclaimer":
        return <DisclaimerEditor />;
      case "questions":
        return <QuestionList />;
      case "live":
        return <AddLivePage />; // ✅ add live page here
      default:
        return <AdminResults />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full overflow-hidden flex flex-col">
      {/* Navbar - fixed at the top */}
      {isLoggedIn && (
        <div className="fixed w-full top-0 z-50">
          <Navbar setActivePage={setActivePage} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-grow mt-16 px-4 py-6">
        {/* Content container - full width with auto margin */}
        <div className="w-full h-full mx-auto px-4 sm:px-8">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
