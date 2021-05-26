import React, { useContext } from 'react'
import cookie from 'react-cookies'
import { StateContext } from '../StateProvider';
import '../css/Product.css'

function Product(props) {
  const { imgUrl, title, price } = props.productDetail
  const [state, dispatch] = useContext(StateContext)

  const addToCart = () => {
    fetch('/api/updateCart/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN': cookie.load('csrftoken')
      },
      body: JSON.stringify({
        'action': '+',
        'imgUrl': imgUrl,
        'title': title,
        'price': price,
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log('data', data)
        dispatch({
          type: 'ADD_TO_CART',
          len: 1,
          item: { [data.imgUrl]: data }
        })
      })
      .catch(err => console.log(err))
  }

  return (
    <>
      <div className="product">
        <div className="img-box">
          <img src={imgUrl} alt={title} />
        </div>
        <div className="title-price">
          <div className="title">{title}</div>
          <span className="price"> &#8377; {price}</span>
          <input type="button" className="btn" onClick={addToCart} value="Add To Cart" />
        </div>
      </div>
    </>
  )
}

export default Product