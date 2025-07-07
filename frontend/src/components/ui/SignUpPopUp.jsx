import React, { useEffect , useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const SignInPopUp = ({ isOpen, onClose }) => {
  const [username , setUsername] = useState('')
  const [email , setEmail]  = useState('')
  const [password , setPassword] = useState('')
  useEffect(() => {
    const onEsc = (e) => {
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
  let regex = /^[^\s@]+@(gmail\.com|email\.com|ymail\.com)$/
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
            className="bg-layout-elements p-12 rounded-2xl w-[600px] text-font relative shadow-2xl"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-font hover:text-royalpurple-dark font-bold text-3xl leading-none"
              aria-label="Close sign in popup"
            >
              &times;
            </button>

            <h2 className="text-4xl font-semibold mb-8 text-center">Create Your Account</h2>

            <form className="w-full h-fit flex flex-col flex-nowrap gap-6 relative  border-0  border-pink-600" onSubmit ={handleSubmit}>
              <div className ="relative">
              <input
                id='username'
                type="text"
                placeholder=" "
                value = {username}
                onChange={(e)=> setUsername(e.target.value)}
                className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
              />
              <label htmlFor="username" className= "absolute left-5 top-0 text-sm text-gray-200   -translate-y-1/2 peer-placeholder-shown:top-1/4   peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:translate-y-0">Username</label>
              </div>
              <div className='relative'>
              <input
                id='email'
                type="email"
                placeholder=" "
                value = {email}
                onChange={(e)=> setEmail(e.target.value)}
                className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
              />
              <label htmlFor="username" className= "absolute left-5 top-0 text-sm text-gray-200   -translate-y-1/2 peer-placeholder-shown:top-1/4   peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:translate-y-0">Email</label>
              </div>
              <div className='relative'>
              <input
                id='password'
                type="password"
                placeholder=" "
                value = {password}
                onChange={(e)=> setPassword(e.target.value)}
                className="w-full peer rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus focus:bg-layout-elements focus:border-royalpurple-dark focus:border-2 duration-300 text-font placeholder:text-font-light focus:outline-none"
              />
              <label htmlFor="username" className= "absolute left-5 top-0 text-sm text-gray-200   -translate-y-1/2 peer-placeholder-shown:top-1/4   peer-focus:top-0 peer-focus:text-sm peer-focus:text-royalpurple-dark peer-focus:bg-layout-elements peer-focus:-translate-y-1/2 duration-300 peer-placeholder-shown:text-gray-200 peer-placeholder-shown:text-xl peer-placeholder-shown:translate-y-0">Password</label>
              </div>
              <button
                type="submit"
                className="bg-green-600 w-full py-4 text-lg rounded-button-round text-white font-semibold hover:bg-green-700 transition"
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
