import React from "react";
import "../../component/dashboard/dasboard.css";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { auth } from '../../firebase';
import { signOut } from "firebase/auth";

const Dasboard = () => {
  const  navigate = useNavigate()
  const logout = ()=>{
    signOut(auth).then(()=>{
       localStorage.clear()
       navigate('/login')
    }).catch((error)=>{
      console.log(error)
    });
  }
  return (
    <div className="dashboard-wrapper">
      <div className="side-nav">
        <div className="profile-info">
          <img src={localStorage.getItem("photoURL")} />
          <div>
            <p>{localStorage.getItem("cName")}</p>
            <button className="logout-btn" onClick={logout}>Logout</button>
          </div>
        </div>

        <div className="menu">
          <Link className="menu-link" to="/dashboard/home">
          <i class="fa-solid fa-house"> </i>
             Home
          </Link>
          <Link className="menu-link" to="/dashboard/invoices">
          <i class="fa-solid fa-file-invoice"></i>
             Invoices
          </Link>
          <Link className="menu-link" to="/dashboard/newinvoice">
          <i class="fa-solid fa-file-circle-plus"></i>
             New Invoice
          </Link>
          <Link className="menu-link" to="/dashboard/setting">
          <i class="fa-solid fa-gear"></i>
            Setting
          </Link>
        </div>
      </div>

      <div className="main-container">
        <Outlet/>
      </div>
    </div>
  );
};

export default Dasboard;
