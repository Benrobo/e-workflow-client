import React, { useState, useEffect, useContext, useRef } from "react";
import MainCont from "../../components/MainCont/MainCont";
import LeftNavbar from "../../components/LeftNavbar";
import "./style.css";
import Layout from "../../components/Layout/Layout";
import TopNavbar from "../../components/TopNavbar/Top";
import { BiPlus, BiMenuAltLeft } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { Notification } from "../../helpers/util";
import Modal from "../../components/Modal/Modal";
import DataContext from "../../context/DataContext";
import apiRoutes from "../../api_routes";

const notif = new Notification();

function Groups() {
    const { locData, localData } = useContext(DataContext);
    const [CGvisibility, setCGVisibility] = useState(false); // create group
    const [AMvisibility, setAMVisibility] = useState(false); // add members
    const [VMvisibility, setVMVisibility] = useState(false); // view members
    const [grouploading, setGroupLoading] = useState(false);
    const [membersloading, setMembersLoading] = useState(false);
    const [deleteloading, setDeleteLoading] = useState(false);
    const [groupdata, setGroupData] = useState([]);
    const [memberdata, setMemberData] = useState([]);

    // show more action
    function showMoreAction(e) {
        let target = e.target.parentElement.parentElement.lastChild;
        target.classList.toggle("show")
    }


    async function getGroups() {
        try {
            let url = apiRoutes.getGroupByUserId;
            let options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                }),
            };
            setGroupLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setGroupLoading(false);

            if (data && data.error === true) {
                return notif.error(data.message);
            }
            setGroupData(data.data);

        } catch (err) {
            setGroupLoading(false);
            return notif.error(err.message);
        }
    }

    async function getMembers(groupId) {
        try {
            let url = apiRoutes.getGroupMembers;
            let options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    groupId
                })
            };
            setMembersLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setMembersLoading(false);

            if (data && data.error === true) {
                return notif.error(data.message);
            }
            console.log(data);

            setMemberData(data.data);
        } catch (err) {
            setMembersLoading(false);
            return notif.error(err.message);
        }
    }

    async function deleteGroup(groupId) {
        const confirm = window.confirm("are you sure you wanna delete this group?")

        if (confirm === false) return false;

        try {
            let url = apiRoutes.deleteGroup;
            let options = {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    groupId
                })
            };
            setDeleteLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setDeleteLoading(false);

            if (data && data.error === true) {
                return notif.error(data.message);
            }

            notif.success(data.message)
            setTimeout(() => {
                window.location.reload(true)
            }, 1000);
        } catch (err) {
            setDeleteLoading(false);
            return notif.error(err.message);
        }
    }
    useEffect(() => {
        getGroups();
        console.log(groupdata);
    }, []);

    return (
        <Layout>
            <LeftNavbar active="groups" />
            <MainCont>
                <TopNavbar activeBar="Groups" />

                <div className="group-list">
                    <div className="left">
                        <button
                            className="btn create"
                            onClick={() => setCGVisibility(true)}
                        >
                            <BiPlus className="icon" />
                            Create Group
                        </button>
                    </div>
                    <div className="right">
                        {grouploading ? (
                            <p>fetchfing groups...</p>
                        ) : groupdata && groupdata.length === 0 ? (
                            <p>Group you belong to would show here..</p>
                        ) : (
                            groupdata.map((list, i) => {
                                return (
                                    <div className="group-card" key={i}>
                                        <img
                                            src={`https://avatars.dicebear.com/api/initials/${list.name}.svg`}
                                            alt=""
                                        />
                                        <div className="more">
                                            <p>{list.name}</p>
                                            <br />
                                            <button
                                                className="btn view-member"
                                                onClick={(e) => {
                                                    showMoreAction(e);
                                                }}
                                            >
                                                ...
                                            </button>
                                        </div>
                                        <div className="more-action">
                                            <li
                                                onClick={async (e) => {
                                                    let target = e.target.dataset;
                                                    if (Object.entries(target).length > 0) {
                                                        let groupid = target.group_id;
                                                        await getMembers(groupid)
                                                        setVMVisibility(!VMvisibility)
                                                    }
                                                }}
                                                data-group_id={list.id}
                                            >
                                                Members
                                            </li>
                                            {list.userId === localData.id ? <li
                                                onClick={() => setAMVisibility(!AMvisibility)}
                                                data-group_id={list.id}
                                            >
                                                Add Members
                                            </li> : ""}
                                            {list.userId === localData.id ? <li data-group_id={list.id} onClick={async (e) => {
                                                let target = e.target.dataset;
                                                if (Object.entries(target).length > 0) {
                                                    let groupid = target.group_id;
                                                    await deleteGroup(groupid)
                                                }
                                            }}>
                                                {deleteloading ? "deleting.." : "Delete"}
                                            </li> : ""}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                {CGvisibility && <CreateGroup setCGVisibility={setCGVisibility} />}
                {VMvisibility && <ViewMembers data={memberdata} loading={membersloading} setVMVisibility={setVMVisibility} />}
                {AMvisibility && <AddMembers data={groupdata} loading={grouploading} setAMVisibility={setAMVisibility} />}
            </MainCont>
        </Layout>
    );
}

export default Groups;

function CreateGroup({ setCGVisibility }) {
    const { localData } = useContext(DataContext)
    const [loading, setLoading] = useState(false);
    const [groupname, setGroupName] = useState("");
    const [coursename, setCourseName] = useState("");
    const [coursetype, setCourseType] = useState("");

    async function createGroup() {
        if (groupname === "") {
            return notif.error("group name cant be empty")
        }
        if (coursename === "") {
            return notif.error("course name cant be empty")
        }
        if (coursetype === "") {
            return notif.error("course type cant be empty")
        }


        try {
            let url = apiRoutes.createGroup;
            let options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    studentId: localData.id,
                    courseName: coursename,
                    courseType: coursetype,
                    name: groupname
                })
            };
            setLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();
            setLoading(false);
            if (data && data.error === true) {
                return notif.error(data.message);
            }
            notif.success(data.message)
            setTimeout(() => {
                window.location.reload(true)
            }, 1000);
        } catch (err) {
            setLoading(false);
            return notif.error(err.message);
        }
    }


    return (
        <Modal>
            <div className="create-group">
                <div className="head">
                    <h3>Create Group</h3>
                </div>
                <br />
                <input type="text" placeholder="Group Name" onChange={(e) => setGroupName(e.target.value)}
                    defaultValue={groupname} maxLength={200} className="input name" />
                <input
                    type="text"
                    placeholder="Course Name"
                    className="input course-name"
                    onChange={(e) => setCourseName(e.target.value)}
                    defaultValue={coursename} maxLength={200}
                />
                <input
                    type="text"
                    placeholder="Course Type"
                    className="input course-type"
                    onChange={(e) => setCourseType(e.target.value)}
                    defaultValue={coursetype} maxLength={200}
                />
                <br />
                <div className="action">
                    <button className="btn cancel" onClick={() => setCGVisibility(false)}>
                        Cancel
                    </button>
                    <button className="btn create" onClick={() => createGroup()}>
                        {loading ? "Creating group..." : "Create Group"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

function ViewMembers({ setVMVisibility, data, loading }) {
    console.log(data);
    const { localData } = useContext(DataContext)
    const [visibility, setVisibility] = useState(false)
    const [deleteloading, setDeleteLoading] = useState(false);

    async function deleteMember(groupId, memberId) {
        try {
            let url = apiRoutes.deleteGroupMembers;
            let options = {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    memberId,
                    groupId
                })
            };
            setDeleteLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setDeleteLoading(false);

            if (data && data.error === true) {
                return notif.error(data.message);
            }

            notif.success(data.message)

        } catch (err) {
            setDeleteLoading(false);
            return notif.error(err.message);
        }
    }

    return (
        <Modal setVisibility={setVisibility}>
            <div className="members-cont">
                <div className="head">
                    <h3>Members <span className="count">{data.length}</span></h3>
                </div>
                <br />
                {
                    loading ?
                        <p>fetching members</p>
                        :
                        <div className="members-list">
                            {
                                data && data.length === 0 ?
                                    <p>No members added.</p>
                                    :
                                    data.map((list, i) => {
                                        return (
                                            <li key={list.memberId}>
                                                <small>{list.userName}</small>
                                                {list.userId === localData.id ?
                                                    list.memberId === localData.id ?
                                                        ""
                                                        :
                                                        <button className="del btn" data-member_id={list.memberId} data-group_id={list.id} onClick={async (e) => {
                                                            let target = e.target.dataset;
                                                            let length = Object.entries(target).length;
                                                            if (length > 1) {
                                                                let memberId = target.member_id;
                                                                let groupId = target.group_id;
                                                                await deleteMember(groupId, memberId)
                                                            }
                                                        }}>
                                                            {deleteloading ? "deleting..." : "delete"}
                                                        </button>
                                                    :
                                                    ""
                                                }
                                            </li>
                                        )
                                    })
                            }
                        </div>
                }
                <br />
                <button className="btn" onClick={() => setVMVisibility(false)}>
                    close
                </button>
            </div>
        </Modal>
    );
}

function AddMembers({ setAMVisibility, data, loading }) {
    console.log(data)
    const { locData, localData } = useContext(DataContext);
    const [fetchloading, setFetchLoading] = useState(false);
    const [memberloading, setMemberLoading] = useState(false)
    const [usersdata, setUsersData] = useState([])
    const [groupid, setGroupId] = useState("")
    const [selecteduserid, setSelectedUserId] = useState("")

    async function fetchAllUsers() {
        try {
            let url = apiRoutes.getAllUsers;
            let options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                }
            };
            setFetchLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setFetchLoading(false);

            if (data && data.error === true) {
                return notif.error(data.message);
            }

            console.log(data);

            let filteredData = data.data.filter((users) => users.type === "student")
            setUsersData(filteredData);
        } catch (err) {
            setFetchLoading(false);
            return notif.error(err.message);
        }
    }

    async function addMembers() {
        if (groupid === "") {
            return notif.error("please select a group to add member to.")
        }
        if (selecteduserid === "") {
            return notif.error("please select a user to add.")
        }
        try {
            let url = apiRoutes.addGroupMembers;
            let options = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    memberId: selecteduserid,
                    groupId: groupid
                })
            };
            setMemberLoading(true);
            let res = await fetch(url, options);
            let data = await res.json();

            setMemberLoading(false);

            if (data && data.error === true) {
                return notif.error(data.message);
            }

            notif.success(data.message)

        } catch (err) {
            setMemberLoading(false);
            return notif.error(err.message);
        }
    }

    useEffect(() => {
        fetchAllUsers()
    }, [])


    return (
        <Modal>
            <div className="members-cont">
                <div className="head">
                    <h3>Members</h3>
                </div>
                <br />
                <label htmlFor="">Group Name</label>
                <select name="" className="select" onClick={async (e) => {
                    setGroupId(e.target.value)
                }}>
                    <option value="">-----</option>
                    {
                        loading ?
                            <option value="">fetching group...</option>
                            :
                            data && data.length === 0 ?
                                <option value="">No group available.</option>
                                :
                                data.filter((group) => {
                                    return group.userId === localData.id
                                }).map((g) => {
                                    return (
                                        <option value={g.id} key={g.id}>{g.name}</option>
                                    )
                                })
                    }
                </select>
                <br />
                <label htmlFor="">All Users</label>
                <select name="" className="select" disabled={fetchloading ? true : false} onClick={(e) => {
                    setSelectedUserId(e.target.value)
                }}>
                    <option value="">-----</option>
                    {
                        usersdata && usersdata.length === 0 ?
                            <option value="">No users available</option>
                            :
                            usersdata.map((users) => {
                                return (
                                    <option value={users.userId}>{users.userName} {`${users.phoneNumber.split("").splice(0, 5).join("")}..${users.phoneNumber.split("").splice(-3).join("")}`} {users.userId === localData.id ? "(you)" : ""} </option>
                                )
                            })
                    }
                </select>
                <br />
                <div className="action">
                    <button className="btn cancel" onClick={() => setAMVisibility(false)}>
                        Cancel
                    </button>
                    <button className="btn create" onClick={async () => {
                        await addMembers()
                    }}>
                        {memberloading ? "Adding member..." : "Add Member"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}
