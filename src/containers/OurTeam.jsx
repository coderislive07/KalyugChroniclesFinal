import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import Confetti from 'react-confetti';
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { EffectFade, Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import { ref, set, get, remove } from "firebase/database";
import { useAppStore } from "../store";
import { useNavigate } from "react-router-dom";
import { useWindowSize } from "react-use";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "../firebaseconfig";

const person1 = 'https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/person1_rep.jpg';
const person2 = 'https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/person2_rep.jpg';
const person3 = 'https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/person3_rep.jpg';
const person4 = 'https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/person4_rep.jpg';
const person5 = 'https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/person5_rep.jpg';
const person6 = 'https://w16manik.blr1.cdn.digitaloceanspaces.com/KalyugChronicles/assets/person6_rep.jpg';

SwiperCore.use([Autoplay, Navigation, Pagination]);

export default function OurTeam() {
  const navigate = useNavigate();
    const provider = new GoogleAuthProvider();
  const { userInfo, setUserInfo } = useAppStore();
  const { width, height } = useWindowSize();
  const [modal, setModal] = useState(false);
  const [clickCount, setClickCount] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);
  const [showPointsRecordedPopup, setShowPointsRecordedPopup] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showEasterEggPopup, setShowEasterEggPopup] = useState(false);
  const [currentEasterEgg, setCurrentEasterEgg] = useState(null);
  
  const openImage = (src) => {
    setSelectedImage(src);
    setIsImageOpen(true);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setIsImageOpen(false);
  };

  const ImageCard = ({ src, alt }) => (
    <div 
      className="rounded-xl group relative overflow-hidden cursor-pointer"
      onClick={() => openImage(src)}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
      <div className="relative overflow-hidden rounded-xl">
        <img 
          src={src} 
          loading="lazy" 
          alt={alt} 
          className="h-[50vh] w-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>
    </div>
  );
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
    <section className="w-full min-h-screen bg-[#311207] p-8 sm:p-12 md:p-16" id="team">
      {showConfetti && <Confetti width={width} height={height} />}
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center justify-between w-full flex-row px-2 py-8">
            <h1 className="text-[2rem] font-bold xs:text-[2.7rem] sm:text-[4rem] md:text-[5rem] lg:text-8xl xl:text-9xl 2xl:text-[140px] sm:leading-tight text-transparent bg-clip-text bg-[#f2cc81]">
              Past Event
            </h1>
          </div>
        </div>

        {/* Grid for larger screens */}
        <div className='hidden md:grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 items-center justify-center w-full h-auto'>
          <ImageCard src={person6} alt="Event photo 1" />
          <ImageCard src={person1} alt="Event photo 2" />
          <ImageCard onClick={handleClick} src={person5} alt="Event photo 3" />
          <ImageCard src={person2} alt="Event photo 4" />
          <ImageCard src={person3} alt="Event photo 5" />
          <ImageCard src={person4} alt="Event photo 6" />
        </div>

        {/* Swiper for smaller screens */}
        <div className="md:hidden">
          <Swiper
            modules={[Navigation, Pagination, EffectFade, Autoplay]}
            slidesPerView={1}
            spaceBetween={10}
            navigation={false}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000 }}
            breakpoints={{
              520: {
                slidesPerView: 2,
                spaceBetween: 15,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 20,
              },
            }}
          >
            {[person2, person4, person3, person1, person5].map((person, index) => (
              <SwiperSlide key={index} className="py-4">
                <ImageCard src={person} alt={`Event photo ${index + 1}`} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Code for opening image in full screen */}
      {isImageOpen && (
        <div className="fixed z-50 flex items-center justify-center bg-black bg-opacity-75 inset-0">
          <button 
            onClick={closeImage} 
            className="absolute top-4 right-4 font-sans text-white text-2xl bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70 focus:outline-none">
            X
          </button>
          <img src={selectedImage} alt="Event photo" className="max-w-full max-h-full object-contain" />
        </div>
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
                className="text-lg sm:text-xl mb-4 sm:mb-6 text-[#927908e8] text-center"
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                You've discovered an Easter egg!
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
