import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import bg from '../assets/bgflip.jpg';
import play from '../assets/play_2.svg';
import star2 from '../assets/star2.svg';
import axios from "axios";
import { useAppStore } from "../store";
import { signInWithPopup , GoogleAuthProvider } from "firebase/auth";
import { auth , db } from "../firebaseconfig";
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import { useNavigate } from "react-router-dom";
import { ref, set, get , remove } from "firebase/database";


const API_BASE_URL = "https://api.w16manik.ninja/kalyug";

export default function Overview(){
  const provider= new GoogleAuthProvider();
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAppStore();
  const { width, height } = useWindowSize();
  const [modal, setModal] = useState(false);
  const [videoLoading, setVideoLoading] = useState(true);
  const [clickCount, setClickCount] = useState(1);
  const headingRef = useRef(null);
  const subHeadingRef = useRef(null);
  const typedRef = useRef(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showEasterEggPopup, setShowEasterEggPopup] = useState(false);
  const [currentEasterEgg, setCurrentEasterEgg] = useState(null);
  const [showPointsRecordedPopup, setShowPointsRecordedPopup] = useState(false);
  const [showAlreadyFoundPopup, setShowAlreadyFoundPopup] = useState(false);
  const { easterEgg2Handled, setEasterEgg2Handled } = useAppStore();

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
      handleEasterEgg('easter_overview');
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
    <section className="w-screen h-full bg-gradient-to-r from-orange-400 to-pink-400 flex items-center justify-center" id="overview">
      {showConfetti && <Confetti width={width} height={height} />}
      <div className="w-full h-full flex items-center justify-center bg-[#311207]">
        <div className="w-full h-full flex items-center justify-center flex-col ">
          <div className="flex items-center justify-center w-full h-full">
            <div className="flex items-center w-full h-full justify-center p-1 sm:p-3 pb-0 sm:pb-0 relative">
              <div className="flex items-center justify-center max-w-6xl xs:p-2 pb-0 sm:p-4 sm:pb-0">
                <div className="flex items-center max-w-6xl justify-center relative p-4 pb-0 xs:p-4 xs:pb-0 sm:p-4 md:p-6 sm:pb-0 mb-[5rem]  lg:mb-14" >
                  <img src={bg} alt="bg" loading="lazy" className="w-full h-full object-cover rounded-t-[42px] s:rounded-t-[54px] sm:rounded-t-[72px]  lg:rounded-t-[112px] filter saturate-150" />
                  <div className="flex items-center justify-center absolute xs:top-0 top-1 right-1 xs:right-0">
                    <img onClick={handleClick} src={play} alt="play" className="motion-safe:animate-[spin_5s_ease-in-out_infinite] w-12 h-12  xs:h-16  xs:w-16 s:h-20 s:w-20  sm:w-24 sm:h-24 lg:w-28 lg:h-28 filter drop-shadow-md" />
                  </div>
                </div>
              </div>
              <div className="bottom-0 absolute flex items-center justify-center w-full bg-gradient-to-r from-orange-400 to-pink-400 overflow-x-hidden">
                <div className="flex items-center justify-center py-0 sm:py-2 md:py-4 lg:py-6">
                  <marquee className="py-10 xs:py-12">
                    <h1 className="flex items-center justify-center gap-4 text-2xl xs:text-3xl s:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-[#f2cc81] font-black">Be A Detective <img className='w-8 h-8' src={star2} alt="star2"/> Solve the Murder Mystery</h1>
                  </marquee>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Easter Egg Popup */}
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