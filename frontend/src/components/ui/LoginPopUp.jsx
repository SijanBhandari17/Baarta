import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPopUp = ({ isOpen, onClose }) => {
  useEffect(() => {
    const onEsc = (e) => {
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
            className="bg-layout-elements p-12 rounded-2xl w-[600px] text-font relative shadow-2xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-font hover:text-royalpurple-dark font-bold text-3xl leading-none"
              aria-label="Close login popup"
            >
              &times;
            </button>

            <h2 className="text-4xl font-semibold mb-8 text-center">Welcome Back</h2>

            <form className="space-y-6">
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus text-font placeholder:text-font-light focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="w-full rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus text-font placeholder:text-font-light focus:outline-none"
              />
              <button
                type="submit"
                className="bg-royalpurple-dark w-full py-4 text-lg rounded-button-round text-white font-semibold hover:bg-purple-900 transition"
              >
                Log In
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPopUp;
