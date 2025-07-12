import React, { useEffect , useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const SignInPopUp = ({ isOpen, onClose }) => {
  const [username , setUsername] = useState('')
  const [email , setEmail]  = useState('')
  const [otp , setOtp] = useState('')
  const [password , setPassword] = useState('')
  const [showOtpForm , setShowOtpForm] = useState(false)
  useEffect(() => {
    const onEsc = e => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);
  // this is where i am going to do all the form handling and stuff , and this is the function that will send data to the backend , so feel free to move it to another folder or something like that
function formValidation(user_name , user_email , user_password){
  let u_name = true
  let u_email = true
  let u_password = true
  let regex = /^[^\s@]+@(gmail\.com|student\.[a-zA-Z]+\.edu\.np)$/
  if(!regex.test(user_email)) u_email = false
  regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
  if(!regex.test(user_password)) u_password = false
  if(user_name.length < 8) u_name = false
  return {u_name , u_email , u_password}
}
  const handleSubmit = async (e) =>{
    e.preventDefault()
    const replyValidatoin = formValidation(username , email , password);
  if(!replyValidatoin.u_email || !replyValidatoin.u_name || !replyValidatoin.u_password){
    console.log(replyValidatoin)
    return;
  }
    try{
      const response = await fetch('http://localhost:5000/register', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'}, 
        body : JSON.stringify({username , password , email})
      })
      const data = await response.json()
      if(response.ok){
        console.log(data)
        setShowOtpForm(true) 
      }
      else
      {
        console.log('error has occured while registering the data')
        console.log(data)
      }

    }
    catch(err)
    {
      console.error(err)
    }
  }
  const handleOtpSubmit = async(e) =>{
    e.preventDefault()
    try{
      const response = await fetch('http://localhost:5000/register/otp', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'}, 
        body : JSON.stringify({otp})
      })
      const data = await response.json()
      if(response.ok){
        console.log(data)
      }
      else
      {
        console.log('error has occured while registering the data')
        console.log(data)
      }

    }
    catch(err)
    {
      console.error(err)
    }
    
  }
 function onClickEye(e)
 {
  const passwordField = e.currentTarget.previousSibling 
  console.log(typeof passwordField.type)
  if(passwordField.type === 'password') passwordField.type = 'text'
  else passwordField.type='password'
 }
 function onUserEnter(e)
 {
  const usernameField = e.currentTarget;
  const usernameInfo = usernameField.nextSibling.nextSibling;
  if(usernameField.value.length === 0) {
    usernameInfo.classList.remove('visible')
    usernameInfo.classList.add('invisible')
    return;
  }
  usernameInfo.classList.remove('invisible')
  usernameInfo.classList.add('visible')
  if(usernameField.value.length < 8){
    usernameInfo.innerText = `*username must be at least 8 letter long`
    usernameInfo.classList.remove('text-green-600')
    usernameInfo.classList.add('text-red-600')
  } 
  else{
    usernameInfo.innerText = `*valid username`
    usernameInfo.classList.remove('text-red-600')
    usernameInfo.classList.add('text-green-600')
  }
 }
 function onEmailEnter(e)
 {
  const emailField = e.currentTarget;
  const emailInfo = emailField.nextSibling.nextSibling;
  const regex = /^[^\s@]+@(gmail\.com|student\.[a-zA-Z]+\.edu\.np)$/
  if(emailField.value.length === 0) {
    emailInfo.classList.remove('visible')
    emailInfo.classList.add('invisible')
    return;
  }
  emailInfo.classList.remove('invisible')
  emailInfo.classList.add('visible')
  if(!regex.test(emailField.value)){
    emailInfo.innerText = `*invalid email format used`
    emailInfo.classList.remove('text-green-600')
    emailInfo.classList.add('text-red-600')
  } 
  else{
    emailInfo.innerText = `*valid email format`
    emailInfo.classList.remove('text-red-600')
    emailInfo.classList.add('text-green-600')
  }
 }
 function onPasswordEnter(e)
 {
  const passwordField = e.currentTarget;
  const passwordInfo = passwordField.nextSibling.nextSibling.nextSibling;
  const regex = /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
  if(passwordField.value.length === 0) {
    passwordInfo.classList.remove('visible')
    passwordInfo.classList.add('invisible')
    return;
  }
  passwordInfo.classList.remove('invisible')
  passwordInfo.classList.add('visible')
  if(!regex.test(passwordField.value)){
    passwordInfo.innerText = `*atleast 1 symbol and number required with 8 letter long`
    passwordInfo.classList.remove('text-green-600')
    passwordInfo.classList.add('text-red-600')
  } 
  else{
    passwordInfo.innerText = `*valid password format`
    passwordInfo.classList.remove('text-red-600')
    passwordInfo.classList.add('text-green-600')
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
            className="bg-layout-elements  rounded-2xl w-[500px] h-[550px] text-font relative shadow-2xl flex flex-col flex-nowrap "
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-4xl relative font-semibold mb-8 text-center  grow-1 flex justify-center items-center rounded-tr-2xl rounded-tl-2xl bg-linear-to-tr from-royalpurple-dark to-indigo-500">Create Your Account
            <button
              onClick={onClose}
              className="text-font hover:text-royalpurple-dark absolute top-4 right-4 text-3xl leading-none font-bold"
              aria-label="Close sign in popup"
            >
              &times;
            </button>
               </h2>
          {!showOtpForm && (<form className="w-full h-fit px-12 pb-2 flex flex-col flex-nowrap gap-5 relative  border-0  border-pink-600" onSubmit ={handleSubmit}>
              <div className ="relative">
              <input
                id='username'
                type="text"
                placeholder=" "
                value = {username}
                onChange={(e)=>{ setUsername(e.target.value)
                  onUserEnter(e)
                }}
                className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
              />
              <label htmlFor="username" className= "absolute left-5 top-0 text-sm text-gray-200   -translate-y-1/2 peer-placeholder-shown:top-1/4   peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:-translate-y-1/4">Username</label>
              <span className='test-sm text-red-600 invisible'>*username properly not written</span>
              </div>
              <div className='relative'>
              <input
                id='email'
                type="email"
                placeholder=" "
                value = {email}
                onChange={(e)=> {setEmail(e.target.value)
                  onEmailEnter(e)
                }}
                className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
              />
              <label htmlFor="email" className= "absolute left-5 top-0 text-sm text-gray-200   -translate-y-1/2 peer-placeholder-shown:top-1/4   peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:-translate-y-1/4">Email</label>
              <span className='test-sm text-red-600 invisible'>*username properly not written</span>
              </div>
              <div className='relative'>
              <input
                id='password'
                type="password"
                placeholder=" "
                value = {password}
                onChange={(e)=> {setPassword(e.target.value)
                  onPasswordEnter(e)
                }}
                className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
              />
              <div className='absolute bg-[url(../../assets/icons/eye.png)] bg-pink-400 h-[40px] w-[40px] right-[10px] top-0 translate-y-1/4' onClick={onClickEye}></div>
              <label htmlFor="password" className= "absolute left-5 top-0 text-sm text-gray-200   -translate-y-1/2 peer-placeholder-shown:top-1/4   peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:-translate-y-1/4">Password</label>
              <span className='test-sm text-red-600 invisible'>*username properly not written</span>
              </div>
              <button
                type="submit"
                className=" w-full py-4 text-lg rounded-button-round text-white font-semibold bg-linear-to-tr from-royalpurple-dark to-indigo-500 hover:scale-105 duration-150"
              >
                Sign Up
              </button>
            </form>)}
            
           {showOtpForm && (<form className="w-full h-[200px] px-12 pb-2  flex-col flex-nowrap gap-5 relative  border-0  border-pink-600" onSubmit ={handleOtpSubmit}>
              <div className ="relative">
              <input
                id='otp'
                type="text"
                placeholder=" "
                value = {otp}
                onChange={e=>setOtp(e.target.value)}
                className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
              />
              <label htmlFor="otp" className= "absolute left-5 top-0 text-sm text-gray-200   -translate-y-1/2 peer-placeholder-shown:top-1/4   peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:-translate-y-1/4">Otp</label>
              <span className='test-sm text-green-600'>*An Otp has been sent to your mail</span>
              </div>
              <button
                type="submit"
                className=" w-full py-4 text-lg rounded-button-round text-white font-semibold bg-linear-to-tr from-royalpurple-dark to-indigo-500 hover:scale-105 duration-150"
              >
                Send Otp
              </button>
            </form>)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SignInPopUp;
