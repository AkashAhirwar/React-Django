import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Product from './Product'

function Search(props) {
  const [productDetails, SetProductDetails] = useState([])
  const { k } = useParams()
  useEffect(() => {
    fetch(`/api/s/?k=${k}`)
      .then((response) => response.json())
      .then(data => {
        SetProductDetails(data)
      })
      .catch(e => console.log(e))
  }, [k])


  return (
    <>

      {productDetails.length > 0 ?
        productDetails.map((productDetail) => {
          return (
            <Product productDetail={productDetail} />
          )
        }) : <h3>Loading...</h3>
      }
    </>
  )
}

export default Search