const isAuthenticated = () => {
    return !!localStorage.auth_token;
};

export default isAuthenticated
