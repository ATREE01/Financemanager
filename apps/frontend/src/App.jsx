import {Routes, Route, Navigate} from 'react-router-dom';

import PersistLogin from "./features/Auth/PersistLogin"
import RequireAuth from "./features/Auth/RequireAuth";

import Layout from './layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import NavBar from './layout/NavBar/NavBar';
import Dashboard from './pages/Dashboard/Dashboard'
import DashboardIncExp from './pages/IncExp/DashboardIncExp/DashboardIncExp';
import Detail from './pages/IncExp/Detail/Detail';
import DashboardBank from './pages/Bank/DashboardBank/DashboardBank';
import TimeDeposit from './pages/Bank/TimeDeposit/TimeDeposit';
import BankDetail from './pages/Bank/BankDetail/BankDetail';
import Currency from './pages/Currency/Currency';
import DashboardStock from './pages/Investment/DashboardInvt/DashboardStock';
import StockDetail from './pages/Investment/StockDetail/StockDetail';

import "./assets/form.css";
import './assets/table.css';
import Dividend from './pages/Investment/Dividend/Dividend';

export default function App(){
  return(
    <Routes>
        {/* public route */}
        <Route path ="/" element={<NavBar />}>
          <Route element={<PersistLogin/>}>
            <Route path="/" element={<Home />} />
          </Route> 
          <Route path="Register" element ={<Register/>} />
          <Route path="Login" element ={<Login/>} />
          {/* private route */}
          <Route element={<PersistLogin/>}>   
            <Route element={<RequireAuth />}>
              <Route path="Dashboard" element={<Dashboard/>}/>
              <Route path="IncomeAndExpenditure" element={<Layout />}>
                <Route path="Dashboard" element={<DashboardIncExp/>} />
                <Route path="Detail" element={<Detail/>} />
              </Route>
              <Route path="Bank" element={<Layout />}>
                <Route path="Dashboard" element={<DashboardBank />}/>
                <Route path="TimeDeposit" element={<TimeDeposit />} />
                <Route path="Detail" element={<BankDetail/>}/>
              </Route>
              <Route path="Currency" element={<Currency />} />
              <Route path="Investment" element={<Layout />}>
                <Route path='DashboardStock' element={<DashboardStock />} />
                <Route path="StockDetail" element={<StockDetail />} />
                <Route path="Dividend" element={<Dividend />} />
              </Route>
            </Route>
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} /> 
    </Routes>
  );
}