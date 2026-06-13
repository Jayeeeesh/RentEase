import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../../features/auth/authSlice'
import productReducer from '../../features/products/productsSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
     products: productReducer
  },
})

export default store

