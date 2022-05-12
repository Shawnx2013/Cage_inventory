import React from "react"
import { Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// pages imports
import Home from './pages/Home';
import Cart from './pages/Cart';
import Inventory from './pages/Inventory';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Reservations from './pages/Reservations';
import Checkin from "./pages/Checkin";
import Login from './pages/Login';
import NewItem from "./pages/NewItem";
import Logout from "./pages/Logout";
import ProtectedRoute from "./components/ProtectedRoute/Protected-Route";
import Kit from './pages/Kit';
import Report from './pages/Report';

function App() {
    return (
        <div className="App">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute> <Cart /> </ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
                    <Route path="/checkin" element={<ProtectedRoute> <Checkin /> </ProtectedRoute>} />
                    <Route path="/inventory" element={<ProtectedRoute> <Inventory /> </ProtectedRoute>} />
                    <Route path="/settings" element={<ProtectedRoute> <Settings /> </ProtectedRoute>} />
                    <Route path="/reservations" element={<ProtectedRoute> <Reservations /> </ProtectedRoute>} />
                    <Route path="/newItem" element={<ProtectedRoute> <NewItem /> </ProtectedRoute>} />
                    <Route path="/kit" element={<ProtectedRoute> <Kit /> </ProtectedRoute>} />
                    <Route path="/report" element={<ProtectedRoute> <Report /> </ProtectedRoute>} />
                    <Route path="/logout" element={<Logout />} />
                </Routes>
        </div>
    );
}

export default App;