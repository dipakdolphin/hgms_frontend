import axios from "axios";
import {Dialog} from "antd-mobile";

// const baseURL = process.env.REACT_APP_BACKEND_URL;


const AxiosInstance = ()=> {

    const axiosInstance = axios.create({
        baseURL : "http://localhost:8080",
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "X-Client"  : "Web/Desktop",
        },
    });

    axiosInstance.interceptors.request.use(
        (config) => {
            // Modify the request config, if needed
            // For example, you can add authentication headers here
            // config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
            if (localStorage.auth_token) {
                config.headers.Authorization = `Bearer ${localStorage.auth_token}`;
            }
            return config;
        },
        (error) => {
            // Do something with the request error
            return Promise.reject(error);
        }
    );

    axiosInstance.interceptors.response.use(
        (response) => {
            // Modify the response data, if needed
            return response;
        },
        (error) => {
            if (!error.response) {
                // Handle network errors
                return Promise.reject('Network Error: Unable to reach the server. Please check your internet connection.');
            }

            if (error.response.status === 403) {
                Dialog.alert({
                    content:'You are not allowed',
                    closeOnMaskClick:true
                })
                // localStorage.removeItem('auth_token');
                // Navigate to the desired route on 403 error
                // window.location.replace("/");  // Assuming you want to replace the whole window location
            } else if (error.response.status === 500) {
                console.error('Internal Server Error:', error.message);
            } else {
                // Handle other response errors
                return Promise.reject(error);
            }
        }
    );
    return axiosInstance;
}
export default AxiosInstance;








//
// import axios from "axios";
// import History from "./History";
// import {message, Modal} from "antd";
// import {useNavigate} from "react-router-dom";
//
//
// const axiosInstance = () => {
//     // const navigate = useNavigate();
//     // const baseURL = process.env.REACT_APP_BACKEND_URL;
//     // const baseURL = 'http://localhost:8080/api';
//
//     let headers = {};
//
//     if (localStorage.auth_token) {
//         headers.Authorization = `Bearer ${localStorage.auth_token}`;
//     }
//     const baseURL = process.env.REACT_APP_BACKEND_URL;
//
//     const axiosInstance = axios.create({
//
//         baseURL:baseURL,
//         headers,
//     });
//     const ServerError = (data) => {
//         Modal.error({
//             title: 'Lost server connection',
//             content: data.message,
//         });
//     };
//
//     axiosInstance.interceptors.response.use(
//         (response) => response,
//         (error) => {
//             if (!error.response) {
//                 ServerError(error)
//                 // return Promise.reject(error);
//                 return Promise.reject('Network Error: Unable to reach the server. Please check your internet connection.');
//             }
//
//             if (error.response.status === 403) {
//                 const navigate = useNavigate();
//                 localStorage.removeItem('auth_token');
//                 navigate("/", { replace: true });
//                 // History();
//                 // Navigate to the desired route on 403 error
//                // return <Navigate to='/' state={{from: location}} replace/>
//                //  History('/', { replace: true });
//
//             } else if (error.response.status === 500) {
//                 message.error('Internal Server Error:', error.message);
//             }
//             return Promise.reject(error);
//         }
//     );
//
//     // axiosInstance.interceptors.response.use(
//     //     response => new Promise(
//     //         (resolve, reject) => {
//     //             resolve(response);
//     //         }),
//     //
//     //     (error) => {
//     //         if(!error.response){
//     //             return new Promise((resolve, reject) => {
//     //                 reject(error)
//     //             });
//     //         }
//     //         if(error.response.status===403){
//     //             localStorage.removeItem('auth_token');
//     //             History("/",{ replace: true });
//     //         }else {
//     //             return new Promise((resolve, reject) => {
//     //                 reject(error);
//     //             });
//     //         }
//     //     });
//
//     return axiosInstance;
// };
//
// export default axiosInstance;
