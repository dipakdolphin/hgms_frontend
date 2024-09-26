import React, { useState, useLayoutEffect } from 'react';
import { ConfigProvider, Badge, Divider, JumboTabs, SearchBar, Slider, Space, Switch, TabBar } from 'antd-mobile';
import { AppOutline, MessageFill, MessageOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons';
import { Line } from '@ant-design/charts';

const App = () => {
    // Retrieve dark mode preference from local storage or default to true if not found
    const [darkMode, setDarkMode] = useState(() => {
        const storedDarkMode = localStorage.getItem('darkMode');
        return storedDarkMode ? JSON.parse(storedDarkMode) : true;
    });

    // Update local storage and apply theme when dark mode preference changes
    useLayoutEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        document.documentElement.setAttribute(
            'data-prefers-color-scheme',
            darkMode ? 'dark' : 'light'
        );
    }, [darkMode]);

    const data = [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
    ];

    const lineConfig = {
        data,
        xField: 'year',
        yField: 'value',
        height: 200,
    };

    return (
        <ConfigProvider theme={darkMode ? 'dark' : 'light'}>
            <div title='Switch'>
                <Space align='center'>
                    <div>Dark Mode</div>
                    <Switch
                        checked={darkMode}
                        onChange={v => {
                            setDarkMode(v);
                        }}
                    />
                </Space>
            </div>
            <div title='JumboTabs' padding='0'>
                <JumboTabs defaultActiveKey='1'>
                    {/* Your JumboTabs content */}
                </JumboTabs>
            </div>

            <div title='Slider'>
                <Slider defaultValue={40} />
            </div>

            <div title='SearchBar'>
                <SearchBar placeholder='请输入内容' showCancelButton />
            </div>

            <div title='Tabs' padding='0'>
                <TabBar>
                    {/* Your TabBar content */}
                </TabBar>
            </div>

            <div title='Divider'>
                <Divider>默认内容在中间</Divider>
            </div>

            {/* Display the line chart */}
            <Line {...lineConfig}  />
        </ConfigProvider>
    );
};

export default App;
