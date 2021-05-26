import React, { useContext } from 'react'
import cookie from 'react-cookies'
import '../css/Cart.css'
import { StateContext } from '../StateProvider';

function Cart() {

    const [state, dispatch] = useContext(StateContext)
    let total = 0

    const handleOnClick = (key, value) => {
        console.log('handleOnClick ran')
        let type = 'ADD_TO_CART'
        console.log('+')
        if (value === '-') {
            console.log('-')
            type = 'REMOVE_FROM_CART'
        }
        const { imgUrl, title, price } = state.Items[key]
        fetch('/api/updateCart/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN': cookie.load('csrftoken')
            },
            body: JSON.stringify({
                'action': value,
                'imgUrl': imgUrl,
                'title': title,
                'price': price,
            })
        })
            .then(res => res.json())
            .then(data => {
                dispatch({
                    type: type,
                    len: 1,
                    item: { [data.imgUrl]: data }
                })
            })
            .catch(err => console.log(err))
    }

    const placeOrder = () => {

        fetch('/api/placeOrder/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN': cookie.load('csrftoken')
            },
            body: JSON.stringify({
                'items': state.Items,
            })
        })
            .then(res => {
                if (res.ok) {
                    fetch('/api/emptyCart/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRFTOKEN': cookie.load('csrftoken')
                        }
                    })
                        .then(res => {
                            if (res.ok) {

                                dispatch({
                                    type: 'EMPTY',
                                })
                                console.log("order successful.")
                                alert('Order Successful')
                                window.location.href = '/Orders'
                            }
                        })
                        .catch(err => console.log(err))


                }
                else if (res.status === 403) {
                    window.location.href = '/Signin'
                }
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            {
                Object.keys(state.Items).map((key) => {
                    const { imgUrl, title, price, quantity } = state.Items[key]
                    total += price * quantity
                    return (

                        <div className="product">
                            <div className="img-box">
                                <img src={imgUrl} alt={title} />
                            </div>
                            <div className="title-price">
                                <div className="title">{title}</div>
                                <span className="price"> &#8377; {price}</span>
                                <div>
                                    <input type="button" className="btn" value=' - ' onClick={() => handleOnClick(imgUrl, '-')} />
                                    <span>{quantity}</span>
                                    <input type="button" className="btn" value=' + ' onClick={() => handleOnClick(imgUrl, '+')} />
                                </div>
                            </div>
                            <div className="subtotal">
                                <b>Sub Total</b><br />
                                {price * quantity}
                            </div>
                        </div>
                    )
                })
            }
            { state.len > 0 && (
                <div>
                    <div className="total">
                        <b>Total</b><br />
                        {total}
                    </div>
                    <div>
                        <input type="button" className="btn" value="Place Your Order" onClick={placeOrder} />
                    </div>
                </div>
            )
            }
        </>
    );
}

export default Cart;