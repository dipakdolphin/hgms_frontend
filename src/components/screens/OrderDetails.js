import React, { useEffect, useState, useCallback } from 'react';
import { Button, Dialog, Form, List, Tag, Input, SearchBar, Toast, Space } from 'antd-mobile';
import AxiosInstance from '../../Utils/AxiosInstance';
import NavHeader from './NavHeader';
import { DeleteOutline } from 'antd-mobile-icons';
import { useLocation, useNavigate } from 'react-router-dom';

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
                    onChange(undefined);
                    setIsListVisible(true);
                }}
                onFocus={() => setIsListVisible(true)}
                onBlur={() => setTimeout(() => setIsListVisible(false), 200)}
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
                        <List.Item key={option.value} onClick={() => handleSelect(option.value)}>
                            {option.label}
                        </List.Item>
                    ))}
                </List>
            )}
        </div>
    );
};

const OrderDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { item } = location.state;

    const [form] = Form.useForm();
    const [data, setData] = useState([]);
    const [products, setProducts] = useState([]);
    const [units, setUnits] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sumTotal, setSumTotal] = useState(0);

    const getOrderDetails = useCallback(() => {
        setLoading(true);
        AxiosInstance().get(`/order_details/${item.id}`)
            .then((res) => {
                console.log('Order details response:', res.data);
                setData(res.data);
                setSumTotal(res.data.reduce((acc, item) => acc + parseFloat(item.total), 0));
            })
            .catch((error) => {
                console.error('Error fetching order details:', error);
                Toast.show({ content: 'Something went wrong', duration: 2000 });
            })
            .finally(() => setLoading(false));
    }, [item?.id]);

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
                Toast.show({ content: 'Error fetching data', duration: 2000 });
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
            Toast.show({ content: "Item added", duration: 2000 });
            getOrderDetails();
            Dialog.clear();
            form.resetFields();
        } catch {
            Toast.show({ content: 'Something went wrong', duration: 2000 });
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
                    Toast.show({ content: "Item Deleted", duration: 2000 });
                    getOrderDetails();
                } catch {
                    Toast.show({ content: 'Something went wrong', duration: 2000 });
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const showFormDialog = (onFinish, submitText) => {
        Dialog.show({
            content: (
                <Form
                    layout='horizontal'
                    form={form}
                    onFinish={onFinish}
                    footer={
                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
                            <Button onClick={() => { form.resetFields(); Dialog.clear(); }}>Cancel</Button>
                            <Button color='primary' onClick={() => form.submit()}>{submitText}</Button>
                        </div>
                    }
                >
                    <Form.Item
                        name='product_id'
                        label='Product'
                        rules={[{ required: true, message: 'Product is required' }]}
                    >
                        <SearchableList options={products.map(p => ({ label: p.name, value: p.id }))} placeholder="Search for a product" />
                    </Form.Item>
                    <Form.Item
                        name='unit_id'
                        label='Unit'
                        rules={[{ required: true, message: 'Unit is required' }]}
                    >
                        <SearchableList options={units.map(u => ({ label: u.unit_name, value: u.id }))} placeholder="Search for a unit" />
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
        });
    };

    const handleCreateClick = () => {
        form.resetFields();
        showFormDialog(handleFormSubmit, 'Add');
    };

    const handleProductClick = (productId, productName) => {
        if (!productId) {
            Toast.show({ 
                content: 'Invalid product selected', 
                duration: 2000 
            });
            return;
        }

        const id = typeof productId === 'string' ? parseInt(productId, 10) : productId;
        
        navigate('/productPriceHistory', {
            state: { 
                productId: id,
                productName: productName || 'Unknown Product'
            }
        });
    };

    return (
        <div>
            <NavHeader navName="Order Details" />
            <div style={{ margin: 10, textAlign: 'right' }}>
                <Button color="primary" onClick={handleCreateClick}>Add Product</Button>
            </div>
            <List header="Order Details">
                {loading ? <p>Loading...</p> : data.map((item, i) => (
                    <List.Item
                        key={i}
                        prefix={
                            <Space align="center">
                                <span
                                    style={{ 
                                        textTransform: 'capitalize', 
                                        cursor: 'pointer', 
                                        color: '#1677ff',
                                        fontSize: 15
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleProductClick(
                                            item.productid,
                                            item.name
                                        );
                                    }}
                                >
                                    {item.name}
                                </span>
                                <span style={{ 
                                    fontSize: 14, 
                                    color: '#333',
                                    whiteSpace: 'nowrap',
                                    fontWeight: '500',
                                    backgroundColor: '#f5f5f5',
                                    padding: '2px 8px',
                                    borderRadius: '4px'
                                }}>
                                    {new Date(item.savedate).toLocaleDateString()}
                                </span>
                            </Space>
                        }
                        extra={
                            <Space>
                                <Tag style={{ fontSize: 15 }}>Rs.{item.total}</Tag>
                                <Button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.orderid);
                                    }}
                                    icon={<DeleteOutline color={"red"} />}
                                    color='danger'
                                    fill='none'
                                />
                            </Space>
                        }
                    >
                        {item.quantity} {item.unit}, Rs.{item.rate}
                    </List.Item>
                ))}
            </List>
            <p style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'right', margin: 10 }}>
                Grand Total: Rs.{sumTotal}
            </p>
        </div>
    );
};

export default OrderDetails;
