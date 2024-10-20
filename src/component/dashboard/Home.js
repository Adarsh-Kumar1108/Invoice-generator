import Chart, { LinearScale } from 'chart.js/auto'
import { collection, getDocs, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebase'

const Home = () => {
  const [total,setTotal] = useState(0)
  const [totalInvoice,setTotalInvoice] = useState(324)
  const [totalMonthCollection,setTotalMonthCollection] = useState()
  const [invoices , setInvoices] = useState([])

  useEffect(()=>{
    getData()
    // createChart()
  },[])

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
      getOverAllTotal(data);
      getOverMonthsTotal(data);
      monthWiseCollection(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getOverAllTotal = (invoiceList)=>{
    var t=0;
    invoiceList.forEach(data=>{
     t+=data.total
    })
    setTotal(t)
  }

  const getOverMonthsTotal = (invoiceList)=>{
    var mt=0;
    invoiceList.forEach(data=>{
     if(new Date(data.date.seconds * 1000).getMonth()== new Date().getMonth()){
      console.log(data)
      mt+=data.total
     }
    })
      setTotalMonthCollection(mt)
  }

  const monthWiseCollection = (data)=>{
    const chartData = {
      "January":0,
      "Fabruary":0,
      "March":0,
      "April":0,
      "May":0,
      "June":0,
      "July":0,
      "August":0,
      "September":0,
      "October":0,
      "November":0,
      "December":0
    }
    data.forEach(d=>{
      if(new Date(d.date.seconds * 1000).getFullYear() == new Date().getFullYear()){
        console.log("data",d)
        // console.log(new Date(d.date.seconds * 1000).toLocaleDateString('default',{month:'long'}))
        chartData[new Date(d.date.seconds * 1000).toLocaleDateString('default',{month:'long'})]+=d.total;
        
      }
    })
    console.log(chartData)
    createChart(chartData);
  }

  const createChart = (chartData)=>{
    Chart.register(LinearScale)
    const ctx = document.getElementById('myChart');
    

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(chartData),
        datasets: [{
          label: 'Month wise Collection',
          data: Object.values(chartData),
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  return (
    <div>
      <p className='setting'>Home</p>
      <div className='home-first-row'>
        <div className='home-box box1'>
          <h1 className='box-header'>RS {total}</h1>
          <p>Overall</p>
        </div>
        <div className='home-box box2'>
        <h1 className='box-header'>{invoices.length}</h1>
        <p>Invoices</p>
        </div>
        <div className='home-box box3'>
        <h1 className='box-header'>RS {totalMonthCollection}</h1>
        <p>This Month</p>
        </div>
      </div>
      
      <div className='home-second-row'>
        <div className='chat-box'>
            <canvas id="myChart"></canvas>
        </div>
        <div className='recent-invoice-list'>
         <h1>Recent Invoice List</h1>
           {
            invoices.slice(0,6).map(data=>(
              <div>
                  <p>{data.to}</p>
                  <p>{new Date(data.date.seconds * 1000).toLocaleDateString()}</p>
                  <p>{data.total}</p>
              </div>
            ))
           }
        </div>
      </div>
    </div>
  )
}

export default Home
