import React, { useEffect, useState, useCallback } from 'react';
import {Button, Dialog, Form, Tag, Input, SearchBar, Toast, Space, Radio, List} from 'antd-mobile';
import AxiosInstance from '../../Utils/AxiosInstance';
import NavHeader from './NavHeader';
import { DeleteOutline } from 'antd-mobile-icons';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchableList = ({ options, value, onChange, placeholder, onFocus }) => {
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

    const handleFocus = () => {
        setIsListVisible(true);
        if (onFocus) {
            onFocus();
        }
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
                onFocus={handleFocus}
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
    const [isActive, setIsActive] = useState(false);



    const getOrderDetails = useCallback(() => {
        setLoading(true);
        AxiosInstance().get(`/order_details/${item.id}`)
            .then((res) => {

                // console.log('Order details response:', res.data);
                // console.log('Order name:', item.name);
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
            const total = parseFloat(values.rate) * parseFloat(values.quantity);

            const submitData = {
                ...values,
                order_id: item.id,
                total: total.toString()
            };

            await AxiosInstance().post("create_grocery_order_item", submitData);
            Toast.show({ content: "Item added", duration: 2000 });
            getOrderDetails();
            Dialog.clear();
            form.resetFields();
        } catch (error) {
            console.error('Error adding item:', error);
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

    const fetchProducts = useCallback(async () => {
        try {
            const response = await AxiosInstance().get('/products_item');
            setProducts(response.data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            Toast.show({ content: 'Error fetching products', duration: 2000 });
        }
    }, []);

    const fetchUnits = useCallback(async () => {
        try {
            const response = await AxiosInstance().get('/all_unit');
            setUnits(response.data || []);
        } catch (error) {
            console.error('Error fetching units:', error);
            Toast.show({ content: 'Error fetching units', duration: 2000 });
        }
    }, []);

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
                        <SearchableList
                            options={products.map(p => ({ label: p.name, value: p.id }))}
                            placeholder="Search for a product"
                            onFocus={fetchProducts}
                        />
                    </Form.Item>
                    <Form.Item
                        name='unit_id'
                        label='Unit'
                        rules={[{ required: true, message: 'Unit is required' }]}
                    >
                        <SearchableList
                            options={units.map(u => ({ label: u.unit_name, value: u.id }))}
                            placeholder="Search for a unit"
                            onFocus={fetchUnits}
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

    const handleNewFormSubmit = (values) => {
        AxiosInstance().post('/products_item',  values).then(
            (res)=>{
                Dialog.alert({
                    content:"Product Created",
                    confirmText:"OK",
                    closeOnMaskClick:true,
                    onConfirm :()=>{
                        form.resetFields();
                    }
                })
            }
        )
    }

    const handleCreateNewClick = () => {
        form.resetFields();
        setIsActive(false);
        showFormNewDialog(handleNewFormSubmit, 'Create');
    };

    const showFormNewDialog = (onFinish, submitText) => {
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

    return (
        <div>
            <NavHeader navName={`Order Details - ${item.name}`} />
            <div style={{ margin: 10, display:'flex', flexDirection:'row', justifyContent:"left"  }}>
                <div>
                    <Button size={'small'} color="primary" onClick={handleCreateNewClick}>Add New Product</Button>
                </div>
                <Button size={'small'} color="primary" style={{marginLeft:8}} onClick={handleCreateClick}>Add Product</Button>
            </div>

            <p style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'left', margin: 10 }}>
                Grand Total: Rs.{sumTotal}
            </p>

            <div style={{ margin: '10px', overflowX: 'auto' }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '300px'
                }}>
                    <thead>
                        <tr style={{
                            backgroundColor: '#f5f5f5',
                            borderBottom: '2px solid #ddd'
                        }}>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Product</th>
                            <th style={{ padding: '12px', textAlign: 'left' }}>Quantity</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Rate</th>
                            <th style={{ padding: '12px', textAlign: 'right' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading...</td>
                            </tr>
                        ) : data.map((item, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: '12px' }}>
                                    {new Date(item.savedate).toLocaleDateString()}
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <span
                                        style={{
                                            textTransform: 'capitalize',
                                            cursor: 'pointer',
                                            color: '#1677ff'
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleProductClick(item.productid, item.name);
                                        }}
                                    >
                                        {item.name}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    {item.quantity} {item.unit}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    Rs.{item.rate}
                                </td>
                                <td style={{ padding: '12px', textAlign: 'right' }}>
                                    Rs.{item.total}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderDetails;
