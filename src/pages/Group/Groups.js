import React, { useState, useEffect, useContext } from "react";
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
    const [groupdata, setGroupData] = useState([]);
    const [memberdata, setMemberData] = useState([]);

    // show more action
    function showMoreAction(e) {
        let target = e.target.parentElement.parentElement.lastChild;
        target.classList.toggle("show");
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
            // format group data. 
            let formatedGroupData = []
            let fdata = data.data.filter((g) => g.id === g.id)
            console.log(fdata);
            if (fdata.length > 1) {
                formatedGroupData.push(fdata[0])
                return setGroupData(formatedGroupData);
            }
            setGroupData(fdata);

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

    useEffect(() => {
        getGroups();
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
                            <p>You dont belong to any group.</p>
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
                                            <li
                                                onClick={() => setAMVisibility(!AMvisibility)}
                                                data-group_id={list.id}
                                            >
                                                Add Members
                                            </li>
                                            {list.userId !== localData.id ? "" : <li data-group_id={list.id}>Delete</li>}
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
    return (
        <Modal>
            <div className="create-group">
                <div className="head">
                    <h3>Create Group</h3>
                </div>
                <br />
                <input type="text" placeholder="Group Name" className="input name" />
                <input
                    type="text"
                    placeholder="Course Name"
                    className="input course-name"
                />
                <input
                    type="text"
                    placeholder="Course Type"
                    className="input course-type"
                />
                <br />
                <div className="action">
                    <button className="btn cancel" onClick={() => setCGVisibility(false)}>
                        Cancel
                    </button>
                    <button className="btn create">Create Group</button>
                </div>
            </div>
        </Modal>
    );
}

function ViewMembers({ setVMVisibility, data, loading }) {
    const [visibility, setVisibility] = useState(false)
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
                                            <li key={list.id}>
                                                <small>{list.userName}</small>
                                                <button className="del btn" data-member_id={list.userId}>
                                                    <FaTrash />
                                                </button>
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
    const [groupid, setyGroupId] = useState("")
    const

    return (
        <Modal>
            <div className="members-cont">
                <div className="head">
                    <h3>Members</h3>
                </div>
                <br />
                <label htmlFor="">Group Name</label>
                <select name="" className="select">
                    {
                        loading ?
                            <option value="">fetching group...</option>
                            :
                            data && data.length === 0 ?
                                <option value="">No group available.</option>
                                :
                                data.map((g) => {
                                    return (
                                        <option value={g.id} key={g.id}>{g.name}</option>
                                    )
                                })
                    }
                </select>
                <br />
                <label htmlFor="">Member Name</label>
                <select name="" className="select">
                    <option value="">members name</option>
                </select>
                <br />
                <div className="action">
                    <button className="btn cancel" onClick={() => setAMVisibility(false)}>
                        Cancel
                    </button>
                    <button className="btn create">Add Member</button>
                </div>
            </div>
        </Modal>
    );
}
