import React, { useEffect, useState, useCallback } from 'react';
import { Button, Dialog, Form, List, Tag, Input, SearchBar, Toast, Space } from 'antd-mobile';
import AxiosInstance from '../../Utils/AxiosInstance';
import NavHeader from './NavHeader';
import { useLocation } from "react-router-dom";
import { DeleteOutline } from 'antd-mobile-icons';

const SearchableList = ({ options, value, onChange, placeholder }) => {
    const [searchValue, setSearchValue] = useState('');
    const [isListVisible, setIsListVisible] = useState(false);

    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelect = (selectedValue) => {
        onChange(selectedValue);
        setIsListVisible(false);
        setSearchValue('');
    };

    return (
        <div style={{ position: 'relative' }}>
            <SearchBar
                placeholder={placeholder}
                value={value ? options.find(o => o.value === value)?.label : searchValue}
                onChange={(val) => {
                    setSearchValue(val);
                    onChange(undefined);  // Clear the selected value when searching
                    setIsListVisible(true);
                }}
                onFocus={() => setIsListVisible(true)}
                onBlur={() => {
                    // Use setTimeout to allow click events on list items to fire before hiding the list
                    setTimeout(() => setIsListVisible(false), 200);
                }}
            />
            {isListVisible && (
                <List
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        maxHeight: '200px',
                        overflowY: 'auto',
                        zIndex: 1000,
                        backgroundColor: 'white',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                    }}
                >
                    {filteredOptions.map(option => (
                        <List.Item
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                        >
                            {option.label}
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
    );
};

const OrderDetails = () => {
    const location = useLocation();
    const [form] = Form.useForm();
    const { item } = location.state;
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sumTotal, setSumTotal] = useState(0);

    const getOrderDetails = useCallback(() => {
        setLoading(true);
        AxiosInstance().get(`/order_details/${item.id}`)
            .then((res) => {setData(res.data)
                setSumTotal(res.data.reduce((acc, item) => acc + parseFloat(item.total), 0))
            }
    
        )
            .catch(() => {
                Toast.show({
                    content: 'Something went wrong',
                    duration: 2000,
                });
            })
            .finally(() => setLoading(false));
    }, [item.id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsResponse, unitsResponse] = await Promise.all([
                    AxiosInstance().get('/products_item'),
                    AxiosInstance().get('/all_unit')
                ]);
                setProducts(productsResponse.data || []);
                setUnits(unitsResponse.data || []);
                getOrderDetails();
            } catch (error) {
                console.error('Error fetching data:', error);
                Toast.show({
                    content: 'Error fetching data',
                    duration: 2000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getOrderDetails]);

    const handleFormSubmit = async (values) => {
        try {
            setLoading(true);
            await AxiosInstance().post("create_grocery_order_item", { ...values, order_id: item.id });
            Toast.show({
                content: "Item added",
                duration: 2000,
            });
            getOrderDetails();
            Dialog.clear();
            form.resetFields();
        } catch (err) {
            Toast.show({
                content: 'Something went wrong',
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Dialog.confirm({
            content: 'Are you sure you want to delete this item?',
            confirmText: 'Delete',
            cancelText: 'Cancel',
            onConfirm: async () => {
                try {
                    setLoading(true);
                    await AxiosInstance().delete(`/order_details/${id}`);
                    Toast.show({
                        content: "Item Deleted",
                        duration: 2000,
                    });
                    getOrderDetails();
                } catch (err) {
                    Toast.show({
                        content: 'Something went wrong',
                        duration: 2000,
                    });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const orderList = data.map((item, i) => (
        <List.Item
            key={i}
            prefix={<span style={{ textTransform: 'capitalize' }}>{item.name}</span>}
            extra={
                <Space>
                    <Tag style={{ fontSize: 15 }}>Rs.{item.total}</Tag>
                    <Button
                        onClick={() => handleDelete(item.id)}
                        icon={<DeleteOutline color={"red"} />}
                        color='danger'
                        fill='none'
                    />
                </Space>
            }
        >
            {item.quantity}, Rs.{item.rate}
        </List.Item>
    ));

    const showFormDialog = (onFinish, submitText) => {
        Dialog.show({
            content: (
                <Form
                    layout='horizontal'
                    form={form}
                    onFinish={onFinish}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
                            <Button
                                style={{ marginRight: '8px' }}
                                onClick={() => {
                                    form.resetFields();
                                    Dialog.clear();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button color='primary' onClick={() => form.submit()}>
                                {submitText}
                            </Button>
                        </div>
                    }
                >
                    <Form.Item
                        name='product_id'
                        label='Product'
                        rules={[{ required: true, message: 'Product is required' }]}
                    >
                        <SearchableList
                            options={products.map(product => ({ label: product.name, value: product.id }))}
                            placeholder="Search for a product"
                        />
                    </Form.Item>
                    <Form.Item
                        name='unit_id'
                        label='Unit'
                        rules={[{ required: true, message: 'Unit is required' }]}
                    >
                        <SearchableList
                            options={units.map(unit => ({ label: unit.unit_name, value: unit.id }))}
                            placeholder="Search for a unit"
                        />
                    </Form.Item>
                    <Form.Item
                        name='rate'
                        label='Rate'
                        rules={[{ required: true, message: 'Rate is required' }]}
                    >
                        <Input type="number" placeholder='Enter rate' />
                    </Form.Item>
                    <Form.Item
                        name='quantity'
                        label='Quantity'
                        rules={[{ required: true, message: 'Quantity is required' }]}
                    >
                        <Input type="number" placeholder='Enter quantity' />
                    </Form.Item>
                    
                </Form>
            ),
            closeOnAction: false,
            actions: [],
            style: {
                width: '90%',
                maxWidth: '500px',
                maxHeight: '80vh',
                overflow: 'auto'
            },
        });
    };

    const handleCreateClick = () => {
        form.resetFields();
        showFormDialog(handleFormSubmit, 'Add');
    };

    return (
        <div>
            
            <NavHeader navName="Order Details" />
            <h3>Total: {sumTotal}</h3>
            <div style={{ margin: 10, textAlign: 'right' }}>
                <Button color="primary" onClick={handleCreateClick}>Add Product</Button>
            </div>
            
            <List header="Order Details">
                {loading ? <p>Loading...</p> : orderList}
            </List>
            
        </div>
    );
};

export default OrderDetails;
