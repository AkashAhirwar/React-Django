import React, { useContext, useEffect, useRef, useState } from "react";
import cookie from 'react-cookies'
import Logo from "../assets/logo.png";
import searchIcon from "../assets/search.png";
import searchIconb from "../assets/searchb.png";
import Cartlogo from "../assets/cart.png";
import '../css/Header.css'
import { StateContext } from "../StateProvider";

function Header() {

  const [input, setInput] = useState('')
  const [state, dispatch] = useContext(StateContext)
  const [show, setShow] = useState(false)
  const [user, setUser] = useState('')
  const [sticky, setSticky] = useState('')
  const inputRef = useRef(null)

  const getData = () => {
    fetch('/api/user/')
      .then(res => res.json())
      .then(res => {
        setUser(res.user)
      })

    fetch('/api/GetCart/')
      .then(res => res.json())
      .then(data => {
        dispatch({
          type: 'UPDATE_CART',
          len: data['length'],
          item: data.items
        })
      })
  }

  useEffect(() => {
    getData()
  }, [])


  const userOnClick = () => {
    setShow(!show)
  }

  const signOut = () => {
    fetch('/api/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN': cookie.load('csrftoken')
      },
      body: JSON.stringify({

      })
    }).then(res => {
      if (res.ok)
        console.log('signed out')
    })
  }

  const handleOnChange = (e) => {
    setInput(e.target.value)
  }

  const handleOnClick = () => {

    if (input.trim())
      window.location.href = `/s/${input}`
    else
      inputRef.current.focus()
  }

  const handleKeyPress = (e) => {
    if (e.charCode === 13) {
      handleOnClick()
    }
  }

  window.onscroll = () => {
    if (window.pageYOffset > document.getElementById("header").offsetTop) {
      setSticky(" sticky")
    }
    else {
      setSticky("")
    }
  }

  return (
    <>
      <header id="header">
        <div className={`header${sticky}`}>
          <div className="logo">
            <a href="/">
              <img className="img" src={Logo} alt="logo" />
            </a>
          </div>
          <div className="search-box">
            <input
              className="search-input"
              type="text"
              onKeyPress={handleKeyPress}
              placeholder="Search Products Here"
              onChange={handleOnChange}
              value={input}
              ref={inputRef}>
            </input>
            <img src={searchIconb} className="search-btn-b" alt="search icon" />
            <img src={searchIcon} className="search-btn" onClick={handleOnClick} alt="search icon" />
          </div>
          <div className="navbar">
            <div className="nav-ul">
              <div className="signin">
                {
                  user && (
                    <div >
                      <span id="user" onClick={userOnClick}>{user}</span>
                      {show && (
                        <div className="dropdown">
                          <a href="/Orders">Your Orders</a>
                          <a href='/' onClick={signOut}>Sign Out</a>
                        </div>)
                      }
                    </div>

                  )
                }
                {!user && <a href="/Signin">Sign in</a>}
              </div>
              <div className="cart">
                <a href="/Cart">
                  <img src={Cartlogo} alt="cart logo" />
                  <span id="cartItems">{state.len}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
