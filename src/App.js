import React from 'react';
import {BrowserRouter} from "react-router-dom";
import AppRouter from "./Routes/AppRouter";

const App = () => {
    return (
        <BrowserRouter>
            <AppRouter />
        </BrowserRouter>
    );
};

export default App;
