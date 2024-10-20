import React, {useEffect, useState} from 'react';
import NavHeader from "./NavHeader";
import AxiosInstance from "../../Utils/AxiosInstance";
import {Button, Dialog, Form, Input, List, Picker, Popup, Space, Switch, Card, Radio, RadioGroup} from "antd-mobile";
import {SearchOutline, DeleteOutline, CalendarOutline, CheckCircleFill, CloseCircleFill} from 'antd-mobile-icons';


const ProductSetup = () => {
    const [form] = Form.useForm();
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)
    const [isActive, setIsActive] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleFormSubmit = (values) => {
        AxiosInstance().post('/products_item',  values).then(
            (res)=>{
                Dialog.alert({
                    content:"Product Created",
                    confirmText:"OK",
                    closeOnMaskClick:true,
                    onConfirm :()=>{
                        getAllProducts();
                        setOpen(false);
                        form.resetFields();
                    }
                })
            }
        )
    }

    const handleDelete = (id) => {
        Dialog.confirm({
            content: 'Are you sure you want to delete this product?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: () => {
                AxiosInstance().delete(`/products_item/${id}`).then(
                    (res) => {
                        Dialog.alert({
                            content: "Product Deleted",
                            confirmText: "OK",
                            onConfirm: () => {
                                getAllProducts();
                            }
                        });
                    }
                ).catch((err) => {
                    Dialog.alert({
                        content: 'Something went wrong',
                        confirmText: "OK"
                    });
                });
            },
        });
    };

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const productList = filteredData.map((item, i) => (
        <List.Item
            key={i}
            prefix={<span style={{ textTransform: 'capitalize', marginTop:10 }}>{item.name}</span>}
            extra={
                <Space>
                    <Button
                        onClick={() => handleDelete(item.id)}
                        icon={<DeleteOutline color={"red"} />}
                        color='danger'
                        fill='none'
                    ><DeleteOutline color={"red"} />
                    </Button>
                </Space>
            }
        />
            
    ));

    const showFormDialog = (onFinish, submitText) => {
        Dialog.show({
            content: (
                <Form
                    layout='horizontal'
                    form={form}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='name'
                        label='Name'
                        rules={[{ required: true, message: 'Name is required' }]}
                    >
                        <Input placeholder='Product Name' />
                    </Form.Item>
                    <Form.Item
                        name="is_active"
                        label="Is Active?"
                    >
                        <Radio.Group value={isActive ? 'true' : 'false'} onChange={(value) => setIsActive(value === 'true')}>
                            <Space direction='vertical'>
                                <Radio value="true">True</Radio>
                                <Radio value="false">False</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            ),
            actions: [
                {
                    key: 'cancel',
                    text: 'Cancel',
                    onClick: () => {
                        form.resetFields();
                        Dialog.clear();
                    }
                },
                {
                    key: 'confirm',
                    text: submitText,
                    bold: true,
                    onClick: () => form.submit()
                }
            ],
        });
    };

    const handleCreateClick = () => {
        form.resetFields();
        setIsActive(false);
        showFormDialog(handleFormSubmit, 'Create');
    };

    return (
        <div>
            <NavHeader navName="Product Setup" />
            <div style={{ margin: 10 }}>
                <Input
                    placeholder='Search products'
                    value={searchTerm}
                    onChange={setSearchTerm}
                    clearable
                    style={{ marginBottom: 10 }}
                />
                <Button color="primary" onClick={handleCreateClick}>Add Product</Button>
            </div>

            <div style={{ margin: 10 }}>
                {productList}
            </div>

        </div>
    );
};

export default ProductSetup;
