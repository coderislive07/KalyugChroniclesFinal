import React, { useState, useRef } from "react";
import { ArrowLeft, User } from "lucide-react";
import GoogleButton from "react-google-button";
import { useNavigate } from "react-router-dom";
import LoadingBar from "react-top-loading-bar";
import gif from "../assets/kalyugteaserg.gif";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebaseconfig";
import { useAppStore } from "../store";
export default function Login() {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { setUserInfo } = useAppStore();
  const loadingBarRef = useRef(null);
  const [loginError, setLoginError] = useState(null);
  const [signupError, setSignupError] = useState(null);
  const toggleForm = () => {
    loadingBarRef.current.continuousStart();
    setTimeout(() => {
      setIsLogin(!isLogin);
      setUser({ email: "", password: "" });
      loadingBarRef.current.complete();
    }, 300);
  };
  const handleInputs = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const handleGoogleSignIn = async () => {
    try {

      const result = await signInWithPopup(auth, provider);
      navigate("/");
      const user = result.user;
      const userProfile = {
        displayName: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
      };
      setUserInfo(userProfile);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      setLoginError("Email and password are required.");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, user.email, user.password);
      const userProfile = {
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        email: userCredential.user.email,
      };
      setUserInfo(userProfile);
      navigate("/");
    } catch (error) {
      console.error("Error during login:", error);
      if (error.code) {
        switch (error.code) {
          case "auth/user-not-found":
            setLoginError(
              "No account found with this email. Please check your email or sign up."
            );
            break;
          case "auth/wrong-password":
            setLoginError(
              "Invalid credentials. Please check your email and password."
            );
            break;
          default:
            setLoginError("No account exists with this email.");
            break;
        }
      } else {
        setLoginError("An unexpected error occurred. Please try again.");
      }
    }
  };
  

  const handleSignupFormSubmit = async (e) => {
    e.preventDefault();
    if (!user.email || !user.password) {
      setSignupError("Email and password are required.");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
      const userProfile = {
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL,
        email: userCredential.user.email,
      };
      setUserInfo(userProfile);
    setSignupError(null); 
    setUser({ email: "", password: "" }); 
    setIsLogin(true); 
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setSignupError("Invalid email address format.");
          break;
        case "auth/email-already-in-use":
          setSignupError("An account already exists with this email.");
          break;
        case "auth/weak-password":
          setSignupError("Password should be at least 6 characters.");
          break;
        default:
          setSignupError("Signup failed. Please try again.");
          break;
      }
    }
  };
  

  return (
    
    <div
      className="h-screen font-sans bg-cover bg-center flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: `url(${gif})` }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <LoadingBar color="#FFA500" ref={loadingBarRef} />
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 text-white p-3 bg-orange-600 hover:bg-orange-700 rounded-md transition-colors duration-200 flex items-center shadow-md"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
      </button>
      <div className="w-full max-w-md">
        <div
          className={`bg-black bg-opacity-80 h-[95vh] rounded-2xl mt-10 border border-orange-500 shadow-xl backdrop-blur-sm transition-all duration-300 ease-in-out ${
            isLogin ? "translate-y-0" : "translate-y-[-4vh]"
          }`}
        >
          <div className="text-center p-8 space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {isLogin ? "Ninja Login" : "Join the Clan"}
            </h2>
            <p className="text-sm text-orange-300">
              {isLogin
                ? "Sharpen your coding skills in the shadows"
                : "Begin your journey in the shadows of code"}
            </p>
          </div>
          <form
            onSubmit={isLogin ? handleFormSubmit : handleSignupFormSubmit}
            className="space-y-6 p-8"
          >
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-orange-300"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="mt-1 block w-full px-3 py-2 bg-orange-900 bg-opacity-50 border border-orange-600 rounded-md text-white placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                placeholder="ninja@codingclan.com"
                value={user.email}
                onChange={handleInputs}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-orange-300"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? "current-password" : "new-password"}
                required
                className="mt-1 block w-full px-3 py-2 bg-orange-900 bg-opacity-50 border border-orange-600 rounded-md text-white placeholder-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors duration-200"
                placeholder="••••••••"
                value={user.password}
                onChange={handleInputs}
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-md text-white bg-orange-500 hover:from-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors duration-200"
              >
                {isLogin ? "Enter the Clan" : "Join the Clan"}
              </button>
            </div>
            <div className="flex justify-center">
              <GoogleButton
                onClick={handleGoogleSignIn}
                type="dark"
                style={{ width: "100%", borderRadius: "0.375rem" }}
              />
            </div>
            {(loginError || signupError) && (
              <p className="text-center text-orange-500 text-sm mt-2">
                {loginError || signupError}
              </p>
            )}
          </form>
          <div className="px-8 pb-8 text-center">
            <p className="text-sm text-orange-300">
              {isLogin ? "New to the clan? " : "Already a member? "}
              <button
                onClick={toggleForm}
                className="font-medium text-orange-400 hover:text-orange-300 transition-colors duration-200"
              >
                {isLogin ? "Become a Ninja" : "Login"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
