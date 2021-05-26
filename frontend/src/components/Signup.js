import React, { useState } from 'react'
import cookie from 'react-cookies'
import '../css/Signup.css'

function Signup() {
    const [userDetail, setUserDetail] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: '',
    });

    const handleOnChange = (e) => {
        const name = e.target.name
        const value = e.target.value
        setUserDetail({ ...userDetail, [name]: value })
    }

    const handleOnSubmit = (e) => {
        e.preventDefault()
        if (userDetail.password === userDetail.password2) {
            fetch('/api/create/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFTOKEN': cookie.load('csrftoken'),
                },
                body: JSON.stringify({
                    'username': userDetail.email,
                    'first_name': userDetail.firstName,
                    'last_name': userDetail.lastName,
                    'email': userDetail.email,
                    'password': userDetail.password,
                })
            }).then(res => {
                if (res.ok) {
                    window.location.href = "/";
                    // console.log(res)
                }
                else {
                    setUserDetail({ ...userDetail, email: '' })
                    alert(`${res.status} ${res.statusText}\nemail already exists`)
                }
            })
        }
        else {
            alert("password do not match");
            // e.target.password2.setCustomValidity("Password do not match");
            // e.target.password2.setCustomValidity('');
        }
    }

    return (
        <>
            <div className="form-container">
                <h2>Create Account</h2>
                <form className="form" onSubmit={handleOnSubmit} >
                    <label className="label"><b>First Name</b></label>
                    <input className="input" type="text" name="firstName" value={userDetail.firstName} onChange={handleOnChange} required />
                    <label className="label"><b>Last Name</b></label>
                    <input className="input" type="text" name="lastName" value={userDetail.lastName} onChange={handleOnChange} required />
                    <label className="label"><b>Email</b></label>
                    <input className="input" type="email" name="email" value={userDetail.email} onChange={handleOnChange} required />
                    <label className="label"><b>Password</b></label>
                    <input className="input" type="password" name="password" value={userDetail.password} onChange={handleOnChange} required />
                    <label className="label"><b>Confirm Password</b></label>
                    <input className="input" type="password" name="password2" value={userDetail.password2} onChange={handleOnChange} required />

                    <input className="btn" type="submit" value="Sign Up" />
                </form>
            </div>
        </>
    )
}

export default Signup