import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import instagram from "../assets/instagram.jpeg";
import linkedin from "../assets/linkedin.jpeg";
import axios from "axios";
import { useAppStore } from "../store";
import { useWindowSize } from "react-use";
import { ref, set, get , remove } from "firebase/database";
import { signInWithPopup , GoogleAuthProvider } from "firebase/auth";
import { auth , db } from "../firebaseconfig";

import Confetti from 'react-confetti'



const API_BASE_URL = "https://api.w16manik.ninja/kalyug";

export default function Socials(){

  const provider= new GoogleAuthProvider();
  const navigate=useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const { width, height } = useWindowSize();
  const [clickCount, setClickCount] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEasterEggPopup, setShowEasterEggPopup] = useState(false);
  const [currentEasterEgg, setCurrentEasterEgg] = useState(null);
  const [showPointsRecordedPopup, setShowPointsRecordedPopup] = useState(false);
  const [showAlreadyFoundPopup, setShowAlreadyFoundPopup] = useState(false);
  const handleEasterEgg = async (easterEggKey) => {
    try {
      if (!userInfo) {
        setShowEasterEggPopup(true);
        setCurrentEasterEgg(easterEggKey);
        return;
      }

      const userRef = ref(db, `users/${userInfo.email.replace('.', ',')}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val() || {};
      const easterEggRef = ref(db, `easterEggs/${easterEggKey}`);
      const easterEggSnapshot = await get(easterEggRef);

    
      

  

      await set(userRef, {
        ...userData,
        name: userInfo.displayName,
        [easterEggKey]: true
      });
      await set(easterEggRef, {
        foundBy: userInfo.email,
        foundAt: new Date().toISOString()
      });

    
      if (userData[easterEggKey]) {
        setShowEasterEggPopup(false)
      }
      else
      {
        setShowEasterEggPopup(true)
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowEasterEggPopup(false);
          navigate('/contact');
        }, 3000);
      }
      setCurrentEasterEgg(easterEggKey);
      setTimeout(() => setShowConfetti(false), 5000);

      if (easterEggKey === 'easter_kali') {
        setTimeout(() => navigate('/'), 3000);
      }
      setTimeout(async () => {
        await remove(easterEggRef);
      }, 5000);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);

    if (clickCount + 1 === 6) {
      handleEasterEgg('easter_socialdot');
      setTimeout(() => setClickCount(0), 4321);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setShowEasterEggPopup(false);
      setShowPointsRecordedPopup(true);
      setTimeout(() => {
        setShowPointsRecordedPopup(false);
      }, 3000);

      const userProfile = {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
      };

      setUserInfo(userProfile);
      await handleEasterEgg(currentEasterEgg);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  return (
    <section className="w-screen h-full p-16 bg-[#311207]" id="socials">
   {showConfetti && <Confetti width={width} height={height} />}
      <div className="w-full h-full flex items-start justify-start flex-col p-6">
        <div className="flex items-center justify-start">
          <h1 className="text-[2rem] xs:text-[2.7rem] sm:text-[4rem] md:text-[5rem] lg:text-8xl xl:text-9xl 2xl:text-[140px] font-extrabold sm:leading-tight text-transparent bg-clip-text bg-[#f2cc81] ">
            Socials
          </h1>
        </div>
        <div className="flex md:items-start justify-center  lg:flex-row flex-col py-6 mt-12 w-full h-full">
          <div className="flex items-center s:justify-start justify-center  lg:justify-center gap-6 flex-1 flex-row p-2 w-full h-full">
            <Link
              to="https://instagram.com/codingninjas_cuiet"
              className="flex items-center justify-center s:h-[35rem] h-[30rem] w-[15rem] s:w-[17.5rem]"
            >
              <img
                src={instagram}
                alt="instagram"
                className="w-full h-full border sm:ml-6 lg:m-0 border-white rounded-3xl "
              />
            </Link>
          </div>
          <div className="flex items-center justify-center flex-1 py-4 md:p-4 flex-col gap-4 w-full h-full">
            <div className="w-full h-full flex items-center  justify-center flex-col gap-4">
              <div className="flex items-center justify-center">
                <h1 className="text-[2.25rem]  xs:text-[2.7rem] sm:text-5xl lg:text-6xl font-black sm:leading-tight text-[#f2cc81] whitespace-nowrap">
                  FOLLOW US
                </h1>
              </div>
              <div className="flex items-center justify-center">
                <h1 className="text-[2rem]  lg:text-[2.7rem] font-black sm:leading-tight text-[#f2cc81] whitespace-nowrap">
                  INSTAGRAM
                </h1>
              </div>
              <div className="flex items-center justify-start">
                <h1 className="text-[2rem]  lg:text-[2.7rem] font-black sm:leading-tight text-[#f2cc81] whitespace-nowrap">
                  LINKEDIN
                </h1>
              </div>
              <div className="flex items-center justify-center">
                <Link
                  to="https://instagram.com/codingninjas_cuiet"
                  className="flex items-center justify-center"
                >
                  <h1 className="text-[1.5rem]  lg:text-[2.7rem] font-black sm:leading-tight text-[#f2cc81] whitespace-nowrap">
                    @codingninjas_cuiet
                  </h1>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center s:justify-end  justify-center lg:justify-center gap-6 flex-1 flex-row p-2 w-full h-full">
            <Link
              to="https://www.linkedin.com/company/codingninjas-cuiet/"
              className="flex items-center justify-center s:h-[35rem] h-[30rem] w-[15rem] s:w-[17.5rem]"
            >
              <img
                src={linkedin}
                alt="linkedin"
                className="w-full sm:mr-6 lg:m-0 h-full border border-white rounded-3xl "
              />
            </Link>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showEasterEggPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#846316] bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              className="bg-[#392409d2] rounded-2xl p-6 sm:p-8 w-full max-w-[90%] sm:max-w-md shadow-lg"
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <motion.h2
                className="text-3xl sm:text-4xl font-bold mb-4 text-[#b5960de8] text-center"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Congratulations! 🎉
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl mb-4 sm:mb-6 text-[#927908e8]  text-center"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You've discovered an Easter egg!
              </motion.p>

              {!userInfo && (
                <motion.p
                  className="text-base sm:text-lg mb-6 text-[#927908e8]  text-center"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Login to earn your easter points...
                </motion.p>
              )}

              <motion.div
                className="flex flex-row justify-between items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {!userInfo && (
                  <motion.button
                    onClick={handleGoogleSignIn}
                    className="bg-[#927908e8]  text-black px-6 py-3 rounded-full font-semibold text-lg hover:bg-[#00000] transition-colors flex-grow"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Login
                  </motion.button>
                )}
                {userInfo && (
                  <motion.p
                    className="text-lg font-semibold text-[#927908e8]  text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    Points recorded!
                  </motion.p>
                )}
                <motion.button
                  className="transition-colors p-2 ml-auto text-[#858584]"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowEasterEggPopup(false)}
                >
                  <IoCloseOutline size={24} />
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPointsRecordedPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full z-50"
          >
            Points recorded successfully!
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAlreadyFoundPopup && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-6 py-3 rounded-full z-50"
          >
            You've already found this Easter egg!
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}