import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./layouts/MainLayout";
import ProductListing from "./pages/ProductListing";
import ProductDetail from "./pages/ProductDetail";
import Home from "./pages/home/Home";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import MyOrders from "./pages/MyOrders";
import MyRentals from "./pages/MyRentals";
import Profile from "./pages/Profile";
import useInitAuth from './hooks/useInitAuth'
import Maintenance from './pages/Maintenance'

function App() {
  useInitAuth()
  
  return (

    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/my-rentals" element={ <ProtectedRoute><MyRentals /></ProtectedRoute> }/>
          <Route path="/my-orders" element={ <ProtectedRoute><MyOrders /></ProtectedRoute> }/>
           <Route path="/profile" element={ <ProtectedRoute><Profile /></ProtectedRoute> }/>
           <Route path="/maintenance" element={<ProtectedRoute><Maintenance /></ProtectedRoute>} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
