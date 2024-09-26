import React, { useEffect, useState } from 'react';
import {Button, Dialog, Form, List, Popup, Tag, Input, Picker, Toast, Space} from 'antd-mobile';
import AxiosInstance from '../../Utils/AxiosInstance';
import NavHeader from './NavHeader';
import {useLocation} from "react-router-dom";
import { CalendarOutline } from 'antd-mobile-icons';

const OrderDetails = ({ onSubmit }) => {
    const location = useLocation();
    const [form] = Form.useForm();
    const { item } = location.state;
    const [data, setData] = useState([]);
    const [open, setOpen] = useState(false);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [pickerVisible2, setPickerVisible2] = useState(false);
    const [products, setProducts] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        product_id: "",
        rate: '',
        quantity: '',
        unit_id: "",
        order_id:item.id
    });



    const getOrderDetails = () => {
        AxiosInstance().get(`/order_details/${item.id}`)
            .then((res) => setData(res.data))
            .catch(() => {
                Dialog.alert({
                    content: 'Something went wrong',
                    closeOnMaskClick: true,
                    confirmText: 'OK'
                });
            });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsResponse, unitsResponse] = await Promise.all([
                    AxiosInstance().get('/products_item'),
                    AxiosInstance().get('/all_unit')
                ]);
                setProducts(productsResponse.data || []);
                setUnits(unitsResponse.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        getOrderDetails();
    }, []);

    const list = data.map((item, i) => (
        <List.Item key={i} style={{ textTransform: 'capitalize' }}>
            Total: <Tag style={{ fontSize: 15 }}>Rs.{item.total}</Tag> {item.name}, {item.quantity}, Rs.{item.rate}
        </List.Item>
    ));
    const basicColumns = products.map(product => ({
        label: product.name, // Assuming 'name' corresponds to the label in your desired format
        value: product.id // Assuming 'id' corresponds to the value in your desired format
    }));
    const productsData = [basicColumns];

    const baseUnitColumn = units.map(unit =>({
        label:unit.unit_name,
        value:unit.id
    }) )
    const unitsData = [baseUnitColumn]


    const handleFormSubmit = ()=>{
        setLoading(true);
        AxiosInstance().post("create_grocery_order_item", formData)
            .then((res)=>{
                Dialog.alert({
                    content:"Item added",
                    confirmText:"OK",
                    closeOnMaskClick:true,
                    onConfirm :()=>{
                        getOrderDetails();
                        setOpen(false);
                        form.resetFields()

                    }
                })
            }).catch((err)=>{
                Dialog.alert({
                    content:'Something went wrong',
                    confirmText:"OK"

                })
        })

    }


    return (
        <div>
            <NavHeader navName="Order Details" />
            <div style={{ margin: 10, textAlign: 'right' }}>
                <Button color="primary" onClick={() => setOpen(true)}>Add Product</Button>
            </div>
            <List header="Order Details">
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
                        // console.log(formData);
                        handleFormSubmit()
                    }}
                    footer={
                        <Button block type='submit' color='primary' size='large' >
                            Add
                        </Button>
                    }
                >
                    <Form.Item
                        label="Product"
                        name="product"
                        extra={<div>
                            <CalendarOutline onClick={() => setPickerVisible(true)} style={{ fontSize: "20px" }} />
                        </div>}
                    >
                        <Picker
                            visible={pickerVisible}
                            columns={productsData}
                            cols={1}
                            confirmText="OK"
                            cancelText={"Cancel"}
                            onChange={value => {
                                setFormData({...formData, product_id: value[0]});
                                // console.log(value);
                            }}
                            style={{ height: '70vh', paddingTop: 15 }}
                            onCancel={()=>{setPickerVisible(false)}}
                            onConfirm= {(value)=>{setPickerVisible(false);
                                setFormData({...formData, product_id: value[0]});
                            }}

                        >
                            {(items) => {
                                return (
                                    <Space align='center'>
                                        {items.every(item => item === null)
                                            ? 'Not selected'
                                            : items.map(item => item?.label ?? 'Not selected').join(' - ')}
                                    </Space>
                                )
                            }}

                        </Picker>

                    </Form.Item>

                    <Form.Item
                        label="Rate"
                        name="rate"
                        rules={[{ required: true, message: 'Please enter the rate' }]}
                    >
                        <Input
                            type="number"
                            placeholder="Enter the rate"
                            value={formData.rate}
                            onChange={value => setFormData({ ...formData, rate: value })}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Quantity"
                        name="quantity"
                        rules={[{ required: true, message: 'Please enter the quantity' }]}
                    >
                        <Input
                            type="number"
                            placeholder="Enter the quantity"
                            value={formData.quantity}
                            onChange={value => setFormData({ ...formData, quantity: value })}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Unit"
                        name="unit"
                        extra={<div>
                            <CalendarOutline onClick={() => setPickerVisible2(true)} style={{ fontSize: "20px" }} />
                        </div>}
                    >
                        <Picker
                            columns = {unitsData}
                            visible = {pickerVisible2}
                            confirmText="OK"
                            cancelText={"Cancel"}
                            onCancel = {()=>{setPickerVisible2(false)}}
                            cols={1}
                            onChange={value => setFormData({ ...formData, unit_id: value[0] })}
                            onConfirm= {(value)=>{setPickerVisible2(false);
                                setFormData({...formData, unit_id: value[0]});
                            }}
                            style={{ height: '70vh', paddingTop: 15 }}
                        >
                            {(items) => {
                                return (
                                    <Space align='center'>
                                        {items.every(item => item === null)
                                            ? 'Not selected'
                                            : items.map(item => item?.label ?? 'Not selected').join(' - ')}
                                    </Space>
                                )
                            }}

                        </Picker>
                    </Form.Item>
                </Form>
            </Popup>
        </div>
    );
};

export default OrderDetails;
