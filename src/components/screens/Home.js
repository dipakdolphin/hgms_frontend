import React, {useEffect, useState} from 'react';
import { Column } from '@ant-design/charts';
import AxiosInstance from "../../Utils/AxiosInstance";
import {Button, Grid} from "antd-mobile";
import {useNavigate} from "react-router-dom";
import Orders from "./Orders";

const Home = () => {
    const navigate = useNavigate();
    const [data, setData] = useState([])
    const graphData = ()=>{
        AxiosInstance().get("/chart_data").then(
            (res)=>{
                setData(res.data);
                // console.log((res.data).reverse())
            }
        )
    }
    useEffect(() => {
        graphData();
    }, []);

    const config = {
        data,
        xField: "name",
        yField: "sum",
        shapeField: 'column25D',
        height: 300,
    }

    return (
        <div >
            <div style={{background:'#00FFE1', padding:10}}>
                <div>
                    <h1 style={{textAlign:'center'}}>Monthly Expenses</h1>
                </div>
                <div >
                    <Column {...config} />;
                </div>
            </div>
            <div style={{margin:20}}>
                <Grid columns={3} gap={8}>
                    {/*<Grid.Item>*/}
                    {/*    <Button color={"primary"} onClick={()=>{navigate("/orders")}}>Orders</Button>*/}
                    {/*</Grid.Item>*/}

                    <Grid.Item>
                        <Button color={"primary"} onClick={()=>{navigate("/unitSetup")}} >Unit Setup</Button>
                    </Grid.Item>
                    <Grid.Item>
                        <Button color={"primary"} onClick={()=>{navigate("/productSetup")}} >ProductSetup</Button>
                    </Grid.Item>
                    {/*<Grid.Item>*/}
                    {/*    <Button color={"primary"}>Setup</Button>*/}
                    {/*</Grid.Item>*/}
                    {/*<Grid.Item>*/}
                    {/*    <Button color={"primary"}>Setup</Button>*/}
                    {/*</Grid.Item>*/}
                </Grid>
            </div>
            <Orders />




        </div>

    );
};

export default Home;
