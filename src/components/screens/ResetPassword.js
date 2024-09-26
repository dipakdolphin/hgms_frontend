import React, {useState} from 'react';
import {Input, Form, Button, Dialog} from 'antd-mobile';
import { EyeInvisibleOutline, EyeOutline } from 'antd-mobile-icons';
import AxiosInstance from "../../Utils/AxiosInstance";
import {useNavigate} from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    const handleResetPassword = (values) => {
        if (values.newPassword !== values.confirmPassword) {
            Dialog.alert({
                content: "Passwords do not match",
                closeOnMaskClick: true,
                confirmText: 'OK'
            });
            return;
        }

        setLoading(true);

        AxiosInstance().post("/reset-password", {
            username: values.username,
            newPassword: values.newPassword
        }).then(
            (res) => {
                setLoading(false);
                Dialog.alert({
                    content: "Password reset successfully",
                    closeOnMaskClick: true,
                    confirmText: 'OK'
                });
                localStorage.removeItem("auth_token")
                navigate("/", {replace: true});
            }
        ).catch((err) => {
            setLoading(false);
            if (err.response === undefined) {
                Dialog.alert({
                    content: "Server not found",
                    closeOnMaskClick: true,
                    confirmText: 'OK'
                });
            } else {
                Dialog.alert({
                    content: err.response.data,
                    closeOnMaskClick: true,
                    confirmText: 'OK'
                });
            }
        });
    }

    return (
        <div>
            <div>
                <h1 style={{textAlign: "center"}}>Reset Password</h1>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 10}}>
                <Form onFinish={handleResetPassword}
                      footer={
                          <Button block loading={loading} type='submit' color='primary' size='large'>
                              Reset Password
                          </Button>
                      }
                >
                    <Form.Item label='Username' name='username'>
                        <Input placeholder='Username' clearable />
                    </Form.Item>
                    <Form.Item
                        label='New Password'
                        name='newPassword'
                        extra={
                            <div>
                                {!visible ? (
                                    <EyeInvisibleOutline onClick={() => setVisible(true)} />
                                ) : (
                                    <EyeOutline onClick={() => setVisible(false)} />
                                )}
                            </div>
                        }
                    >
                        <Input
                            placeholder='New Password'
                            clearable
                            type={visible ? 'text' : 'password'}
                        />
                    </Form.Item>
                    <Form.Item
                        label='Confirm Password'
                        name='confirmPassword'
                        extra={
                            <div>
                                {!confirmVisible ? (
                                    <EyeInvisibleOutline onClick={() => setConfirmVisible(true)} />
                                ) : (
                                    <EyeOutline onClick={() => setConfirmVisible(false)} />
                                )}
                            </div>
                        }
                    >
                        <Input
                            placeholder='Confirm Password'
                            clearable
                            type={confirmVisible ? 'text' : 'password'}
                        />
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default ResetPassword;
