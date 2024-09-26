import React from 'react';
import {NavBar} from "antd-mobile";
import {useNavigate} from "react-router-dom";

const NavHeader = ({navName}) => {
    const navigate = useNavigate();
    const handleBack = ()=>{
        navigate(-1)

    }
    return (
        <div>
            <NavBar  onBack={handleBack} >
                {navName}
            </NavBar>

        </div>
    );
};

export default NavHeader;
