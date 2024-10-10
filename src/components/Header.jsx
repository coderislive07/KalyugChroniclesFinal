import React, { useState, useRef } from "react";
import { HashLink } from "react-router-hash-link";
import { motion } from "framer-motion";
import logo from "../assets/favicon.png";
import cbsLogo from "../assets/CBS-White.png";
import { useAppStore } from "../store";
import ninja from "../assets/ninja.jpg";
import { signOut } from "firebase/auth";
import LoadingBar from "react-top-loading-bar";
import { auth } from "../firebaseconfig";
import { useNavigate } from "react-router";

export default function Header() {
  const { userInfo, setUserInfo } = useAppStore();
  const loadingBarRef = useRef(null);
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  // header
  const menuItems = [
    { name: "Home", link: "/#home" },
    { name: "Overview", link: "/#overview" },
    { name: "Prizes", link: "/#prizes" },
    { name: "Photos", link: "/#team" },
    { name: "Socials", link: "/#socials" },
    !userInfo ? { name: "Login", link: "/login" } : null,
  ].filter(Boolean);
  const handleLogout = () => {
    loadingBarRef.current.continuousStart();
  
    signOut(auth)
      .then(() => {
        setUserInfo(null);
        setShowLogoutModal(false);
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout error:", error);
      })
      .finally(() => {
        loadingBarRef.current.complete();
      });
  };
  
  return (
    <header className="w-full bg-[#311207] text-[#f2cc81]">
          <LoadingBar color="#EA2121" ref={loadingBarRef} />
      <nav className="container mx-auto px-2 sm:px-4 py-4 flex justify-between items-center">
        <HashLink smooth to="/#home" className="flex items-center space-x-2">
          <img src={cbsLogo} alt="Logo" className="w-18 h-16" />
          <img src={logo} alt="Logo" className="w-16 h-16" />
        </HashLink>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-8 items-center">
          {menuItems.map((item, index) => (
            <HashLink
              key={index}
              smooth
              to={item.link}
              className="hover:text-white transition-colors duration-200"
            >
              {item.name}
            </HashLink>
          ))}
          {userInfo ? (
            <div className="relative">
              <img
                src={userInfo.photoURL || ninja} // Fallback to default image
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                onClick={() => setShowLogoutModal((prev) => !prev)}
              />
              {showLogoutModal && (
                <div className="absolute right-0 mt-2 bg-[#693505da] rounded-md shadow-lg">
                  <button
                    className="block ml-4 w-[10vw] rounded-xl text-left px-4 py-2 text-md text-white hover:text-black"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : null}
        </div>
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setNavbarOpen(!navbarOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </nav>
      <motion.div
        className={`lg:hidden h-screen w-full fixed inset-0 z-50 ${navbarOpen ? "flex" : "hidden"
          }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: navbarOpen ? 1 : 0, x: navbarOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="navbar-backdrop h-full w-full fixed inset-0 backdrop-blur-sm bg-[#311207]"
          onClick={() => setNavbarOpen(false)}
        ></div>

        <nav className="bg-[#f2cc81] h-full fixed top-0 left-0 w-5/6 max-w-sm py-6 px-6 border-r overflow-y-auto">
          <div className="flex items-center justify-between mb-8">
            <HashLink
              smooth
              to="/#home"
              className="flex items-center space-x-2"
            >
              <img 
                src={logo}
                alt="Logo" 
                className="`w-12 h-12" 
              />
              <span className="text-lg font-bold text-black">
                Coding Ninjas CUIET
              </span>
            </HashLink>
            <button
              className="navbar-close"
              onClick={() => setNavbarOpen(false)}
            >
              <svg
                className="h-6 w-6 text-gray-700 cursor-pointer hover:text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex h-3/5 flex-col justify-around">
            {menuItems.map((item, index) => (
              <HashLink
                key={index}
                smooth
                to={item.link}
                className="block w-full py-2 text-black font-semibold hover:text-gray-600 transition-colors duration-200"
                onClick={() => setNavbarOpen(false)}
              >
                {item.name}
              </HashLink>
            ))}
          </div>


          {userInfo ? (
            <div className="flex mt-8">
              <div className="text-black">
                <img
                  src={userInfo.photoURL || ninja} // Fallback to default image
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover cursor-pointer mb-2"
                  onClick={() => setShowLogoutModal((prev) => !prev)}
                />
                {userInfo.displayName}
                <div className="bg-red-500 mt-2 w-fit rounded-md shadow-lg">
                  <button
                    className="block px-2 w-full text-center py-2 text-[#6b440ae4] hover:text-black"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </nav>
      </motion.div>
    </header>
  );
}
