import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'



const InvoiceDetail = () => {
 const location = useLocation()
 const [data] = useState(location.state)
 console.log(data)

 const printInvoice = ()=>{
   const input = document.getElementById('invoice')
   html2canvas(input,{useCORS:true})
   .then((canvas)=>{
    const imageData = canvas.toDataURL('image/png',1.0)
    const pdf = new jsPDF({
        orientation:'portrait',
        unit:'pt',
        format:[612,792]
    })
    pdf.internal.scaleFactor = 1
    const imageProps = pdf.getImageProperties(imageData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHight = (imageProps.height*pdfWidth)/imageProps.width

    pdf.addImage(imageData,'PNG',0,0,pdfWidth,pdfHight)
    pdf.save('invoice' + new Date().toLocaleDateString() + '.pdf')
   })

 }

  return (
    <div>
        <div className='invoice-top-header'>
        <button onClick={printInvoice} className='print-btn'>Print Invoice</button>
        </div>
      <div id='invoice' className='invoice-wrapper'> 
        <div className='invoice-header'>
            <div className='compant-detail'>
              <img className='company-logo' alt='logo' src={localStorage.getItem('photoURL')}/>
              <p className='cName'>{localStorage.getItem('cName')}</p>
              <p className='logoemail'>{localStorage.getItem('email')}</p>
            </div>
            <div className='customer-detail'>
              <h1>Invoice</h1>
              <p>To:- {data.to} </p>
              <p>Phone:- {data.phone}</p>
              <p>Address:- {data.address}</p>
            </div>
        </div> 
        <h4 className='product-table-heading'>Product List</h4>
        <table className='product-table'>
          <thead>
          <tr>
                <th>S.No</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {
                data.product.map(product=>(
                    <tr key={product.id}>
                      <td>{product.id+1}</td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.qty}</td>
                      <td> ₹{product.qty * product.price}</td>
                    </tr>
                ))
            }
          </tbody>
          <tfoot>
            <tr>
                <td colSpan='4'>Total cost</td>
                <td>₹{data.total}</td>
            </tr>
          </tfoot>
        </table>

      </div>
      
    </div>
  )
}

export default InvoiceDetail
