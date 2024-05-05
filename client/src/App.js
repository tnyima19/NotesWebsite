import React from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import NotesViewPage from "./pages/NotesViewPage";
import Homepage from "./pages/Homepage";



import "./App.css";


// function Navigation(props) {
//   return (
//     <nav className="navbar navbar-expand-sm navbar-dark bg-dark shadow mb-3">
//       <div className="container-fluid">
//         <Link className="navbar-brand" to="/">
//           Micro Blog
//         </Link>
//         <ul className="navbar-nav me-auto">
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/posts/new">
//               Create a Micro Post
//             </NavLink>
//           </li>
//           <li className="nav-item">
//             <NavLink className="nav-link" to="/Login">
//               Logout
//             </NavLink>
//           </li>
//         </ul>
//       </div>
//     </nav>
//   );
// }


function App() {
 return (
   <BrowserRouter>
     {/* <Navigation /> */}
     <div className="container-xl text-center">
       <div className="row justify-content-center">
         <Routes>
           <Route path="/Login" element={<LoginPage />} />
           <Route path="/Signup" element={<SignUpPage />} />
           <Route path="" element={<NotesViewPage />} />
            <Route path="/home" element={<Homepage />} />          
         </Routes>
       </div>
     </div>
   </BrowserRouter>
 );
}


export default App;


