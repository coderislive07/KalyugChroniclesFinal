import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";

import vector from "../assets/Vector.svg";
import star2 from "../assets/star2.svg";
import cbs from "../assets/sponser_1.png";
import gmc from "../assets/sponser_2.png";
import selle from "../assets/sponser_3.png";
import spn5 from "../assets/sponser_5.png";
import ccsc from "../assets/sponser_4.png";
import koffehouse from "../assets/koffehouse.png"
import code360 from "../assets/code360.png"
import keventers from "../assets/keventers.png"
import { ref, set, get , remove } from "firebase/database";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import axios from "axios";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { signInWithPopup , GoogleAuthProvider } from "firebase/auth";
import { auth , db } from "../firebaseconfig";

import Confetti from 'react-confetti'



const API_BASE_URL = "https://api.w16manik.ninja/kalyug";

export default function Prizes(){
  SwiperCore.use([Autoplay, Navigation, Pagination]);
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
      {/* Section 1: Prizes Section */}
      <section className="w-screen h-full bg-[#311207]" id="prizes">
      {showConfetti && <Confetti width={width} height={height} />}
        <div className="w-full h-full flex items-center justify-center py-4 lg:py-12 lg:p-4">
          <div className="w-full h-full flex items-start justify-center flex-row lg:py-8 lg:p-4">
            {/* Left Column */}
            <div className="w-full h-full flex items-start justify-start lg:w-[65%] flex-col p-8">
              {/* Title */}
              <div className="flex items-center justify-start">
                <h1 className="text-[2rem] font-bold xs:text-[2.7rem] sm:text-[4rem] md:text-[5rem] lg:text-8xl xl:text-9xl 2xl:text-[140px] sm:leading-tight text-transparent bg-clip-text animate-bounce bg-[#f2cc81] ">
                  Prizes <span className="text-[#f2cc81]"></span>
                </h1>
              </div>
              {/* Description */}
              <div className="xs:flex items-center justify-center flex-row w-full md:w-[75%] lg:w-full my-8">
                <p className="font-normal text-sm text-[#f2cc81] sm:text-base lg:text-xl leading-relaxed">
                Prizes include : Winners • Runnerup • All girls team • Pinnacle perfomer • Social media buzz • Prizes worth 50K <br/> 
                Every participant gets a Redbull and enjoys exclusive Roadiez Koffeehouz coupons, ensuring you stay energized as you dive deep into the mystery.
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
                  Each team will be assigned a team name to participate in this mega event. A team consists of 5 members, with 2 members from Chitkara Business School and 3 members from the Department of CSE.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Event Title */}
      <section id='' className="w-screen md:h-screen">
      <div className="w-full h-full flex items-center justify-center p-6 lg:p-8">
          <div className="w-full h-full flex items-start  justify-center flex-row s:p-6 md:p-8 lg:p-10 2xl:p-12 my-6">
            <div className="flex items-center bg-[#311207] hover:shadow-[0_4px_30px_rgba(255,0,0,0.5)] transition-all justify-center md:p-8 sm:py-16 w-full h-full relative rounded-3xl shadow-2xl"
            >
              <div className="flex items-center justify-center flex-row my-6 w-full s:max-w-7xl s:w-[90%]  md:w-[95%]">
                <p id="face" className="items-center justify-center inline-block text-center gap-6  text-3xl xs:text-4xl sm:text-5xl  sm:p-4 md:text-6xl lg:text-7xl xl:text-8xl font-black w-full text-[#f2cc81]">
                  ।।धर्मस्य विजयः सदा निश्चितः।।
                </p>
                <img src={vector} alt="vector" className="absolute top-0 left-0 w-12 h-12 sm:h-20 sm:w-20" />
                <img src={vector} alt="vector" className="absolute bottom-0 right-0 w-12 h-12 sm:h-20 sm:w-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Sponsors */}
      <section className="w-screen px-4 sm:px-8 md:px-16 lg:px-32 h-full relative bg-[#311207]">
      <h1 className="text-[2rem] xs:text-[2.7rem] sm:text-[4rem] md:text-[5rem] lg:text-8xl xl:text-9xl 2xl:text-[140px] sm:leading-tight text-transparent bg-clip-text mt-5 bg-[#f2cc81] ">
            Sponsors <span className="text-[#f2cc81]" ></span>
          </h1>
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[250] rounded-full filter blur-2xl opacity-40 z-0"
        ></div>
        <div className="md:h-screen h-full flex items-center justify-center w-full z-[10] py-12">
          <Swiper
            modules={[Navigation, Pagination, EffectFade, Autoplay]}
            navigation={false}
            slidesPerView={2}
            spaceBetween={20}
            autoplay={{ delay: 4500 }}
            breakpoints={{
              520: { slidesPerView: 3, spaceBetween: 30 },
              768: { slidesPerView: 4, spaceBetween: 40 },
              1024: { slidesPerView: 5, spaceBetween: 50 },
            }}
            className="w-full"
          >
            {[koffehouse , code360 , keventers].map((sponsor, index) => (
              <SwiperSlide key={index} className="flex items-center ml-[10vw] justify-center">
                <div onClick={index === 1 ? handleClick : null} className="flex items-center justify-center bg-gradient-to-r from-[#f2cc81] to-[#f2cc81] rounded-2xl p-4 sm:p-6 shadow-lg transform hover:scale-110 transition-all duration-300 hover:rotate-3 group">
                  <img 
                    src={sponsor}
                    onClick={handleClick} 
                    alt={`sponsor-${index}`}
                    className="h-16 sm:h-20 md:h-24 lg:h-32 w-full group-hover:grayscale-0 transition-all duration-300" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white text-sm sm:text-base md:text-lg font-bold">Sponsor {index + 1}</span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
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
)}