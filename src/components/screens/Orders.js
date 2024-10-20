import React, { useEffect, useState } from 'react';
import { Button, Form, Input, List, Dialog, Radio, Toast, Space } from 'antd-mobile';
import { CalendarOutline, CheckCircleFill, CloseCircleFill, DownCircleOutline } from 'antd-mobile-icons';
import AxiosInstance from "../../Utils/AxiosInstance";
import { useNavigate } from 'react-router-dom';

const TOAST_DURATION = 1000;

const Orders = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [isEndString, setIsEndString] = useState('false');
    const [currentItem, setCurrentItem] = useState(null);

    const getOrdersList = () => {
        AxiosInstance().get("/grocery_orders").then(
            (res) => {
                setData(res.data.reverse());
            }
        ).catch((err) => {
            console.error(err.response.data);
        });
    };

    useEffect(() => {
        getOrdersList();
    }, []);

    const handleItemClick = (item) => {
        navigate('/orderDetails', { state: { item } });
    };

    const handleEditSubmit = (values) => {
        if (!currentItem) {
            Toast.show({
                content: "No item selected for editing.",
                duration: TOAST_DURATION,
            });
            return;
        }

        const updatedValues = { ...values, is_end: values.is_end === 'true' };
        AxiosInstance().put(`/grocery_orders/${currentItem.id}`, updatedValues)
            .then((res) => {
                Toast.show({
                    content: "Order Updated",
                    duration: TOAST_DURATION,
                });
                getOrdersList();
                form.resetFields();
                Dialog.clear();
            })
            .catch((err) => {
                Toast.show({
                    content: `Error updating order: ${err.response?.data?.error || 'Unknown error'}`,
                    duration: TOAST_DURATION,
                });
            });
    };

    const handleCreateSubmit = (values) => {
        const updatedValues = { ...values, is_end: values.is_end === 'true' };
        AxiosInstance().post("/grocery_orders", updatedValues)
            .then((res) => {
                Toast.show({
                    content: "Order Created",
                    duration: TOAST_DURATION,
                });
                getOrdersList();
                form.resetFields();
                Dialog.clear();
            })
            .catch((err) => {
                Toast.show({
                    content: `Error creating order: ${err.response?.data?.error || 'Unknown error'}`,
                    duration: TOAST_DURATION,
                });
            });
    };

    const handleEditClick = (item) => {
        setCurrentItem(item);
        form.setFieldsValue({
            ...item,
            is_end: item.is_end ? 'true' : 'false', // Set value for Radio buttons as string 'true' or 'false'
        });
        setIsEndString(item.is_end ? 'true' : 'false');

        showFormDialog(handleEditSubmit, 'Update');
    };

    const handleCreateClick = () => {
        form.resetFields();
        setCurrentItem(null);
        setIsEndString('false'); // Default value for new order is 'false'

        showFormDialog(handleCreateSubmit, 'Create');
    };

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
                        <Input placeholder='Order Name' />
                    </Form.Item>
                    <Form.Item
                        name="from_date"
                        label="From Date"
                        extra={<CalendarOutline style={{ fontSize: "20px" }} />}
                    >
                        <Input placeholder={"From Date"} />
                    </Form.Item>
                    <Form.Item
                        name="to_date"
                        label="To Date"
                        extra={<CalendarOutline style={{ fontSize: "20px" }} />}
                    >
                        <Input placeholder={"To Date"} />
                    </Form.Item>
                    <Form.Item
                        name="is_end"
                        label="Is End?"
                    >
                        <Radio.Group value={isEndString} onChange={(value) => setIsEndString(value)}>
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

    const list = data.map((item, i) => (
        <List.Item
            key={i}
            clickable
            prefix={<DownCircleOutline onClick={() => handleItemClick(item)} />}
            style={{ textTransform: 'capitalize' }}
            extra={
                <Button size="small" color="primary" onClick={() => handleEditClick(item)}>Edit</Button>
            }
        >
            {item.name} Is end: {item.is_end ? <CheckCircleFill color={"#a0baf8"} /> : <CloseCircleFill color={"#b86147"} />}
        </List.Item>
    ));

    return (
        <div>
            <div style={{ margin: 10, textAlign: "right" }}>
                <Button color={"primary"} onClick={handleCreateClick}>Create Order</Button>
            </div>
            <div>
                <List header='Orders'>
                    {list}
                </List>
            </div>
        </div>
    );
};

export default Orders;
