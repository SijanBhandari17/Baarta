import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const LoginPopUp = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(''); // NEW

  useEffect(() => {
    const onEsc = e => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(''); // reset on each attempt
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const data = await response.json();
      if (response.ok) {
        console.log('successful login done');
      } else {
        console.log('login failed');
        setLoginError('Login failed. Please check your email or password.');
      }
      console.log(data);

      const redirectPromise = await fetch('http://localhost:5000/dashboard', {
        method: 'GET',
        credentials: 'include'
      });
      if (!redirectPromise.ok) return;
      const redirectMessage = await redirectPromise.json();
      console.log(redirectMessage);
    } catch (err) {
      console.error(`Err : ${err}`);
      setLoginError('Wrong email or password entered');
    }
  };

  function onClickEye(e) {
    const passwordField = e.currentTarget.previousSibling;
    if (passwordField.type === 'password') passwordField.type = 'text';
    else passwordField.type = 'password';
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
            className="bg-layout-elements rounded-2xl w-[500px] h-[420px] text-font relative shadow-2xl flex flex-col flex-nowrap"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-4xl relative font-semibold mb-8 text-center grow-1 flex justify-center items-center rounded-tr-2xl rounded-tl-2xl bg-linear-to-tr from-royalpurple-dark to-indigo-500">
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
              className="w-full h-fit px-12 pb-2 flex flex-col flex-nowrap gap-5 relative"
              onSubmit={handleLogin}
            >
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
                />
                <label
                  htmlFor="email"
                  className="absolute left-5 top-0 text-sm text-gray-200 -translate-y-1/2 
                    peer-placeholder-shown:top-1/4 peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark
                    peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300
                    peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:-translate-y-0"
                >
                  Email
                </label>
              </div>

              <div className="relative">
                <input
                  id="password"
                  type="password"
                  placeholder=" "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
                />
                <div
                  className="absolute bg-[url(../../assets/icons/eye.png)] bg-pink-400 h-[40px] w-[40px] right-[10px] top-0 translate-y-1/4 cursor-pointer"
                  onClick={onClickEye}
                ></div>
                <label
                  htmlFor="password"
                  className="absolute left-5 top-0 text-sm text-gray-200 -translate-y-1/2 
                    peer-placeholder-shown:top-1/4 peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark
                    peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300
                    peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:-translate-y-0"
                >
                  Password
                </label>
              </div>

              {/* Conditionally render error message */}
              {loginError && (
                <div className="text-sm text-red-600 text-center -mt-2">{loginError}</div>
              )}

              <button
                type="submit"
                className="w-full py-4 text-lg rounded-button-round text-white font-semibold bg-linear-to-tr from-royalpurple-dark to-indigo-500 hover:scale-105 duration-150"
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
