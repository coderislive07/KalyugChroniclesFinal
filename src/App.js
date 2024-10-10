import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import AnimatedCursor from "react-animated-cursor";
import star2 from './assets/star2.svg'
import { auth } from "./firebaseconfig";
import { useAppStore } from "./store";
import  ContactPage  from '../src/Pages/Contact'

// Import all your components
import Footer from "./components/Footer";
import HeroPage from "./containers/HeroPage";
import OurTeam from "./containers/OurTeam";
import Overview from "./containers/Overview";
import Prizes from "./containers/Prizes";
import Socials from "./containers/Socials";
import Login from "./Pages/login";

function AppContent() {
  const { setUserInfo } = useAppStore();
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle Loading Animation
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const userProfile = user
        ? {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          }
        : null;

      setUserInfo(userProfile);
      setLoading(false);
      setAuthChecked(true);

      if (user) {
        setShowLoginPopup(false);
      } else {
        setShowLoginPopup(true);
      }
    });

    return () => unsubscribe();
  }, [setUserInfo]);

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const mainContent = (
    <>
      <HeroPage />
      <Prizes />
      <OurTeam />
      <Overview />
      <Socials />
      <Footer />
    </>
  );

  if (!authChecked) {
    return null; // or a loading spinner
  }

  return (
    <>
      <AnimatedCursor
        innerSize={8}
        outerSize={30}
        color="256, 256, 256"
        outerAlpha={0.2}
        innerScale={0.7}
        outerScale={3}
        clickables={[
          "a",
          "input[type='text']",
          "input[type='email']",
          "input[type='number']",
          "input[type='submit']",
          "input[type='image']",
          "label[for]",
          "select",
          "textarea",
          "button",
          ".link",
        ]}
      />

      {loading && window.innerWidth > 768 ? (
        <section className="md:flex hidden w-screen h-full overflow-hidden relative bg-black">
          <div className="h-screen flex items-center justify-center w-full ">
            <div className="flex w-full h-full items-center justify-center py-0 sm:py-2 md:py-4 lg:py-6">
              <marquee className="py-10 xs:py-12 rotate-[45deg] w-full h-full" scrollamount="15">
                <h1 className="flex items-center justify-center gap-4 text-2xl xs:text-3xl s:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#f2cc81] font-black">
                  ।।अतः अस्ति प्रारंभ ।। <img className="w-8 h-8" src={star2} alt="star2" /> Kalyug Chronicles
                </h1>
              </marquee>
            </div>
          </div>
        </section>
      ) : (
        <div className={showLoginPopup && location.pathname === "/" ? "filter blur-sm" : ""}>
          <Routes>
            <Route path="/konhaikali" element={mainContent} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={mainContent} />
            <Route path='/Contact'element={<ContactPage/>}/>
          </Routes>
        </div>
      )}

      {showLoginPopup && location.pathname === "/" && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Enter the Realm of Kalyug</h2>
            <p className="text-lg mb-6 text-gray-600">
              The chronicles of this age await your presence. Authenticate yourself to unveil the secrets of Kalyug.
            </p>
            <button
              onClick={handleLoginRedirect}
              className="px-6 py-3 bg-orange-500 text-white text-lg font-semibold rounded-md hover:bg-orange-600 transition duration-300 shadow-md"
            >
              Embark on Your Journey
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}