import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPopUp = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();

  useEffect(() => {
    const onEsc = e => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      const data = await response.json();
      if (response.ok) {
        navigate('/home');
        auth.loginAction(true);

        console.log('successful login done');
      } else {
        console.log('login failed');
      }
      console.log(data);
      const redirectPromise = await fetch('http://localhost:5000/dashboard', {
        method: 'GET',
        credentials: 'include',
      });
      if (!redirectPromise.ok) return;
      const redirectMessage = await redirectPromise.json();
      console.log(redirectMessage);
    } catch (err) {
      console.error(`Err : ${err}`);
    }
  };

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
              aria-label="Close login popup"
            >
              &times;
            </button>

            <h2 className="mb-8 text-center text-4xl font-semibold">Welcome Back</h2>

            <form className="space-y-6" onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="rounded-button-round bg-layout-elements-focus text-font placeholder:text-font-light w-full px-5 py-4 text-lg focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="rounded-button-round bg-layout-elements-focus text-font placeholder:text-font-light w-full px-5 py-4 text-lg focus:outline-none"
              />
              <button
                type="submit"
                className="bg-royalpurple-dark rounded-button-round w-full py-4 text-lg font-semibold text-white transition hover:bg-purple-900"
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
