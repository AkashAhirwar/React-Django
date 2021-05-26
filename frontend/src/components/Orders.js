import React, { useEffect, useState } from 'react'
import '../css/Orders.css'

function Orders() {

    const [orders, setOrders] = useState([])

    useEffect(() => {
        fetch('/api/getOrders/')
            .then(res => {
                if (res.ok) {
                    res.json().then(data => setOrders(data))
                }
                else if (res.status === 404) {
                    window.location.href = '/Signin'
                }
            })
            .catch(err => console.log(err))
    }, [])


    return (
        <>
            {
                orders.map(order => {
                    let total = 0
                    return (
                        <div className="order">
                            <b>Order {order[0].date}</b>
                            {
                                order.slice(1,).map(item => {
                                    const { imgUrl, title, price, quantity } = item
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
                                                    <span>Quantity: {quantity}</span>
                                                </div>
                                            </div>
                                            <div className="subtotal">
                                                Sub Total<br />
                                                {price * quantity}
                                            </div>
                                        </div>
                                    )
                                })
                            }
                            <div className="total">
                                <b>Total</b><br />
                                {total}
                            </div>
                        </div>
                    )
                })
            }
        </>
    )

}

export default Orders