// ThemeProvider.js
import React, { useState } from 'react';
import { ConfigProvider } from 'antd-mobile';

const ThemeProvider = ({ children }) => {
    const [darkMode, setDarkMode] = useState(false);

    const theme = {
        // Define your dark theme variables
        dark: {
            // Example dark theme variables
            '@brand-primary': '#333',
            '@text-color': '#fff',
        },
        // Define your light theme variables
        light: {
            // Example light theme variables
            '@brand-primary': '#1890ff',
            '@text-color': '#333',
        },
    };

    return (
        <ConfigProvider theme={darkMode ? theme.dark : theme.light}>
            {children}
        </ConfigProvider>
    );
};

export default ThemeProvider;
