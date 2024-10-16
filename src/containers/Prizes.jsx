import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import { ref, set, get, remove } from "firebase/database";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import axios from "axios";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebaseconfig";

import Confetti from 'react-confetti'

const vector = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/Vector.svg";
const star2 = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/star2.svg";
const cbs = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/sponser_1.png";
const gmc = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/sponser_2.png";
const selle = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/sponser_3.png";
const spn5 = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/sponser_5.png";
const ccsc = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/sponser_4.png";
const koffehouse = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/koffehouse.png"
const code360 = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/code360.png"
const keventers = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/keventers.png"


const API_BASE_URL = "https://api.w16manik.ninja/kalyug";

export default function Prizes() {
  SwiperCore.use([Autoplay, Navigation, Pagination]);
  const provider = new GoogleAuthProvider();
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
      else {
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
      handleEasterEgg('easter_prizes');
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
    <>
      <div className="max-w-4xl mx-auto px-4 py-8 bg-gradient-to-b from-[#311207] to-[#1a0a04]">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#f2cc81] mb-4 text-center">
        Watch Live
      </h2>
      <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden shadow-lg">
        <iframe
          src="https://www.youtube.com/embed/mYUyBL-T6XY?si=wUtx3T4qnXfW5Suk?autoplay=1&mute=1&controls=1&enablejsapi=1"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute top-0 left-0 w-full h-full"
        />
      </div>
    </div>
      {/* Section 1: Prizes Section */}
      <section className="w-screen h-full bg-[#311207]" id="prizes">
        {showConfetti && <Confetti width={width} height={height} />}
        <div className="w-full h-full flex items-center justify-center py-4 lg:py-12 lg:p-4">
          <div className="w-full h-full flex items-start justify-center flex-row lg:py-8 lg:p-4">
            {/* Left Column */}
            <div className="w-full h-full flex items-start justify-start lg:w-[65%] flex-col p-8">
              {/* Title */}
              <div className="flex items-center justify-start">
                <h1 className="text-[2rem] font-bold xs:text-[2.7rem] sm:text-[4rem] md:text-[5rem] lg:text-8xl xl:text-9xl 2xl:text-[140px] sm:leading-tight text-transparent bg-clip-text bg-[#f2cc81] ">
                  Prizes <span onClick={handleClick} className="text-[#f2cc81]">.</span>
                </h1>
              </div>
              {/* Description */}
              <div className="xs:flex items-center justify-center flex-row w-full md:w-[75%] lg:w-full my-8">
                <p className="font-normal text-sm text-[#f2cc81] font-sans sm:text-base lg:text-xl leading-relaxed">
                  Prizes include : Winners • Runnerup • All girls team •
                  Pinnacle perfomer • Social media buzz <br />
                  Every participant gets a Redbull and enjoys exclusive Roadiez
                  Koffeehouz coupons, ensuring you stay energized as you dive
                  deep into the mystery.
                  <br />
                  <br />
                  Venue - Alpha Zone <br />
                  Date - 16th October 2024
                </p>
                <p className="text-white"></p>
              </div>
              {/* Prize Categories */}
              <div className="flex items-center justify-start w-full flex-col max-w-4xl lg:w-full">
                {/* Prize Category 1 */}
                <div className="flex items-center justify-between w-full flex-row border-t-2 border-b-2 px-2 py-8">
                  <h1 className="flex items-center justify-center gap-4 text-3xl xs:text-4xl s:text-5xl md:text-6xl lg:text-7xl xl:text-5xl text-[#f2cc81] font-black">
                    An Aptitude Base Coding round
                  </h1>
                </div>
                {/* Prize Category 2 */}
                <div className="flex items-center justify-between w-full flex-row px-2 py-8">
                  <h1 className="flex items-center justify-center gap-4 text-3xl xs:text-4xl s:text-5xl md:text-6xl lg:text-7xl xl:text-5xl text-[#f2cc81] font-black">
                    Balance Sheet match round
                  </h1>
                </div>
                {/* Prize Category 3 */}
                <div className="flex items-center justify-between w-full flex-row border-t-2 border-b-2 px-2 py-8">
                  <h1 className="flex items-center justify-center gap-4 text-3xl xs:text-4xl s:text-5xl md:text-6xl lg:text-7xl xl:text-5xl text-[#f2cc81] font-black">
                    Fun Activities
                  </h1>
                </div>
              </div>
            </div>
            {/* Right Column */}
            <div className="lg:flex hidden items-center justify-start w-[35%] flex-col p-6">
              <div>
                {/* <img src={prize} alt="prize" className="h-96 w-96 rounded-tl-[4rem] rounded-br-[4rem] object-cover" /> */}
              </div>
              <div className="flex items-center justify-center flex-row w-full sm:p-4 my-8">
                <p className="font-normal text-sm text-[#f2cc81] sm:text-base lg:text-xl leading-relaxed">
                  Each team will be assigned a team name to participate in this
                  mega event. A team consists of 5 members, with 2 members from
                  Chitkara Business School and 3 members from the Department of
                  CSE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Event Title */}
      <section className="w-screen h-auto bg-[#311207]">
        <div className="w-full flex items-center justify-center p-6 lg:p-8">
          <div className="w-full flex items-start justify-center flex-col md:flex-row p-6 md:p-8 lg:p-10 2xl:p-12 my-6">
            <div className="flex items-center bg-[#000000] justify-center p-8 sm:py-16 w-full relative rounded-3xl shadow-2xl">
              <div className="flex flex-col items-center justify-center w-full max-w-7xl">
                <p
                  id="face"
                  className="text-center text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-[#f2cc81] p-2"
                >
                  ।।धर्मस्य विजयः सदा निश्चितः।।
                </p>
                <img
                  src={vector}
                  alt="vector"
                  className="absolute top-0 left-0 w-12 h-12 sm:h-20 sm:w-20"
                />
                <img
                  src={vector}
                  alt="vector"
                  className="absolute bottom-0 right-0 w-12 h-12 sm:h-20 sm:w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Sponsors */}
      <section className="w-screen px-4 xs:px-10 sm:px-12 md:px-16 lg:px-32 relative h-auto bg-[#311207]">
        {/* Title */}
        <div className="flex items-center justify-start py-4 lg:py-8">
          <h1 className="text-[2rem] font-bold xs:text-[2.7rem] sm:text-[4rem] md:text-[5rem] lg:text-8xl xl:text-9xl 2xl:text-[140px] sm:leading-tight text-transparent bg-clip-text bg-[#f2cc81]">
            Sponsors <span className="text-[#f2cc81]"></span>
          </h1>
        </div>

        {/* Sponsor Logos */}
        <div className="md:h-auto h-full flex items-center justify-center w-full py-4 lg:py-8">
          <div className="flex flex-wrap justify-around gap-6 sm:gap-8 md:gap-10 lg:gap-12 px-4">
            {[koffehouse, code360, keventers].map((sponsor, index) => (
              <div
              onClick={handleClick}
                key={index}
                className="flex items-center justify-center rounded-2xl p-2 sm:p-4 md:p-6 lg:p-8 w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
              >
                <img
                  src={sponsor}
                  alt={`sponsor-${index}`}
                  className="h-24 xs:h-28 sm:h-32 md:h-40 lg:h-80 w-full object-contain"
                />
              </div>
            ))}
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
    </>
  );
}