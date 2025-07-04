import React from 'react'
import './AddProduct.css'
import upload_area from '../../Assets/upload_area.svg'
import { useState } from 'react'
const AddProduct = () => {
  const [image,setImage]=useState(false);
  const [productDetails,setProductDetails]= useState({
    name:"",
    image:"",
    category:"",
    old_price:"",
    new_price:"",

  })
  const imagehandler=(e)=>{
    setImage(e.target.files[0]);
            
  }
  const changehandler=(e)=>{
    setProductDetails({...productDetails,[e.target.name]:e.target.value});
            
  }
  const Add_Product = async () => {
    console.log(productDetails);
    let responseData;
    let product = productDetails;
    let formData = new FormData();
    formData.append('product', image);
  
    await fetch('http://localhost:3000/upload', {
      method: 'POST',
      headers: {
        Accept: 'application/json'
      },
      body: formData,
    })
      .then((resp) => resp.json())
      .then((data) => {
        responseData = data;
      });
  
    if (responseData.success) {
      product.image = responseData.image_url;
      console.log("Final product to send:", product);
      await fetch('http://localhost:3000/addproduct', {
        method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type' :'application/json'
      },
      body:JSON.stringify(product),

      }).then((resp) => resp.json())
      .then((data) => {
        data.success ? alert("Product Added") : alert("Failed");
      });
      
    } 
  };
  
  return (
    <div className='addproduct'>
      <div className="addproduct-itemfield">
        <p>Product Title</p>
        <input value={productDetails.name} onChange={changehandler} type='text' name='name' placeholder='Type Here'/>
      </div>
      <div className='addproduct-price'>
      <div className="addproduct-itemfield">
        <p>Price</p>
        <input value={productDetails.old_price} onChange={changehandler} type='text' name='old_price' placeholder='Type Here'/>
      </div>
      <div className="addproduct-itemfield">
        <p>Offer Price</p>
        <input value={productDetails.new_price} onChange={changehandler} type='text' name='new_price' placeholder='Type Here'/>
      </div>
    </div>
    <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select value={productDetails.category} onChange={changehandler} name='category' className='add-product-selector'>
          <option value='women'>Women</option>
          <option value='men'>Men</option>
          <option value='kid'>Kid</option>

        </select>
      </div>
      <div className="product-itemfield">
        <label htmlFor='file-input'>
          <img src={image?URL.createObjectURL(image):upload_area} className='addproduct-thumnail-img'/>
        </label>
        <input onChange={imagehandler}type='file' name='image' id='file-input' hidden/>
      </div>
      <button onClick={()=>{Add_Product()}} className='addproduct-btn'>Add</button>
    </div>
    
  )
}

export default AddProduct
