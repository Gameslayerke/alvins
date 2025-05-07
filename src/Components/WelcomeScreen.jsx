import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../index.css";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSkip, setShowSkip] = useState(false);
  const audioRef = useRef(null);

  const words = [
    "SEAMLESS",
    "LIGHTNING FAST",
    "CURATED",
    "SECURE",
    "EFFORTLESS",
    "PERSONALIZED"
  ];

  // Play subtle typing sound
  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-keyboard-typing-1386.mp3");
    return () => audioRef.current?.pause();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    const showSkipTimer = setTimeout(() => setShowSkip(true), 3000);
    return () => clearTimeout(showSkipTimer);
  }, []);

  useEffect(() => {
    const typingEffect = () => {
      const currentWord = words[currentIndex];
      
      if (isDeleting) {
        setTypingText(currentWord.substring(0, typingText.length - 1));
        if (typingText.length === 0) {
          setIsDeleting(false);
          setCurrentIndex((prevIndex) => (prevIndex + 1) % words.length);
        }
      } else {
        setTypingText(currentWord.substring(0, typingText.length + 1));
        if (typingText.length < currentWord.length) {
          // Play typing sound only when adding characters
          audioRef.current.currentTime = 0;
          audioRef.current.volume = 0.2;
          audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
        }
        if (typingText.length === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      }
    };

    const speed = isDeleting ? 50 : typingText.length === words[currentIndex].length ? 1500 : 100;
    const timer = setTimeout(typingEffect, speed);

    return () => clearTimeout(timer);
  }, [typingText, currentIndex, isDeleting, words]);

  return (
    <div className="welcome-screen">
      <div className="particles-background"></div>
      
      <motion.div 
        className="welcome-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="welcome-logo"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
        >
          <h1>
            <span className="logo-quick">QUICK</span>
            <span className="logo-cart">CART</span>
          </h1>
          <div className="logo-underline"></div>
        </motion.div>

        <div className="welcome-message">
          <h2>
            ELEVATE YOUR SHOPPING EXPERIENCE
            <br />
            WITH <span className="typing-text">{typingText}</span>
            <span className="cursor">|</span> DELIVERY
          </h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            Discover handpicked products at unbeatable prices
          </motion.p>
        </div>

        <AnimatePresence>
          {showSkip && (
            <motion.button
              className="skip-button"
              onClick={() => navigate("/home")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter Store
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;