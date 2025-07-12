import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const LoginPopUp = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(''); // NEW

  useEffect(() => {
    const onEsc = e => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  const { loginAction } = useAuth();

  const handleLogin = async e => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        setLoginError('Wrong email or password entered');
        return;
      }

      console.log('Login successful');

      const dashboardResponse = await fetch('http://localhost:5000/dashboard', {
        method: 'GET',
        credentials: 'include',
      });

      if (!dashboardResponse.ok) {
        setLoginError('Failed to fetch user data after login');
        return;
      }

      const userData = await dashboardResponse.json();
      console.log(userData);

      loginAction(userData);

      navigate('/home');

      console.log('User data after login:', userData);
    } catch (err) {
      console.error(`Login error: ${err}`);
      setLoginError('Something went wrong. Please try again.');
    }
  };

  function togglePasswordVisibility(e) {
    setShowPassword(prev => !prev);
  }

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
            className="bg-layout-elements text-font relative flex h-[420px] w-[500px] flex-col flex-nowrap rounded-2xl shadow-2xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="from-royalpurple-dark relative mb-8 flex grow-1 items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-linear-to-tr to-indigo-500 text-center text-4xl font-semibold">
              Welcome Back
              <button
                onClick={onClose}
                className="text-font hover:text-royalpurple-dark absolute top-4 right-4 text-3xl leading-none font-bold"
                aria-label="Close login popup"
              >
                &times;
              </button>
            </h2>

            <form
              className="relative flex h-fit w-full flex-col flex-nowrap gap-5 px-12 pb-2"
              onSubmit={handleLogin}
            >
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="peer rounded-button-round bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark text-font placeholder:text-font-light w-full px-5 py-4 text-lg duration-300 focus:border-2 focus:outline-none"
                />
                <label
                  htmlFor="email"
                  className="peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements absolute top-0 left-5 -translate-y-1/2 text-sm text-gray-200 duration-300 peer-placeholder-shown:top-1/4 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-200 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder=" "
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="peer rounded-button-round bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark text-font placeholder:text-font-light w-full px-5 py-4 text-lg duration-300 focus:border-2 focus:outline-none"
                />

                {showPassword ? (
                  <Eye
                    className="absolute top-0 right-[10px] size-[40px] translate-y-1/4 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                ) : (
                  <EyeOff
                    className="absolute top-0 right-[10px] size-[40px] translate-y-1/4 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                )}

                <label
                  htmlFor="password"
                  className="peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements absolute top-0 left-5 -translate-y-1/2 text-sm text-gray-200 duration-300 peer-placeholder-shown:top-1/4 peer-placeholder-shown:-translate-y-0 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-200 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm"
                >
                  Password
                </label>
              </div>

              {/* Conditionally render error message */}
              {loginError && (
                <div className="-mt-2 text-center text-sm text-red-600">{loginError}</div>
              )}

              <button
                type="submit"
                className="rounded-button-round from-royalpurple-dark w-full bg-linear-to-tr to-indigo-500 py-4 text-lg font-semibold text-white duration-150 hover:scale-105"
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
