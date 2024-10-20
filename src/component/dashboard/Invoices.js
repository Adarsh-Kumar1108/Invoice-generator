import React, { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
   
    const q =query(collection(db,'invoice'),where('uid' , "==" , localStorage.getItem('uid')))
    try {
      const querySnapshot = await getDocs(q); // Ensure this matches your Firestore collection name
      if (querySnapshot.empty) {
        console.log("No documents found.");
        setInvoices([]);
        return;
      }
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Fetched data:", data);
      setInvoices(data);
      
    } catch (error) {
      
      console.error("Error fetching data:", error);
    }
  };

  const deleteInvoice = async (id) => {
    const isSure = window.confirm("Are you sure you want to delete this invoice?");
    if (isSure) {
      try {
        await deleteDoc(doc(db, 'invoice', id)); // Ensure this matches your Firestore collection name
        getData(); // Refresh the list of invoices
      } catch (error) {
        window.alert("Something went wrong while deleting the invoice.");
        console.error("Error deleting invoice:", error);
      }
    }
  };

  return (
    <div>
      <p className='setting'>Invoices</p>
      
      {
      invoices.map(data => (
    
        <div className='box' key={data.id}>
          <p>{data.to}</p>
          {/* Replace `data.date` with the actual date field name in your documents */}
          <p>{data.date ? new Date(data.date.seconds * 1000).toLocaleDateString() : 'No date available'}</p>
          <p>₹ {data.total}</p>
          <button onClick={() => deleteInvoice(data.id)} className='delete-btn'><i class="fa-solid fa-trash"></i> Delete</button>
          <button onClick={() => navigate('/dashboard/invoice-detail', { state: data })} className='delate-btn view-btn'><i class="fa-solid fa-eye"></i>View</button>
        </div>
      ))
      }

      {
        invoices.length<1 && 
          <div className='no-invoice-wrapper'>
          <i className="fa-solid fa-scroll fa-flip icon" style={{ "--fa-flip-x": 0, "--fa-flip-y": 0, "fontSize":30, }}></i>
            <p>You have no invoice till now</p>
            <button onClick={()=>{navigate('/dashboard/newinvoice')}}>Create New Invoice</button>
          </div>
      }
    
    </div>
  );
};

export default Invoices;
