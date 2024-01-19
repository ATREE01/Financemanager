import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import { store } from './app/store'

import 'default-passive-events'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/*' element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
)
