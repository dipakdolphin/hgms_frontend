import React, { useEffect, useState, useCallback } from 'react';
import { List, Toast } from 'antd-mobile';
import { useLocation, useNavigate } from 'react-router-dom';
import NavHeader from './NavHeader';
import AxiosInstance from '../../Utils/AxiosInstance';

const ProductPriceHistory = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get product info from location state
    const productId = location.state?.productId;
    const productName = location.state?.productName;

    // Handle navigation if no state is present
    useEffect(() => {
        if (!location.state) {
            navigate(-1);
        }
    }, [location.state, navigate]);

    const getPriceHistory = useCallback(async () => {
        if (!productId) {
            console.error('No product ID provided');
            return;
        }

        try {

            setLoading(true);

            const response = await AxiosInstance().get(`/product_price/${productId}`);


            if (!response.data || !Array.isArray(response.data)) {
                console.error('Invalid data format received');
                Toast.show({
                    content: 'Invalid data format received',
                    duration: 2000,
                });
                return;
            }

            const processedData = response.data.map(item => ({
                ...item,
                rate: parseFloat(item.rate || 0),
                date: new Date(item.date).toISOString().split('T')[0],
                ordername: item.ordername || item.order_name || 'Order'
            })).sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

            setData(processedData);

        } catch (error) {
            console.error('API error:', error);
            Toast.show({
                content: 'Error fetching price history',
                duration: 2000,
            });
        } finally {
            setLoading(false);
        }
    }, [productId]);

    useEffect(() => {
        if (productId) {
            getPriceHistory();
        }
    }, [getPriceHistory, productId]);

    // If no state is present, render nothing while redirect happens
    if (!location.state) {
        return null;
    }

    return (
        <div>
            <NavHeader navName={`Price History - ${productName || 'Product'}`} />

            {loading ? (
                <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>
            ) : (
                <List header="Price History">
                    {data.length === 0 ? (
                        <List.Item>No price history available</List.Item>
                    ) : (
                        data.map((item, i) => (
                            <List.Item
                                key={i}
                                prefix={
                                    <span style={{
                                        textTransform: 'capitalize',
                                        fontWeight: 'bold',
                                        color: '#1677ff'
                                    }}>
                                        Rs.{item.rate}
                                    </span>
                                }
                                extra={
                                    <span style={{ color: '#666' }}>
                                        {new Date(item.date).toLocaleDateString()}
                                    </span>
                                }
                            >
                                {item.ordername}
                            </List.Item>
                        ))
                    )}
                </List>
            )}

        </div>
    );
};

export default ProductPriceHistory;
