import React, { useEffect, useState } from 'react'
import cookie from 'react-cookies'
import '../css/Signin.css'

function Signin() {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {

    fetch('/api/user')
      .then(res => res.json())
      .then(res => {
        if (res.user !== "") {
          window.location.href = '/'
        }
      })

  }, [])

  const handleOnChange = (e) => {
    if (e.target.id === 'email')
      setEmail(e.target.value)
    else
      setPassword(e.target.value)
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    fetch('/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': "application/json",
        'X-CSRFTOKEN': cookie.load('csrftoken'),
      },
      body: JSON.stringify({
        'username': email,
        'password': password,
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.login === true)
          window.location.href = '/'
        else
          window.location.href = '/Signin'
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      <div className="form-container">
        <h2>Sign-in</h2>
        <form className="form" onSubmit={handleOnSubmit}>
          <label className="label" for="email"><b>Email</b></label>
          <input className="input" type="email" id="email" value={email} onChange={handleOnChange} required />
          <label className="label" for="password"><b>Password</b></label>
          <input className="input" type="password" id="password" value={password} onChange={handleOnChange} required />
          <input className="btn" type="submit" value="Sign In" />
        </form>
      </div>
      <div>
        <h5>New to Amazon?</h5>
        <a href="/Signup" role="button">
          Create Your Account
        </a>
      </div>
    </>
  );
}

export default Signin;