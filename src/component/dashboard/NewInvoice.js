import React from 'react'
import { useState } from 'react'
import { db } from '../../firebase'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'

const NewInvoice = () => {

    const [to,setTo] = useState('')
    const [phone,setPhone] = useState('')
    const [address,setAddress] = useState('')
    const [productName,setproductName] = useState('')
    const [price,setPrice] = useState('')
    const [qty,setQty]  = useState(0)
    const [total, setTotal] = useState(0)


    //  const [product ,setProduct] = useState([
    //     {id:0,name:'laptop',price:36276,qty:3},
    //     {id:1,name:'phone',price:23646,qty:2},
    //     {id:2,name:'camera',price:1500,qty:7}

    //  ])
    const [product ,setProduct] = useState([])
    const navigation = useNavigate()

    const addProduct = ()=>{
        setProduct([...product,{'id':product.length,'name':productName,'price':price,'qty':qty}])
        const t =qty*price
        setTotal(total+t)
        setproductName('')
        setPrice('')
        setQty(1)
    }

    const saveData = async()=>{
        console.log(to,phone,address)
        console.log(productName)
        console.log(total)
        const data = await addDoc(collection(db,'invoice'),{
          to:to,
          phone:phone,
          address:address,
          product:product,
          total:total,
          uid:localStorage.getItem('uid'),
          date:Timestamp.fromDate(new Date())

        })
        console.log(data)
        navigation('/dashboard/invoices')
    }
  return (
    <div>
      <div className='header-row'>
      <p className='new-invoice-heading setting'>New Invoice</p>
      <button onClick={saveData} className='add-btn' type='button'>Save Data</button>
      </div>
      <form className='new-invoice-form'>
        <div className='first-row'>
           <input onChange={e=>{setTo(e.target.value)}} placeholder='To' value={to}></input> 
           <input onChange={e=>{setPhone(e.target.value)}} placeholder='Phone' value={phone}></input>
           <input onChange={e=>{setAddress(e.target.value)}} placeholder='Address' value={address}></input>
        </div>
    
        <div className='first-row'>
           <input onChange={e=>{setproductName(e.target.value)}} placeholder='Product name' value={productName}></input>
           <input onChange={e=>{setPrice(e.target.value)}} placeholder='Price' value={price}></input>
           <input onChange={e=>{setQty(e.target.value)}} type='number' placeholder='Quantity' value={qty}></input>
          
        </div>
        <button onClick={addProduct} className='add-btn' type='button'>Add Product</button>
      </form>

      { product.length>0 && <div className='product-wrapper'>

        <div className='product-list'>
             <p>S.No</p>
             <p>Product</p>
             <p>Price</p>
             <p>Quantity</p>
             <p>Total Price</p>
        </div>
        {
            
            product.map((data,index)=>(
                <div className='product-list' key={index}>
                    <p>{index+1}</p>
                    <p>{data.name} </p>
                    <p>₹{data.price} </p>
                    <p>{data.qty}</p>
                    <p>₹{data.qty * data.price}</p>
                </div>
            ))
        }
        <div className='total-wrapper'>
        <p>Total: ₹{total}</p>
        </div>
      </div>
      }
    </div>
  )
}

export default NewInvoice
