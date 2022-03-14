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
const notif = new Notification(4000);

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

  //   document deleting
  const [docdeleteloading, setDocDeleteLoading] = useState(false);

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

  async function deleteDocument(docId, docType, user_id) {
    const confirm = window.confirm(
      "Are you sure you wanna delete this document?"
    );
    if (confirm === false) return false;
    try {
      setDocDeleteLoading(true);
      let url = apiRoutes.deleteDocument;
      let options = {
        method: "delete",
        headers: {
          Authorization: `Bearer ${localData.refreshToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          userId: user_id,
          documentId: docId,
          documentType: docType,
        }),
      };
      let res = await fetch(url, options);
      let result = await res.json();

      setDocDeleteLoading(false);

      if (result && result.error === true) {
        return notif.error(result.message);
      }

      notif.success(result.message);
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    } catch (err) {
      setDocDeleteLoading(false);
      return notif.error(err.message);
    }
  }

  function editDocument() {
    notif.error("Feature COMING SOON!!");
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
                          <li
                            data-doc_id={doc.id}
                            data-doc_id={doc.userId}
                            onClick={(e) => {
                              editDocument();
                            }}
                          >
                            Edit
                          </li>
                        )}
                        {doc.userId !== localData.id ? (
                          ""
                        ) : (
                          <li
                            data-doc_id={doc.id}
                            data-user_id={doc.userId}
                            data-doctype={doc.documentType}
                            onClick={async (e) => {
                              let tgt = e.target.dataset;
                              if (Object.entries(tgt).length > 2) {
                                const { doc_id, user_id, doctype } = tgt;
                                await deleteDocument(doc_id, doctype, user_id);
                              }
                            }}
                          >
                            {docdeleteloading ? "Deleting" : "Delete"}
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
  const [staffid, setStaffId] = useState("");
  const [memberloading, setMemberLoading] = useState(false);
  const [viewmembers, setViewMembers] = useState(false);
  const [members, setMembers] = useState([]);
  // feedback
  const [feedback, setFeedBack] = useState("");
  const [addfeedback, setAddFeedback] = useState(false);
  const [addfeedbackloading, setAddFeedbackLoading] = useState(false);
  const [viewfeedback, setViewFeedback] = useState(false);
  const [deletefeedbackloading, setDeleteFeedbackLoading] = useState(false);
  const [feedbackloading, setFeedBackLoading] = useState(false);
  const [feedbackerror, setFeedBackError] = useState("");
  const [feedbacks, setFeedBacks] = useState([]);
  // approve and reject
  const [approveloading, setApproveLoading] = useState(false);
  const [rejectloading, setRejectLoading] = useState(false);

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
      setStaffId(result.document[0].staffId);
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
        return;
      }
      console.log(result);
      setMembers(result.data);
    } catch (err) {
      setMemberLoading(false);
      setMemberFetchError(err.message);
      setMemberFetchError(err.message);
    }
  }

  async function fetchFeedbacks(docId) {
    try {
      setFeedBackLoading(true);
      let url = apiRoutes.getDocFeedBack;
      let options = {
        method: "post",
        headers: {
          Authorization: `Bearer ${localData.refreshToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          documentId: docId,
        }),
      };
      let res = await fetch(url, options);
      let result = await res.json();

      setFeedBackLoading(false);

      if (result && result.error === true) {
        setFeedBackError(result.message);
        return;
      }
      console.log(result);
      setFeedBacks(result.data);
    } catch (err) {
      setFeedBackLoading(false);
      setFeedBackError(err.message);
    }
  }

  async function deleteFeedback(docId, staffId, feedbackId) {
    try {
      setDeleteFeedbackLoading(true);
      let url = apiRoutes.deleteFeedback;
      let options = {
        method: "delete",
        headers: {
          Authorization: `Bearer ${localData.refreshToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          documentId: docId,
          staffId,
          feedbackId,
        }),
      };
      let res = await fetch(url, options);
      let result = await res.json();

      setDeleteFeedbackLoading(false);

      if (result && result.error === true) {
        return notif.error(result.message);
      }
      notif.success(result.message);
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    } catch (err) {
      setDeleteFeedbackLoading(false);
      notif.error(err.message);
    }
  }

  async function addFeedback() {
    try {
      setAddFeedbackLoading(true);
      let url = apiRoutes.addFeedback;
      let options = {
        method: "post",
        headers: {
          Authorization: `Bearer ${localData.refreshToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          documentId,
          staffId: staffid,
          note: feedback,
        }),
      };
      let res = await fetch(url, options);
      let result = await res.json();

      setAddFeedbackLoading(false);

      if (result && result.error === true) {
        notif.error(result.message);
        return;
      }
      notif.success(result.message);
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    } catch (err) {
      setAddFeedbackLoading(false);
      notif.error(err.message);
    }
  }

  async function approveDocument(docId, staffId, docType) {
    try {
      setApproveLoading(true);
      let url = apiRoutes.approveDocument;
      let options = {
        method: "put",
        headers: {
          Authorization: `Bearer ${localData.refreshToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          documentId: docId,
          staffId,
          documentType: docType,
        }),
      };
      let res = await fetch(url, options);
      let result = await res.json();

      setApproveLoading(false);

      if (result && result.error === true) {
        notif.error(result.message);
        return;
      }
      notif.success(result.message);
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    } catch (err) {
      setApproveLoading(false);
      notif.error(err.message);
    }
  }

  async function rejectDocument(docId, staffId, docType) {
    try {
      setRejectLoading(true);
      let url = apiRoutes.rejectDocument;
      let options = {
        method: "put",
        headers: {
          Authorization: `Bearer ${localData.refreshToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          documentId: docId,
          staffId,
          documentType: docType,
        }),
      };
      let res = await fetch(url, options);
      let result = await res.json();

      setRejectLoading(false);

      if (result && result.error === true) {
        notif.error(result.message);
        return;
      }
      notif.success(result.message);
      setTimeout(() => {
        window.location.reload(true);
      }, 1000);
    } catch (err) {
      setRejectLoading(false);
      notif.error(err.message);
    }
  }

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
                        : doc.status === "approved"
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
                        disabled={approveloading ? true : false}
                        data-staff_id={doc.staffId}
                        data-doc_id={doc.id}
                        data-doc_type={doc.documentType}
                        onClick={async (e) => {
                          let tgt = e.target.dataset;
                          if (Object.entries(tgt).length > 2) {
                            const { staff_id, doc_id, doc_type } = tgt;
                            await approveDocument(doc_id, staff_id, doc_type);
                          }
                        }}
                      >
                        {approveloading ? "Approving..." : "Approve"}
                      </button>
                    )}
                    {doc.staffId === localData.id && (
                      <button
                        className="btn reject"
                        disabled={rejectloading ? true : false}
                        data-staff_id={doc.staffId}
                        data-doc_id={doc.id}
                        data-doc_type={doc.documentType}
                        onClick={async (e) => {
                          let tgt = e.target.dataset;
                          if (Object.entries(tgt).length > 2) {
                            const { staff_id, doc_id, doc_type } = tgt;
                            await rejectDocument(doc_id, staff_id, doc_type);
                          }
                        }}
                      >
                        {rejectloading ? "Rejecting..." : "Reject"}
                      </button>
                    )}
                    {doc.documentType === "FYP" && (
                      <button
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
                    )}
                    {doc.type === "staff" && (
                      <button
                        className="btn report"
                        data-doc_id={doc.id}
                        onClick={() => {
                          setAddFeedback(!addfeedback);
                        }}
                      >
                        Feedback
                      </button>
                    )}
                  </div>
                  <div className="main">
                    {addfeedback && (
                      <>
                        <textarea
                          name=""
                          id=""
                          cols="30"
                          rows="3"
                          className="report"
                          maxLength={200}
                          defaultValue={feedback}
                          onChange={(e) => setFeedBack(e.target.value)}
                        ></textarea>
                        <button
                          className="btn add-btn btn-block"
                          onClick={async (e) => {
                            await addFeedback();
                          }}
                        >
                          {addfeedbackloading
                            ? "Adding Feedback.."
                            : "Add Feedback"}
                        </button>
                      </>
                    )}
                    <br />
                    {viewmembers && (
                      <div className="members-cont">
                        <p>Members</p>
                        {memberloading ? (
                          "loading..."
                        ) : memberfetcherror !== "" ? (
                          <li>{memberfetcherror}</li>
                        ) : members && members.length === 0 ? (
                          <li>No members available</li>
                        ) : (
                          members.map((user) => {
                            return <li key={user.id}>{user.userName}</li>;
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <br />
                <div className="reports">
                  <div className="head">
                    <button
                      className="btn"
                      onClick={() => {
                        fetchFeedbacks(documentId);
                        setViewFeedback(!viewfeedback);
                      }}
                    >
                      view
                    </button>
                    <span>All Feedbacks</span>
                  </div>
                  <br />
                  {viewfeedback && (
                    <div className="reports-container">
                      {feedbackloading ? (
                        <small>loading...</small>
                      ) : feedbackerror !== "" ? (
                        <small>{feedbackerror}</small>
                      ) : feedbacks && feedbacks.length === 0 ? (
                        <small>No feedbacks</small>
                      ) : (
                        feedbacks.map((data) => {
                          return (
                            <div className="bx">
                              <br />
                              <span>
                                <em>{data.userName}</em>
                              </span>
                              {data.staffId === localData.id && (
                                <button
                                  className="btn ml-2 delete"
                                  data-staff_id={data.staffId}
                                  data-feedback_id={data.id}
                                  data-doc_id={data.documentId}
                                  onClick={async (e) => {
                                    let tgt = e.target.dataset;
                                    if (Object.entries(tgt).length > 2) {
                                      const { staff_id, feedback_id, doc_id } =
                                        tgt;
                                      await deleteFeedback(
                                        doc_id,
                                        staff_id,
                                        feedback_id
                                      );
                                    }
                                  }}
                                >
                                  {deletefeedbackloading
                                    ? "deleting..."
                                    : "delete"}
                                </button>
                              )}
                              <br />
                              <p className="body">{data.note}</p>
                            </div>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          );
        })
      )}
    </div>
  );
}
