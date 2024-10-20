import React, {useState, useEffect} from 'react';
import {Input, Form, Button, Dialog} from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import AxiosInstance from "../../Utils/AxiosInstance";
import {useNavigate} from "react-router-dom";
import isAuthenticated from "../../Utils/IsAuthenticated";

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(()=>{
        const checkLoginStatus = ()=>{
            if(isAuthenticated()){
                navigate("/home")
            }
        }
        checkLoginStatus();
    },[])
    const handleLogin =(values)=>{
        setLoading(true)

        AxiosInstance().post("/login", values).then(
            (res)=>{
                setLoading(false)
                let token = res.data.token;
                localStorage.setItem('auth_token',token );
                navigate("/home",{replace:true})
                // console.log(res.data);
            }
        ).catch((err)=>{
            setLoading(false)
            console.log(err);
            if(err.response === undefined){
                Dialog.alert({
                    content:"Server not found",
                    closeOnMaskClick:true,
                    confirmText:'OK'
                })
            }else (
                Dialog.alert({
                    content:err.response.data,
                    closeOnMaskClick:true,
                    confirmText:'OK'
                })

            )

            // console.error(err.response.data);
        })
    }
    const [visible, setVisible] = useState(false)
    return (

        <div>
            <div>
                <h1 style={{textAlign:"center"}} >HGMS</h1>
            </div>
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', padding:10}}>
                <Form  onFinish={handleLogin}
                       footer={
                           <Button block loading={loading} type='submit' color='primary' size='large'>
                               Login
                           </Button>
                       }

                >
                    <Form.Item label='Username' name='username'>
                        <Input placeholder='Username' clearable />
                    </Form.Item>
                    <Form.Item
                        label='Password'
                        name='password'
                        extra={
                            <div >
                                {!visible ? (
                                    <EyeInvisibleOutline onClick={() => setVisible(true)} />
                                ) : (
                                    <EyeOutline onClick={() => setVisible(false)} />
                                )}
                            </div>
                        }
                    >
                        <Input
                            placeholder='Password'
                            clearable
                            type={visible ? 'text' : 'password'}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;
