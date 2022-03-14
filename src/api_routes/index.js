
const { hostname, protocol } = window.location

const apiRoutes = {
    userAuth: `${protocol}//${hostname}:5000/api/auth/users/register`,
    adminAuth: `${protocol}//${hostname}:5000/api/auth/admin_auth/register`,
    logIn: `${protocol}//${hostname}:5000/api/auth/users/logIn`,
    approveRegRequest: `${protocol}//${hostname}:5000/api/users/request/registeration`,
    rejectRegRequest: `${protocol}//${hostname}:5000/api/users/request/registeration/reject`,
    setPermission: `${protocol}//${hostname}:5000/api/staff/permission/set`,
    changePermission: `${protocol}//${hostname}:5000/api/staff/permission/edit`,
    getAllUsers: `${protocol}//${hostname}:5000/api/users/all`,
    getUsersById: `${protocol}//${hostname}:5000/api/users/id`,
    createToken: `${protocol}//${hostname}:5000/api/token/generate`,
    getTokens: `${protocol}//${hostname}:5000/api/token/getToken`,
    deleteToken: `${protocol}//${hostname}:5000/api/token/deleteToken`,
    sendMail: `${protocol}//${hostname}:5000/api/user/sendMail`,
    getGroupByUserId: `${protocol}//${hostname}:5000/api/user/groups/all`,
    getGroupMembers: `${protocol}//${hostname}:5000/api/user/groups/members`,
    createGroup: `${protocol}//${hostname}:5000/api/user/groups/create`,
    addGroupMembers: `${protocol}//${hostname}:5000/api/user/groups/addMembers`,
    editGroup: `${protocol}//${hostname}:5000/api/user/groups/edit`,
    deleteGroupMembers: `${protocol}//${hostname}:5000/api/user/groups/deleteMemebers`,
    deleteGroup: `${protocol}//${hostname}:5000/api/user/groups/deleteGroup`,
    addDocument: `${protocol}//${hostname}:5000/api/user/documents/add`,
    addFeedback: `${protocol}//${hostname}:5000/api/documents/feedback/add`,
    getDocFeedBack: `${protocol}//${hostname}:5000/api/documents/feedback/all`,
    editDocument: `${protocol}//${hostname}:5000/api/user/documents/edit`,
    deleteDocument: `${protocol}//${hostname}:5000/api/user/documents/delete`,
    getAllDocs: `${protocol}//${hostname}:5000/api/documents/all`,
    getDocsById: `${protocol}//${hostname}:5000/api/documents/id`,
    getDocsGroupId: `${protocol}//${hostname}:5000/api/documents/groups/id`,
}

export default apiRoutes
