import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SignInPopUp = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onEsc = e => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);

  function formValidation(user_name, user_email, user_password) {
    let u_name = true;
    let u_email = true;
    let u_password = true;
    let regex = /^[^\s@]+@(gmail\.com|student\.[a-zA-Z]+\.edu\.np)$/;
    if (!regex.test(user_email)) u_email = false;
    regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!regex.test(user_password)) u_password = false;
    if (user_name.length < 8) u_name = false;
    return { u_name, u_email, u_password };
  }

  const handleSubmit = async e => {
    e.preventDefault();
    const replyValidatoin = formValidation(username, email, password);
    if (!replyValidatoin.u_email || !replyValidatoin.u_name || !replyValidatoin.u_password) {
      console.log(replyValidatoin);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log(data);
        setShowOtpForm(true);
      } else {
        console.log('error has occured while registering the data');
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOtpSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();

      if (response.ok) {
        console.log(data);
        auth.loginAction(true);
        /*
        
        step 1 : suppose fetch for /login route
        automaticall attach body : josn.stringfiy ({ email : email , username : username ,  })
        if(response.ok)
      {
        auth.loginAction = true
        navigate to home 
        }
        **/
        navigate('/home');
      } else {
        console.log('error has occured while registering the data');
        console.log(data);
      }
    } catch (err) {
      console.error(err);
    }
  };
  function onClickEye(e) {
    const passwordField = e.currentTarget.previousSibling;
    console.log(typeof passwordField.type);
    if (passwordField.type === 'password') passwordField.type = 'text';
    else passwordField.type = 'password';
  }
  function onUserEnter(e) {
    const usernameField = e.currentTarget;
    const usernameInfo = usernameField.nextSibling.nextSibling;
    if (usernameField.value.length === 0) {
      usernameInfo.classList.remove('visible');
      usernameInfo.classList.add('invisible');
      return;
    }
    usernameInfo.classList.remove('invisible');
    usernameInfo.classList.add('visible');
    if (usernameField.value.length < 8) {
      usernameInfo.innerText = `*username must be at least 8 letter long`;
      usernameInfo.classList.remove('text-green-600');
      usernameInfo.classList.add('text-red-600');
    } else {
      usernameInfo.innerText = `*valid username`;
      usernameInfo.classList.remove('text-red-600');
      usernameInfo.classList.add('text-green-600');
    }
  }
  function onEmailEnter(e) {
    const emailField = e.currentTarget;
    const emailInfo = emailField.nextSibling.nextSibling;
    const regex = /^[^\s@]+@(gmail\.com|student\.[a-zA-Z]+\.edu\.np)$/;
    if (emailField.value.length === 0) {
      emailInfo.classList.remove('visible');
      emailInfo.classList.add('invisible');
      return;
    }
    emailInfo.classList.remove('invisible');
    emailInfo.classList.add('visible');
    if (!regex.test(emailField.value)) {
      emailInfo.innerText = '*invalid email format used';
      emailInfo.classList.remove('text-green-600');
      emailInfo.classList.add('text-red-600');
    } else {
      emailInfo.innerText = '*valid email format';
      emailInfo.classList.remove('text-red-600');
      emailInfo.classList.add('text-green-600');
    }
  }
  function onPasswordEnter(e) {
    const passwordField = e.currentTarget;
    const passwordInfo = passwordField.nextSibling.nextSibling.nextSibling;
    const regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (passwordField.value.length === 0) {
      passwordInfo.classList.remove('visible');
      passwordInfo.classList.add('invisible');
      return;
    }
    passwordInfo.classList.remove('invisible');
    passwordInfo.classList.add('visible');
    if (!regex.test(passwordField.value)) {
      passwordInfo.innerText = '*atleast 1 symbol and number required with 8 letter long';
      passwordInfo.classList.remove('text-green-600');
      passwordInfo.classList.add('text-red-600');
    } else {
      passwordInfo.innerText = '*valid password format';
      passwordInfo.classList.remove('text-red-600');
      passwordInfo.classList.add('text-green-600');
    }
  }
  ///////////////////////////////////////////////////////////////////////////

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
            className="bg-layout-elements text-font relative flex h-[550px] w-[500px] flex-col flex-nowrap rounded-2xl shadow-2xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="from-royalpurple-dark relative mb-8 flex grow-1 items-center justify-center rounded-tl-2xl rounded-tr-2xl bg-linear-to-tr to-indigo-500 text-center text-4xl font-semibold">
              Create Your Account
              <button
                onClick={onClose}
                className="text-font hover:text-royalpurple-dark absolute top-4 right-4 text-3xl leading-none font-bold"
                aria-label="Close sign in popup"
              >
                &times;
              </button>
            </h2>
            {!showOtpForm && (
              <form
                className="relative flex h-fit w-full flex-col flex-nowrap gap-5 border-0 border-pink-600 px-12 pb-2"
                onSubmit={handleSubmit}
              >
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    placeholder=" "
                    value={username}
                    onChange={e => {
                      setUsername(e.target.value);
                      onUserEnter(e);
                    }}
                    className="peer rounded-button-round bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark text-font placeholder:text-font-light w-full px-5 py-4 text-lg duration-300 focus:border-2 focus:outline-none"
                  />
                  <label
                    htmlFor="username"
                    className="peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements absolute top-0 left-5 -translate-y-1/2 text-sm text-gray-200 duration-300 peer-placeholder-shown:top-1/4 peer-placeholder-shown:-translate-y-1/4 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-200 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm"
                  >
                    Username
                  </label>
                  <span className="test-sm invisible text-red-600">
                    *username properly not written
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    placeholder=" "
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      onEmailEnter(e);
                    }}
                    className="peer rounded-button-round bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark text-font placeholder:text-font-light w-full px-5 py-4 text-lg duration-300 focus:border-2 focus:outline-none"
                  />
                  <label
                    htmlFor="email"
                    className="peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements absolute top-0 left-5 -translate-y-1/2 text-sm text-gray-200 duration-300 peer-placeholder-shown:top-1/4 peer-placeholder-shown:-translate-y-1/4 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-200 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm"
                  >
                    Email
                  </label>
                  <span className="test-sm invisible text-red-600">
                    *username properly not written
                  </span>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder=" "
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      onPasswordEnter(e);
                    }}
                    className="peer rounded-button-round bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark text-font placeholder:text-font-light w-full px-5 py-4 text-lg duration-300 focus:border-2 focus:outline-none"
                  />
                  <div
                    className="absolute top-0 right-[10px] h-[40px] w-[40px] translate-y-1/4 bg-pink-400 bg-[url(../../assets/icons/eye.png)]"
                    onClick={onClickEye}
                  ></div>
                  <label
                    htmlFor="password"
                    className="peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements absolute top-0 left-5 -translate-y-1/2 text-sm text-gray-200 duration-300 peer-placeholder-shown:top-1/4 peer-placeholder-shown:-translate-y-1/4 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-200 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm"
                  >
                    Password
                  </label>
                  <span className="test-sm invisible text-red-600">
                    *username properly not written
                  </span>
                </div>
                <button
                  type="submit"
                  className="rounded-button-round from-royalpurple-dark w-full bg-linear-to-tr to-indigo-500 py-4 text-lg font-semibold text-white duration-150 hover:scale-105"
                >
                  Sign Up
                </button>
              </form>
            )}

            {showOtpForm && (
              <form
                className="relative h-[200px] w-full flex-col flex-nowrap gap-5 border-0 border-pink-600 px-12 pb-2"
                onSubmit={handleOtpSubmit}
              >
                <div className="relative">
                  <input
                    id="otp"
                    type="text"
                    placeholder=" "
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    className="peer rounded-button-round bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark text-font placeholder:text-font-light w-full px-5 py-4 text-lg duration-300 focus:border-2 focus:outline-none"
                  />
                  <label
                    htmlFor="otp"
                    className="peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements absolute top-0 left-5 -translate-y-1/2 text-sm text-gray-200 duration-300 peer-placeholder-shown:top-1/4 peer-placeholder-shown:-translate-y-1/4 peer-placeholder-shown:text-xl peer-placeholder-shown:text-gray-200 peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-sm"
                  >
                    Otp
                  </label>
                  <span className="test-sm text-green-600">*An Otp has been sent to your mail</span>
                </div>
                <button
                  type="submit"
                  className="rounded-button-round from-royalpurple-dark w-full bg-linear-to-tr to-indigo-500 py-4 text-lg font-semibold text-white duration-150 hover:scale-105"
                >
                  Send Otp
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInPopUp;
