import React, {useEffect, useState} from 'react';
import NavHeader from "./NavHeader";
import AxiosInstance from "../../Utils/AxiosInstance";
import {Button, Dialog, Form, Input, List, Popup, Switch, Tag} from "antd-mobile";

const UnitSetup = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [isActive, setIsActive] = useState(false)
    const getAllUnits = ()=>{
        AxiosInstance().get('/all_unit').then(
            (res)=>{
                setData(res.data);
            }
        ).catch((err)=>{
            Dialog.alert({
                content:'Something went wrong',
                confirmText:"OK"

            })
        })
    }
    useEffect(() => {
        getAllUnits();
    }, []);


    const handleUnitCreate = (values)=>{
        console.log(values.is_active);
        const updatedValues = { ...values, is_active: values.is_active || false };
        AxiosInstance().post('/create_unit', updatedValues ).then(
            (res)=>{
                Dialog.alert({
                    content:"Unit Created",
                    confirmText:"OK",
                    closeOnMaskClick:true,
                    onConfirm :()=>{
                        getAllUnits();
                        setOpen(false);
                        form.resetFields();
                    }
                })
            }
        ).catch((err)=>{
            Dialog.alert({
                content:err.response.data.error,
                closeOnMaskClick:true,
                confirmText:"OK"
            })

        })
    }

    const list = data.map((item, i) => (
        <List.Item key={i} style={{ textTransform: 'capitalize' }}>
             {item.unit_name}
        </List.Item>
    ));


    return (
        <div>
            <NavHeader navName="Unit Setup" />
            <div style={{ margin: 10, textAlign: 'right' }}>
                <Button color="primary" onClick={() => setOpen(true)}>Add Unit</Button>
            </div>

            <List >
                {list}
            </List>


            <Popup
                visible={open}
                showCloseButton
                onMaskClick={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                onClose={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                bodyStyle={{ height: '70vh', paddingTop: 15 }}
            >
                <Form
                    layout='horizontal'
                    form={form}
                    onFinish={(values) => {
                        // console.log(values);
                        handleUnitCreate(values)
                    }}
                    footer={
                        <Button block type='submit' color='primary' size='large' >
                            Add
                        </Button>
                    }
                >


                    <Form.Item
                        label="Name"
                        name="unit_name"
                        rules={[{ required: true, message: 'Please enter name' }]}
                    >
                        <Input
                            type="text"
                            placeholder="Enter name"
                        />
                    </Form.Item>
                    <Form.Item
                        label="Code"
                        name="code"
                        rules={[{ required: true, message: 'Please enter code' }]}
                    >
                        <Input
                            type="text"
                            placeholder="Enter code"
                        />
                    </Form.Item>
                    <Form.Item
                        name="is_active"
                        label="Is Active?"
                    >
                        <Switch checked={isActive} onChange={(value)=>setIsActive(value)}  />
                    </Form.Item>


                </Form>
            </Popup>

        </div>
    );
};

export default UnitSetup;
