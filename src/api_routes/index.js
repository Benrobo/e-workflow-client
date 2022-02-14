
const { hostname, protocol } = window.location

const apiRoutes = {
    userAuth: `${protocol}//localhost:5000/api/auth/officer/register`,
    adminAuth: `${protocol}//${hostname}:5000/api/auth/admin_auth/register`,
    logIn: `${protocol}//${hostname}:5000/api/auth/users/logIn`,
    approveRegRequest: `${protocol}//${hostname}:5000/api/users/request/registeration`,
    rejectRegRequest: `${protocol}//${hostname}:5000/api/users/request/registeration/reject`,
}

export default apiRoutes
