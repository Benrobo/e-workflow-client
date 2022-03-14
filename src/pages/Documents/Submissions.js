import React, { useState, useContext, useEffect } from "react";
import MainCont from "../../components/MainCont/MainCont";
import LeftNavbar from "../../components/LeftNavbar";

import "./style.css";
import Layout from "../../components/Layout/Layout";
import TopNavbar from "../../components/TopNavbar/Top";
import { Notification } from "../../helpers/util";
import DataContext from "../../context/DataContext";
import apiRoutes from "../../api_routes";
import Badge from "../../components/Badge/badge";
import menuimg from "../../assets/icons/menu.png";
import { FaArrowDown } from "react-icons/fa";
const notif = new Notification();

function Submissions() {
    const { localData } = useContext(DataContext);
    const [documentId, setDocumentId] = useState("");
    const [docview, setDocView] = useState(false);

    return (
        <Layout>
            <LeftNavbar active="submissions" />
            <MainCont>
                <TopNavbar activeBar="Submissions" />
                {docview ? (
                    <ViewDocument setDocView={setDocView} documentId={documentId} />
                ) : (
                    <DocTables setDocView={setDocView} setDocumentId={setDocumentId} />
                )}
            </MainCont>
        </Layout>
    );
}

export default Submissions;

function DocTables({ setDocView, setDocumentId }) {
    const { localData } = useContext(DataContext);
    const [fetchloading, setFetchLoading] = useState(false);
    const [error, setError] = useState("");
    const [docdata, setDocData] = useState([]);
    async function fetchAllDoc() {
        try {
            setFetchLoading(true);
            let url = apiRoutes.getAllDocs;
            let options = {
                method: "get",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
            };
            let res = await fetch(url, options);
            let result = await res.json();

            setFetchLoading(false);

            if (result && result.error === true) {
                setError(result.message);
                return notif.error(result.message);
            }
            console.log(result);
            setDocData(result.document);
        } catch (err) {
            setFetchLoading(false);
            setError(err.message);
            return notif.error(err.message);
        }
    }

    function openMore(e) {
        let target = e.target.parentElement.querySelector(".action-cont");
        target.classList.toggle("visibility");
    }

    function openViewDoc(e) {
        let target = e.target.dataset;
        if (Object.entries(target).length > 0) {
            let id = target.doc_id;
            if (id !== "") {
                setDocumentId(id);
                return setDocView(true);
            }
        }
    }

    useEffect(() => {
        fetchAllDoc();
    }, []);

    return (
        <div className="doc-list">
            <div className="head">
                <p>Students Documents Submisions</p>
            </div>
            <br />
            {fetchloading ? (
                <p>Fetching all documents...</p>
            ) : error !== "" ? (
                <p>{error}</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Course Type</th>
                            <th>Course Name</th>
                            <th>By</th>
                            <th>Status</th>
                            <th>Cordinator</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {docdata && docdata.length === 0 ? (
                            <p>No document Submited</p>
                        ) : (
                            docdata.map((doc) => {
                                return (
                                    <tr key={doc.id}>
                                        <td>{doc.title}</td>
                                        <td>
                                            <small>{doc.documentType.split("").join(".")}</small>
                                        </td>
                                        <td>
                                            <small>{doc.courseType}</small>
                                        </td>
                                        <td>
                                            <small>{doc.courseName}</small>
                                        </td>
                                        <td>
                                            <span className="by">
                                                {doc.userId === localData.id ? "you" : "others"}
                                            </span>
                                        </td>
                                        <td>
                                            <Badge
                                                text={doc.status}
                                                color={
                                                    doc.status === "pending"
                                                        ? "p"
                                                        : doc.status === "rejected"
                                                            ? "r"
                                                            : "a"
                                                }
                                            />
                                        </td>
                                        <td>
                                            <small>{doc.userName.toUpperCase()}</small>
                                        </td>
                                        <td className="action">
                                            <button className="btn more" onClick={(e) => openMore(e)}>
                                                more
                                            </button>
                                            <div className="action-cont">
                                                <li
                                                    data-doc_id={doc.id}
                                                    onClick={(e) => openViewDoc(e)}
                                                >
                                                    View
                                                </li>
                                                {doc.userId !== localData.id ? (
                                                    ""
                                                ) : (
                                                    <li data-doc_id={doc.id} data-doc_id={doc.userId}>
                                                        Edit
                                                    </li>
                                                )}
                                                {doc.userId !== localData.id ? (
                                                    ""
                                                ) : (
                                                    <li data-doc_id={doc.id} data-doc_id={doc.userId}>
                                                        Delete
                                                    </li>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

function ViewDocument({ documentId, setDocView }) {
    const { localData } = useContext(DataContext);
    const [fetchloading, setFetchLoading] = useState(false);
    const [docfetcherror, setDocFetchError] = useState("");
    const [memberfetcherror, setMemberFetchError] = useState("");
    const [docdata, setDocData] = useState([]);
    const [docid, setDocId] = useState("");
    const [memberloading, setMemberLoading] = useState(false);
    const [viewmembers, setViewMembers] = useState(false);
    const [members, setMembers] = useState([]);
    // feedback
    const [feedback, setFeedBack] = useState("")
    const [viewfeedback, setViewFeedback] = useState(false);
    const [feedbackloading, setFeedBackLoading] = useState(false)
    const [feedbackerror, setFeedBackError] = useState("")
    const [feedbacks, setFeedBacks] = useState([])
    // approve and reject
    const [approveloading, setApproveLoading] = useState(false)
    const [rejectloading, setRejectLoading] = useState(false)
    const [approveerror, setApproveError] = useState("")
    const [rejecterror, setRejectError] = useState("")

    async function fetchDoc() {
        if (documentId === "") return;
        console.log({ documentId });
        try {
            setFetchLoading(true);
            let url = apiRoutes.getDocsById;
            let options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    documentId: documentId,
                }),
            };
            let res = await fetch(url, options);
            let result = await res.json();

            setFetchLoading(false);

            if (result && result.error === true) {
                setDocFetchError(result.message);
                return notif.error(result.message);
            }
            console.log(result.document[0]);
            setDocData(result.document);
        } catch (err) {
            setFetchLoading(false);
            setDocFetchError(err.message);
            return notif.error(err.message);
        }
    }

    async function fetchMembers(groupId) {
        console.log(groupId);
        try {
            setMemberLoading(true);
            let url = apiRoutes.getGroupMembers;
            let options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    groupId,
                }),
            };
            let res = await fetch(url, options);
            let result = await res.json();

            setMemberLoading(false);

            if (result && result.error === true) {
                setMemberFetchError(result.message);
                return
            }
            console.log(result);
            setMembers(result.data);
        } catch (err) {
            setMemberLoading(false);
            setMemberFetchError(err.message);
            setMemberFetchError(err.message)
        }
    }

    async function fetchFeedbacks(docId) {
        console.log(groupId);
        try {
            setMemberLoading(true);
            let url = apiRoutes.getGroupMembers;
            let options = {
                method: "post",
                headers: {
                    Authorization: `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    userId: localData.id,
                    groupId,
                }),
            };
            let res = await fetch(url, options);
            let result = await res.json();

            setMemberLoading(false);

            if (result && result.error === true) {
                setMemberFetchError(result.message);
                return
            }
            console.log(result);
            setMembers(result.data);
        } catch (err) {
            setMemberLoading(false);
            setMemberFetchError(err.message);
            setMemberFetchError(err.message)
        }
    }

    async function addFeedback() {

    }

    async function approveDocument(docId, staffId) { }

    async function rejectDocument(docId, staffId) { }

    useEffect(() => {
        fetchDoc();
    }, [documentId]);

    return (
        <div className="view-document">
            {fetchloading ? (
                <p>Fetching documents...</p>
            ) : docfetcherror !== "" ? (
                <p>{docfetcherror}</p>
            ) : docdata && docdata.length === 0 ? (
                <p>No Document Available</p>
            ) : (
                docdata.map((doc) => {
                    return (
                        <>
                            <div className="document-container">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => setDocView(false)}
                                >
                                    close
                                </button>
                                <iframe src={doc.file} className="doc-preview"></iframe>
                            </div>
                            <div className="right-menu">
                                <div className="info">
                                    <label htmlFor="">Document Title</label>
                                    <h4>{doc.title.toUpperCase()}</h4>
                                    <br />
                                    <label htmlFor="">Status</label>
                                    <Badge
                                        text={doc.status}
                                        color={
                                            doc.status === "pending"
                                                ? "p"
                                                : doc.title === "approved"
                                                    ? "a"
                                                    : doc.status === "rejected"
                                                        ? "r"
                                                        : "p"
                                        }
                                    />
                                    <br />
                                    <label htmlFor="">Cordinator</label>
                                    <p>{doc.userName.toUpperCase()}</p>
                                    <br />
                                </div>
                                <div className="action">
                                    <div className="btn-action">
                                        {doc.staffId === localData.id && (
                                            <button
                                                className="btn approve"
                                                data-staff_id={doc.staffId}
                                                data-doc_id={doc.id}
                                                onClick={async (e) => {
                                                    let tgt = e.target.dataset;
                                                    if (Object.entries(tgt).length > 1) {
                                                        let staffid = tgt.staff_id;
                                                        let docid = tgt.doc_id;
                                                        await approveDocument(docid, staffid);
                                                    }
                                                }}
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {doc.staffId === localData.id && (
                                            <button
                                                className="btn reject"
                                                data-staff_id={doc.staffId}
                                                data-doc_id={doc.id}
                                                onClick={async (e) => {
                                                    let tgt = e.target.dataset;
                                                    if (Object.entries(tgt).length > 1) {
                                                        let staffid = tgt.staff_id;
                                                        let docid = tgt.doc_id;
                                                        await rejectDocument(docid, staffid);
                                                    }
                                                }}
                                            >
                                                Reject
                                            </button>
                                        )}
                                        {
                                            doc.documentType === "FYP" && <button
                                                className="btn report"
                                                data-group_id={doc.groupId}
                                                onClick={async (e) => {
                                                    let tgt = e.target.dataset;
                                                    console.log(tgt);
                                                    if (Object.entries(tgt).length > 0) {
                                                        let groupid = tgt.group_id;

                                                        await fetchMembers(groupid);
                                                        setViewMembers(!viewmembers);
                                                    }
                                                }}
                                            >
                                                Members
                                            </button>
                                        }
                                        <button
                                            className="btn report"
                                            data-doc_id={doc.id}
                                            onClick={() => {
                                                setAddFeedback(!addfeedback);
                                            }}
                                        >
                                            Add Feedback
                                        </button>
                                    </div>
                                    <br />
                                    <div className="main">
                                        {addfeedback && (
                                            <textarea
                                                name=""
                                                id=""
                                                cols="30"
                                                rows="3"
                                                className="report"
                                            ></textarea>
                                        )}
                                        <br />
                                        {viewmembers && (
                                            <div className="members-cont">
                                                <p>Members</p>
                                                {
                                                    memberloading ? "loading..." :
                                                        memberfetcherror !== "" ?
                                                            <li>{memberfetcherror}</li>
                                                            :
                                                            members && members.length === 0 ?
                                                                <li>No members available</li>
                                                                :
                                                                members.map((user) => {
                                                                    return (
                                                                        <li key={user.id}>{user.userName}</li>
                                                                    )
                                                                })
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <br />
                                <div className="reports">
                                    <div className="head">
                                        <button className="btn">new</button>
                                        <span>All Reports</span>
                                    </div>
                                    <br />
                                    <div className="reports-container">
                                        <div className="bx">
                                            <br />
                                            <span>
                                                {" "}
                                                <em>Stan Raff</em>{" "}
                                            </span>
                                            <br />
                                            <p className="body">
                                                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                Autem, quas?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })
            )}
        </div>
    );
}
