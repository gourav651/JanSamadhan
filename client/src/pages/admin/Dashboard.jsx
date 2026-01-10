import React from 'react'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const navigate = useNavigate();
  return (
    <div>
      <h1>AdminDashboard</h1>
      <button className='cursor-pointer' onClick={()=> navigate("/")}>go to home page</button>
    </div>
  )
}

export default AdminDashboard