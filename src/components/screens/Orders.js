import React, {useEffect, useState} from 'react';
import {Button, Form, Input, List, Popup, Switch, Dialog} from 'antd-mobile';
import {CalendarOutline, CheckCircleFill, CloseCircleFill, DownCircleOutline,} from 'antd-mobile-icons'
import AxiosInstance from "../../Utils/AxiosInstance";
import { useNavigate } from 'react-router-dom';
import NavHeader from "./NavHeader";


const Orders = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [data, setData]= useState([]);
    const [open, setOpen] = useState(false);
    const [isEnd, setIsEnd] = useState(false);

    const getOrdersList = ()=>{
        AxiosInstance().get("/grocery_orders").then(
            (res)=>{
                setData(res.data);
            }
        ).catch((err)=>{
            console.error(err.response.data);
        })
    }
    useEffect(() => {
        getOrdersList();
    }, []);

    const handleItemClick = (item) => {
        navigate('/orderDetails', { state: { item } }); // Pass item data as location state
    };

    const list = data.map((item, i)=>(

            <List.Item clickable  prefix={<DownCircleOutline /> } onClick={()=>{handleItemClick(item)}} style={{textTransform:'capitalize'}}  >{item.name}  Is end:{item.is_end ? <CheckCircleFill color={"#a0baf8"} />:<CloseCircleFill color={"#b86147"} />}</List.Item>
    ))

    const handelOrders = (values)=>{
        const updatedValues = { ...values, is_end: values.is_end || false };
        AxiosInstance().post("/grocery_orders",updatedValues ).then(
            (res)=>{
                Dialog.alert({
                    content:"Order Created",
                    confirmText:"OK",
                    closeOnMaskClick:true,
                    onConfirm :()=>{
                        getOrdersList();
                        setOpen(false);
                        form.resetFields();
                    }
                })
            }
        ).catch((err)=>{
            // console.log(err.response.data.error)
            Dialog.alert({
                content:err.response.data.error,
                closeOnMaskClick:true,
                confirmText:"OK"
            })
        })
    }
    // const dateConversion = (val) => {
    //     const year = val.getFullYear();
    //     const month = String(val.getMonth() + 1).padStart(2, '0'); // Zero-pad month
    //     const day = String(val.getDate()).padStart(2, '0');
    //     // setDate(formattedDate);
    //     return `${year}-${month}-${day}`;
    // };


    return (
        <div>
            {/*<NavHeader navName="Orders" />*/}
            <div style={{ margin:10, textAlign:"right"}}>
                <Button  color={"primary"} onClick={()=>{setOpen(true)}} >Create Order</Button>
            </div >
            <div>

                <List header='Orders' >
                    {list}
                </List>
            </div>
            <div>
                <Popup visible={open} showCloseButton  onMaskClick={() => {
                    setOpen(false);
                    form.resetFields();
                }}
                       onClose={() => {
                           setOpen(false);
                           form.resetFields(); // Reset form fields on close
                       }}
                       bodyStyle={{ height: '70vh' }} >
                    <Form layout='horizontal'
                          form={form}
                          onFinish={(Values)=>{
                              handelOrders(Values);

                          }}
                          footer={
                              <Button block type='submit' color='primary' size='large'>
                                  Create
                              </Button> } >
                        <Form.Header>Create Order</Form.Header>
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
                            extra={<div>
                                <CalendarOutline style={{fontSize:"20px"}}  />
                            </div>}
                        >

                            <Input placeholder={"From Date"}   />

                            {/*<Input placeholder={"From Date"} value={date} onChange={(value)=>{setDate(value)}  }  />*/}

                        </Form.Item>
                        <Form.Item
                            name="to_date"
                            label="To Date"
                            extra={<div>
                                <CalendarOutline style={{fontSize:"20px"}} />
                            </div>}
                        >
                            <Input placeholder={"To Date"}   />

                            {/*<Input placeholder={"From Date"} value={date} onChange={(value)=>{setDate(value)}  }  />*/}
                        </Form.Item>
                        <Form.Item
                        name="is_end"
                        label="Is End?"
                        >
                            <Switch checked={isEnd} onChange={(value) => setIsEnd(value)} />
                        </Form.Item>
                    </Form>
                </Popup>

            </div>
        </div>
    );
};

export default Orders;
