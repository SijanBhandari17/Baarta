import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SignInPopUp = ({ isOpen, onClose }) => {
  useEffect(() => {
    const onEsc = e => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-layout-elements text-font relative w-[600px] rounded-2xl p-12 shadow-2xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="text-font hover:text-royalpurple-dark absolute top-4 right-4 text-3xl leading-none font-bold"
              aria-label="Close sign in popup"
            >
              &times;
            </button>

            <h2 className="mb-8 text-center text-4xl font-semibold">Create Your Account</h2>

            <form className="space-y-6">
              <input
                type="text"
                placeholder="Username"
                className="rounded-button-round bg-layout-elements-focus text-font placeholder:text-font-light w-full px-5 py-4 text-lg focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                className="rounded-button-round bg-layout-elements-focus text-font placeholder:text-font-light w-full px-5 py-4 text-lg focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="rounded-button-round bg-layout-elements-focus text-font placeholder:text-font-light w-full px-5 py-4 text-lg focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-button-round w-full bg-green-600 py-4 text-lg font-semibold text-white transition hover:bg-green-700"
              >
                Sign Up
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInPopUp;
