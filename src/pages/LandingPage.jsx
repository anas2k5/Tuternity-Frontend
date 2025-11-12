import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Users,
  Lightbulb,
  Laptop,
  MessageCircle,
  Sun,
  Moon,
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const featureRef = useRef(null);
  const aboutRef = useRef(null);
  const controls = useAnimation();

  const quotes = [
    "“Education is the most powerful weapon which you can use to change the world.” — Nelson Mandela",
    "“The beautiful thing about learning is that no one can take it away from you.” — B.B. King",
    "“Tell me and I forget. Teach me and I remember. Involve me and I learn.” — Benjamin Franklin",
  ];
  const [index, setIndex] = useState(0);
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    restDelta: 0.001,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll testimonials
  useEffect(() => {
    const loopScroll = async () => {
      while (true) {
        await controls.start({
          x: "-50%",
          transition: { duration: 15, ease: "linear" },
        });
        controls.set({ x: "0%" });
      }
    };
    loopScroll();
  }, [controls]);

  const scrollToFeatures = () =>
    featureRef.current?.scrollIntoView({ behavior: "smooth" });
  const scrollToAbout = () =>
    aboutRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex flex-col justify-between bg-[#f5f9ff] dark:bg-[#0f172a] text-[#1E1E2F] dark:text-gray-100 transition-colors duration-700"
    >
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 origin-left z-[9999]"
        style={{ scaleX: progress }}
      />

      {/* Navbar */}
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="fixed top-0 w-full z-50 backdrop-blur-md border-b shadow-sm bg-white/70 dark:bg-gray-900/70 border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <h1
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent cursor-pointer"
          >
            TuterNity
          </h1>

          <div className="hidden md:flex items-center gap-6 font-medium">
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
              Home
            </button>
            <button onClick={scrollToAbout}>About</button>
            <button onClick={scrollToFeatures}>Features</button>
            <button onClick={() => navigate("/login")}>Login</button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold hover:opacity-90 transition"
            >
              Sign Up
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2 rounded-full border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-yellow-300 hover:scale-105 transition"
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section with Glow */}
      <section className="relative flex flex-col items-center justify-center text-center py-32 md:py-40 px-6 bg-[#f5f9ff] dark:bg-[#0f172a] overflow-hidden">
        {/* Animated Gradient Layer */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 dark:from-indigo-900 dark:via-purple-800 dark:to-pink-700 opacity-20 blur-3xl"
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Glow behind TuterNity */}
        <motion.div
          className="absolute w-[280px] h-[280px] md:w-[400px] md:h-[400px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full opacity-30 blur-[120px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-transparent bg-clip-text relative z-10">
          TuterNity
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-2xl relative z-10">
          Learn • Grow • Connect — Empowering learners to find the perfect mentor.
        </p>

        <motion.button
          onClick={scrollToAbout}
          whileHover={{ scale: 1.05 }}
          className="px-10 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-md relative z-10"
        >
          Learn More ↓
        </motion.button>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="py-20 px-6 bg-[#f5f9ff] dark:bg-[#111827] relative overflow-hidden transition-colors duration-700"
      >
        <div className="text-center max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About <span className="text-indigo-600">TuterNity</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto mb-12">
            TuterNity connects passionate students with skilled mentors globally,
            making personalized learning accessible, interactive, and rewarding.
          </p>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: <Lightbulb className="w-10 h-10 text-indigo-500 mx-auto mb-4" />,
                title: "Our Vision",
                desc: "Empowering learners with tailored mentorship opportunities.",
              },
              {
                icon: <Laptop className="w-10 h-10 text-purple-500 mx-auto mb-4" />,
                title: "Our Platform",
                desc: "A seamless space for tutors and students to connect instantly.",
              },
              {
                icon: <MessageCircle className="w-10 h-10 text-pink-500 mx-auto mb-4" />,
                title: "Our Promise",
                desc: "A safe, inspiring space to learn, teach, and grow together.",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg rounded-2xl p-8 border border-gray-100 dark:border-gray-700"
              >
                {item.icon}
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featureRef}
        className="py-20 px-6 bg-[#f5f9ff] dark:bg-[#111827] border-t border-gray-100 dark:border-gray-700"
      >
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose <span className="text-indigo-600">TuterNity?</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Designed for students and mentors to connect, collaborate, and grow together.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <BookOpen className="w-12 h-12 text-indigo-500 mx-auto mb-4" />,
              title: "Find Expert Tutors",
              desc: "Connect with verified mentors across multiple subjects.",
            },
            {
              icon: <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-4" />,
              title: "Book Instantly",
              desc: "Schedule sessions easily with instant confirmations.",
            },
            {
              icon: <Users className="w-12 h-12 text-pink-500 mx-auto mb-4" />,
              title: "Learn Together",
              desc: "Collaborate in a trusted environment for growth.",
            },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-700"
            >
              {item.icon}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Auto-Scroll */}
      <section className="py-20 px-6 bg-[#f5f9ff] dark:bg-[#0f172a] border-t border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our <span className="text-indigo-600">Users Say</span>
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Hear from students and mentors who love TuterNity.
          </p>
        </div>

        <motion.div animate={controls} className="flex gap-6 w-[200%] px-4">
          {[...Array(2)].flatMap(() =>
            [
              {
                name: "Aarav Sharma",
                role: "Student",
                quote: "TuterNity helped me find a tutor who made learning fun again!",
              },
              {
                name: "Priya Mehta",
                role: "Mentor",
                quote: "I love teaching on TuterNity — easy scheduling and motivated learners!",
              },
              {
                name: "Rahul Verma",
                role: "Student",
                quote: "Smooth booking and tracking system. Highly recommended!",
              },
              {
                name: "Sneha Kapoor",
                role: "Tutor",
                quote: "TuterNity gives me the freedom to teach anywhere while staying organized.",
              },
            ].map((user, idx) => (
              <motion.div
                key={`${user.name}-${idx}`}
                whileHover={{ scale: 1.05 }}
                className="min-w-[300px] md:min-w-[350px] rounded-2xl p-8 bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <p className="italic mb-6 text-gray-700 dark:text-gray-300">
                  “{user.quote}”
                </p>
                <h4 className="text-lg font-semibold">{user.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.role}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      </section>

      {/* Quote Rotator */}
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center px-6 py-10 bg-[#f5f9ff] dark:bg-[#0f172a]"
      >
        <p className="italic text-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300">
          {quotes[index]}
        </p>
      </motion.div>

      {/* Footer */}
      <footer className="bg-[#f5f9ff] dark:bg-[#111827] border-t border-gray-200 dark:border-gray-700 text-center py-6 text-gray-600 dark:text-gray-400 text-sm transition-colors duration-700">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-indigo-500">TuterNity</span> • All Rights Reserved
      </footer>
    </div>
  );
}
