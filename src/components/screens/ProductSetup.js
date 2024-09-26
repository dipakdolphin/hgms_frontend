import React, {useEffect, useState} from 'react';
import NavHeader from "./NavHeader";
import AxiosInstance from "../../Utils/AxiosInstance";
import {Button, Dialog, Form, Input, List, Picker, Popup, Space, Switch} from "antd-mobile";
import {CalendarOutline} from "antd-mobile-icons";

const ProductSetup = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const getAllProducts = ()=>{
        AxiosInstance().get('/products_item').then(
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
        getAllProducts();
    }, []);

    const list = data.map((item, i) => (
        <List.Item key={i} style={{ textTransform: 'capitalize' }}>
            {item.name}
        </List.Item>
    ));


    return (
        <div>
            <NavHeader navName="Product Setup" />
            <div style={{ margin: 10, textAlign: 'right' }}>
                <Button color="primary" onClick={() => setOpen(true)}>Add Product</Button>
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
                        console.log(values);
                        // handleFormSubmit()
                    }}
                    footer={
                        <Button block type='submit' color='primary' size='large' >
                            Add
                        </Button>
                    }
                >


                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter name' }]}
                    >
                        <Input
                            type="text"
                            placeholder="Enter name"
                        />
                    </Form.Item>

                    <Form.Item
                        name="is_active"
                        label="Is Active?"
                    >
                        <Switch checked={isActive} onChange={(value)=>setIsActive(value)}   />
                    </Form.Item>
                </Form>
            </Popup>




        </div>
    );
};

export default ProductSetup;
