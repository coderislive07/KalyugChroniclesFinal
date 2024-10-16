import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import Typed from "typed.js";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import { IoCloseOutline } from "react-icons/io5";
import { BiLoaderAlt } from "react-icons/bi";
import Header from "../components/Header";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebaseconfig";
import { ref, set, get , remove } from "firebase/database";

const play = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/play.svg";
const star = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/star.svg";
const circle = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/circle.svg";
const linkedin = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/linkedin.svg";
const instagram = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/instagram.svg";
const twitter = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/twitter.svg";
const line = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/Line.svg";
const video = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/render.mp4";
const pdf = "https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/rulebook.pdf";


export default function HeroPage() {
  const location = useLocation();
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

  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { y: "-20%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.5, ease: "sine.in" }
      );
    }
    if (subHeadingRef.current) {
      typedRef.current = new Typed(subHeadingRef.current, {
        strings: ["The Unsolved Crime"],
        typeSpeed: 50,
        backSpeed: 50,
        showCursor: false,
        loop: false,
      });
    }
    return () => {
      if (typedRef.current) {
        typedRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/konhaikali' && easterEgg2Handled) {
      navigate('/');
      setShowPointsRecordedPopup(true)
    } else if (location.pathname === '/konhaikali') {
      handleEasterEgg('easter_kali');
      setEasterEgg2Handled(true);
    }
  }, [location, userInfo, easterEgg2Handled]);
  const openModal = () => {
    setModal(!modal);
  };

  const spinner = () => {
    setVideoLoading(!videoLoading);
  };

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

    if (clickCount + 1 === 4) {
      handleEasterEgg('easter_star');
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
    <section className="w-screen relative h-full flex items-center justify-center flex-col" id="home">
      {showConfetti && <Confetti width={width} height={height} />}

      <Header />
      <div id="hero" className="flex items-center justify-center py-8 w-full lg:h-screen sm:h-[100vh]">
        <div className="flex items-center justify-center flex-col max-w-[95%] h-full w-full px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center flex-col sm:flex-row w-full gap-6 md:gap-12 h-full">
            <div className="flex flex-col items-center justify-center w-full md:w-[50%] text-center">
              <h1 ref={headingRef} className="text-[3rem] xs:text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] font-semibold sm:leading-tight text-[#311207]">
                Kalyug Chronicles
              </h1>
              <div className="hidden text-white">
                Yay!, you discovered an Easter egg 🥚
                <a href="https://youtu.be/xvFZjo5PgG0?si=WCxEuODYE4ZpJmpq">Watch it haha</a>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center w-full gap-4">
            <div className="flex items-center justify-center w-full h-full">
              <h1 ref={subHeadingRef} className="text-[1.8rem] sm:text-4xl md:text-5xl lg:text-6xl text-center font-black text-[#311207]">
                The Unsolved Crime
              </h1>
            </div>
          </div>
          <div className=" 2xl:[-65vw] flex justify-center gap-x-2   mt-28 ">
            <Link to="https://forms.gle/1uFk8aNu9Yk3hefq7" className="bg-[#311207] hover:bg-[#f2cc81] hover:shadow-lg transition duration-200 ease-in-out rounded-full p-2 ">
          <button type="submit" className="text-[#f2cc81] hover:text-[#311207] rounded-full text-m font-black text-center px-12 lg:px-20">Register</button>
            </Link>
            <a href={pdf} download="rulebook" className="bg-[#311207] hover:bg-[#f2cc81] transition duration-200 ease-in-out rounded-full p-2  ">
              <button type="submit" className="text-[#f2cc81] hover:text-[#311207] rounded-full text-m font-black text-center px-12 lg:px-20 whitespace-nowrap">Rule Book</button>
            </a>
          </div>

          <div className="flex items-center justify-center w-full h-full">
            <img
              src={star}
              loading="lazy"
              alt="star"
              onClick={handleClick}
              className={`w-12 h-12 sm:w-14 sm:h-14 md:w-40 md:h-40 transition duration-200 ease-in-out transform ${
                clickCount === 1 ? `scale-100` : `scale-110 rotate-12`
              }`}
            />
          </div>

       
          {modal && (
            <section className="modal__bg">
              <div className="modal__align">
                <div className="modal__content">
                  <IoCloseOutline
                    className="modal__close"
                    aria-label="Close modal"
                    onClick={() => setModal(false)}
                  />
                  <div className="modal__video-align">
                    {videoLoading ? (
                      <div className="modal__spinner">
                        <BiLoaderAlt className="modal__spinner-style animate-spin" />
                      </div>
                    ) : null}
                    <video
                      className="modal__video-style"
                      onLoad={spinner}
                      loading="lazy"
                      src={video}
                      autoPlay
                      loop
                    ></video>
                  </div>
                </div>
              </div>
            </section>
          )}

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
        </div>
      </div>
    </section>
  );
}