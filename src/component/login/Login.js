import React, { useState } from 'react';
import './Login.css';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading,setLoading] = useState(false);

  const navigate = useNavigate(); // Use the conventional name `navigate`

  const submitHandler = (e) => {
    setLoading(true)
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        localStorage.setItem('cName', user.displayName);
        localStorage.setItem('photoURL', user.photoURL);
        localStorage.setItem('email', user.email);
        localStorage.setItem('uid',user.uid);

        navigate('/dashboard'); // Use `navigate` to redirect
        setLoading(false)
      })
      .catch((error) => {
        setLoading(false)
        console.log(error);
      });
  };

  return (
    <div className='login-wrapper'>
      <div className='login-container'>
        <div className='login-img'></div>
        <div className='login-inbox'>
          <h1>Login</h1>
          <form onSubmit={submitHandler}>
            <input required
              onChange={(e) => setEmail(e.target.value)} 
              className='login-input' 
              type='text' 
              placeholder='Enter email' 
            />
            <input required
              onChange={(e) => setPassword(e.target.value)} 
              className='login-input' 
              type='password' 
              placeholder='Enter password' 
            />
            <button 
              className='login-input login-btn' 
             >{isLoading && <i class="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></i>}submit
            </button>
          </form>
          <a href="/register">Create an Account</a>
        </div>
      </div> 
    </div>
  );
};

export default Login;
