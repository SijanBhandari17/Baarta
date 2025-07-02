import React, { useEffect , useState} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPopUp = ({ isOpen, onClose }) => {
  const [email , setEmail] = useState('')
  const [password , setPassword] = useState('')
  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [isOpen, onClose]);
 const handleLogin = async (e) =>{
    e.preventDefault()
    try{
      const response = await fetch('http://localhost:5000/login' , {
        method : 'POST',
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify({email , password})
      })
      const data = await response.json()
      if(response.ok){
        console.log(`successful login done`)
      }
      else{
        console.log('login failed')
      }
      console.log(data)
    }
    catch(err)
    {
      console.error(`Err : ${err}`)
    }
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

            <form className="space-y-6" onSubmit = {handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value = {email}
                onChange={(e)=> setEmail(e.target.value)}
                className="w-full rounded-button-round py-4 px-5 text-lg bg-layout-elements-focus text-font placeholder:text-font-light focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value = {password}
                onChange={(e)=> setPassword(e.target.value)}
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
