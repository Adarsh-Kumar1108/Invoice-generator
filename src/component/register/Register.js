import React, { useRef ,useState} from 'react'
import '../login/Login.css';
import {auth,storage,db} from '../../firebase'
import {createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import { getDownloadURL,ref,uploadBytesResumable } from 'firebase/storage';
import { doc,setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const fileInputRef=useRef(null);
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [file,setFile] = useState(null)
  const [displayName,setDisplayName] = useState('')
  const [imageUrl,setImageUrl] = useState(null)
  const [isLoading,setLoading] = useState(false)

  const Navigate = useNavigate()

  const onSelectFile = (e)=>{
    setFile(e.target.files[0])
    setImageUrl(URL.createObjectURL(e.target.files[0]))
  }

  const submitHandler = (e)=>{
    e.preventDefault()
    setLoading(true)
    console.log(email,password)

    createUserWithEmailAndPassword(auth,email,password)
    .then(newUser=>{
      
      console.log(newUser)
      const date=new Date().getTime()
      const storageRef = ref(storage,`${displayName + date}`)
      uploadBytesResumable(storageRef,file)
      .then(res=>{
        console.log(res)
        getDownloadURL(storageRef)
        .then(
          downloadUrl=>{
          console.log(downloadUrl)
          updateProfile(newUser.user,{
            displayName:displayName,
            photoURL:downloadUrl
          })

          setDoc(doc(db,"users",newUser.user.uid),{
            uid:newUser.user.uid,
            displayName:displayName,
            email:email,
            password:password,
            photoURL:downloadUrl
          })
          localStorage.setItem('cName',displayName)
          localStorage.setItem('photoURL',downloadUrl)
          localStorage.setItem('email',newUser.user.email)
          localStorage.setItem('uid',newUser.user.uid)
          Navigate('/dashboard')
          setLoading(false)

        })
      })
    })
    .catch(error=>{
      setLoading(false)
      console.log(error)
    })
  }
  return (
    <div className='login-wrapper'>
      <div className='login-container'>
      <div className='login-img'>
      </div>
        <div className='login-inbox'>
        <h1>Register</h1>
          <form onSubmit={submitHandler}>
          <input required onChange={(e)=>{setDisplayName(e.target.value)}} className='login-input' type='text' placeholder='Company name'></input>
          <input required onChange={(e)=>{setEmail(e.target.value)}} className='login-input' type='text' placeholder='Enter email'></input>
          <input required onChange={(e)=>{setPassword(e.target.value)}} className='login-input' type='password' placeholder='Enter password'></input>
          <input required onChange={(e)=>{onSelectFile(e)}} style={{display:"none"}}className='login-input file' type='file' ref={fileInputRef} ></input>
          <input required className='login-input input-logo' type='button' value='Select your Company logo' onClick={()=>{fileInputRef.current.click()}}></input>
          {imageUrl != null && <img className='image-preview' alt='logo' src={imageUrl}/>
          }
          <button className='login-input login-btn' type='submit'>{ isLoading &&<i class="fa-solid fa-spinner fa-spin-pulse fa-spin-reverse"></i> }Submit</button>
          </form>
          <a href="/login">Already have an Account</a>
        </div>

      </div> 
    </div>
  )
}

export default Register

