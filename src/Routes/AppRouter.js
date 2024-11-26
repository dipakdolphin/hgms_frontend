import React from 'react';
import { Route, Routes} from 'react-router-dom';
import Login from "../components/screens/Login";
import ResetPassword from "../components/screens/ResetPassword";
import Home from "../components/screens/Home";
import Orders from "../components/screens/Orders";
import OrderDetails from "../components/screens/OrderDetails";
import ProductSetup from "../components/screens/ProductSetup";
import UnitSetup from "../components/screens/UnitSetup";
import ProductPriceHistory from '../components/screens/ProductPriceHistory';

const AppRouter = () => {
    return (
        <div className={"Router"}>
            <Routes>
                <Route path={"/"} element={<Login />}/>
                <Route path={"/home"} element={<Home />} />
                <Route path={"/orders"} element={<Orders />} />
                <Route path={"/orderDetails"} element={<OrderDetails />} />
                <Route path={"/unitSetup"} element={<UnitSetup />} />
                <Route path={"/productSetup"} element={<ProductSetup />} />
                <Route path={"/reset"} element={<ResetPassword />} />
                <Route path={"/productPriceHistory"} element={<ProductPriceHistory />} />
                



            </Routes>

        </div>
    );
};

export default AppRouter;
