import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './Features/Dashboard'
import ListApk from './Features/ListApk';
import ApkDetails from './Features/ApkDetails';
import AddApk from './Features/AddApk';
import { Toaster } from 'sonner';
import DeleteApk from './Features/DeleteApk';
import EditApk from './Features/EditApk';
import  UpdateApk  from './Features/UpdateApk';
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
       <Toaster richColors position="top-center" />
     <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/allApks" element={<ListApk />}/>
         <Route path="/apkdetails/:id" element={<ApkDetails />}/>
             <Route path="/updateapk/:id" element={<UpdateApk />}/>
         <Route  path='/addApk' element={<AddApk />}/>
         <Route path='/deleteApk' element={<DeleteApk />}/>
         <Route path='/editApks' element={<EditApk />}/>
      </Routes>

    </>
  )
}

export default App
