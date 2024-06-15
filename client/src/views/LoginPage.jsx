import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../stylesheets/LoginPage.css';

export default function LoginPage({ url }) {

  const [buttonText, setButtonText] = useState('LOG IN')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
 
  async function handleLogin() {
    try {
      setButtonText('Loading...')

      const { data } = await axios.post(`${url}/login`, {
        username,
        password
      })

      localStorage.setItem("access_token", data.access_token)
      navigate('/')

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
      });

    } finally {
      setButtonText('LOG IN')
    }
  }

  async function googleLogin(codeResponse) {
    try {
      setButtonText('Loading...')

      const { data } = await axios.post(`${url}/google-login`, null, {
        headers: {
          token: codeResponse.credential
        }
      });

      localStorage.setItem("access_token", data.access_token)
      navigate('/')

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: error.response.data.message,
      });

    } finally {
      setButtonText('LOG IN')
    }
  }

  return (
    <>
      <div className="positionFrame">
        <div className='bigTitle'>CORE SOLUTIONS</div>
        <div className="outerFrame">
          <div className='loginTitle'>
            BUSINESS ESSENTIALS
          </div>

          <div className='inputGroup'>
            <div className='formLabels'>Username</div>
            <input className='formInputLogin' type="text" placeholder='Username' onChange={(e) => { setUsername(e.target.value) }} />
          </div>

          <div className='inputGroup'>
            <div className='formLabels'>Password</div>
            <input className='formInputLogin' type="password" placeholder='Username' onChange={(e) => { setPassword(e.target.value) }} />
          </div>

          <div className='loginButton' onClick={() => { handleLogin() }}>
            {buttonText}
          </div>

          <GoogleLogin onSuccess={googleLogin} />

        </div>
      </div>
    </>
  )
}