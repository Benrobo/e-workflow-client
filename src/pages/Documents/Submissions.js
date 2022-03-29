import React, { useState, useContext, useEffect, useRef } from "react";
import MainCont from "../../components/MainCont/MainCont";
import LeftNavbar from "../../components/LeftNavbar";

import "./style.css";
import Layout from "../../components/Layout/Layout";
import TopNavbar from "../../components/TopNavbar/Top";
import { Notification } from "../../helpers/util";
import DataContext from "../../context/DataContext";
import apiRoutes from "../../api_routes";
import Badge from "../../components/Badge/badge";
import { FaCheckCircle } from 'react-icons/fa'

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
  // adding signature
  const [studentId, setStudentId] = useState("")
  const [doctype, setDocType] = useState("")
  // view updated doc
  const [viewupdoc, setViewUpDoc] = useState(false)
  const [viewsign, setViewSign] = useState(false)
  const [docid, setDocId] = useState("")

  async function fetchDoc() {
    if (documentId === "") return;
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
      setStudentId(result.document[0].userId)
    } catch (err) {
      setFetchLoading(false);
      setDocFetchError(err.message);
      return notif.error(err.message);
    }
  }

  async function fetchMembers(groupId) {
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
                <div className="frame-cont">
                  <iframe src={doc.file} className="doc-preview"></iframe>
                  {/* View Signature */}
                  <ViewDocumentSignatures studentId={studentId} documentId={doc.id} />
                  <br />
                  <br />
                  <br />
                </div>
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
                  <label htmlFor="">HOD NAME</label>
                  <p>{doc.hodName.toUpperCase()}</p>
                  <br />
                  <label htmlFor="">Student Name</label>
                  <p>{doc.studentName.toUpperCase()}</p>
                  <br />
                </div>
                <div className="action">
                  <div className="btn-action">
                    {(doc.documentPermissions > 1 && localData.type !== "student") && (
                      <button
                        className="btn approve"
                        data-doc_id={doc.id}
                        data-student_id={doc.userId}
                        data-doc_type={doc.documentType}
                        onClick={(e) => {
                          let tgt = e.target.dataset;
                          if (Object.entries(tgt).length > 0) {
                            const { doc_id, student_id, doc_type } = tgt;
                            setDocId(doc_id);
                            setViewSign(true)
                            setStudentId(student_id)
                            setDocType(doc_type)
                          }
                        }}
                      >
                        Add Signature
                      </button>
                    )}
                    <button
                      className="btn report"
                      onClick={(e) => {
                        setViewUpDoc(!viewupdoc)
                      }}
                    >
                      View Documents
                    </button>
                    {/* {(doc.documentPermissions === 4) && (
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
                    {(doc.documentPermissions === 4) && (
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
                    )} */}
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
                {/* Add Signature */}

                {/* Updated Document */}
                {viewupdoc && <ViewUpdatedDocuments />}
                {viewsign && <SignDocument studentId={studentId} setViewSign={setViewSign} doctype={doctype} documentId={docid} />}
              </div>
            </>
          );
        })
      )}
    </div>
  );
}


function ViewUpdatedDocuments() {

  return (
    <div className="updated-doc">
      <h2>View Updated Doc</h2>
    </div>
  )
}

function ViewDocumentSignatures({ studentId, documentId }) {
  const { localData } = useContext(DataContext);
  const [loading, setLoading] = useState(false)
  const [deletingloading, setDeleteLoading] = useState(false)
  const [error, setError] = useState("")
  const [data, setData] = useState([])
  const [image, setImage] = useState("")
  const [viewimg, setViewImg] = useState(false)

  // deleting signature
  const [staffId, setStaffId] = useState("")
  // const [studentId, setStudentId] = useState("")
  const [signatureId, setSignatureId] = useState("")

  // fetch all signatures based on selected document
  async function fetchSignatures() {
    if (documentId !== "") {
      try {
        setLoading(true);
        let url = apiRoutes.getSignatures;
        let options = {
          method: "post",
          headers: {
            Authorization: `Bearer ${localData.refreshToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            documentId
          }),
        };
        let res = await fetch(url, options);
        let result = await res.json();

        setLoading(false);

        if (result && result.error === true) {
          setError(result.message);
          return;
        }
        console.log(result.data);
        setData(result.data);
      } catch (err) {
        setLoading(false);
        setError(err.message);
      }
    }
  }

  useEffect(() => {
    fetchSignatures()
  }, [])

  async function deleteSignature(signature_id, staff_id) {
    if (documentId !== "" && studentId !== "" && staff_id !== "" && signature_id !== "") {
      try {
        setDeleteLoading(true);
        let url = apiRoutes.deleteSignature;
        let options = {
          method: "delete",
          headers: {
            Authorization: `Bearer ${localData.refreshToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            documentId,
            staffId: staff_id,
            studentId,
            signatureId: signature_id
          })
        };
        let res = await fetch(url, options);
        let result = await res.json();

        setDeleteLoading(false);

        if (result && result.error === true) {
          notif.error(result.message);
          return;
        }
        notif.success(result.message);
        setTimeout(() => {
          window.location.reload(true)
        }, 1000);
      } catch (err) {
        setDeleteLoading(false);
        notif.error(err.message);
      }
    }
  }

  // get documentPermission type
  function docPermission(docPermission) {
    switch (docPermission) {
      case 2:
        return "H.O.D"
        break;
      case 4:
        return "Supervisor"
        break
      case 5:
        return "School Officer"
        break
      case 6:
        return "Course Advisor"
        break
      case 7:
        return "External Supervisor"
        break

      default:
        return "Staff"
        break;
    }
  }

  return (
    <div className="doc-signature mt-3 mb-3">
      <div className="head">
        <p>Document Signature <kbd>{data.length}/3</kbd> </p>
      </div>
      <br />
      <table className="signature-tbl">
        <thead>
          <tr>
            <th>Id</th>
            <th>Staff Name</th>
            <th>Type</th>
            <th>Signature Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ?
            <tr> <td>Fetching signatures</td> </tr>
            :
            error !== "" ?
              <tr> <td>{error}</td> </tr>
              :
              data && data.length === 0 ?
                <tr> <td>No signature available</td> </tr>
                :
                data.map((list) => {
                  return (
                    <tr>
                      <td>{list.id.slice(0, 10)}...</td>
                      <td>{list.userName}</td>
                      <td>{docPermission(list.documentPermissions)}</td>
                      <td>
                        <FaCheckCircle className="icon" />
                      </td>
                      <td>
                        {list.staffId === localData.id && <button className="btn del mr-2"
                          data-signature_id={list.id}
                          data-staff_id={list.staffId}
                          onClick={async (e) => {
                            let tgt = e.target.dataset
                            if (Object.entries(tgt).length > 1) {
                              const { signature_id, staff_id } = tgt;
                              await deleteSignature(signature_id, staff_id)
                            }
                          }}
                        >
                          {deletingloading ? "loading.." : "Del"}
                        </button>}
                        <button className="btn view"
                          data-signature={list.image}
                          onClick={(e) => {
                            let tgt = e.target.dataset
                            if (Object.entries(tgt).length > 0) {
                              const { signature } = tgt;
                              setViewImg(true)
                              setImage(signature)
                            }
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  )
                })
          }
        </tbody>
      </table>

      {/* Image View Image */}
      {viewimg && <div className="img-cont" onClick={(e) => {
        if (e.target.classList.contains("img-cont")) {
          setViewImg(false)
        }
      }}>
        <img src={image} alt="signature" className="img" />
      </div>}
    </div>
  )
}

function SignDocument({ setViewSign, documentId, studentId, doctype }) {
  const { localData } = useContext(DataContext);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const canvasRef = useRef()
  const ctxRef = useRef()
  const [isdrawing, setIsdrawing] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")
    ctx.strokeStyle = "black"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctxRef.current = ctx

  }, [])

  function startDrawing(e) {
    setIsdrawing(true)
    const { nativeEvent } = e;
    const { offsetX, offsetY } = nativeEvent
    ctxRef.current.beginPath(0, 0)
    ctxRef.current.moveTo(offsetX, offsetY)
  }

  function finishDrawing() {
    setIsdrawing(false)
    ctxRef.current.closePath()
  }

  function draw(e) {
    if (!isdrawing) return

    const { nativeEvent } = e;
    const { offsetX, offsetY } = nativeEvent
    ctxRef.current.lineTo(offsetX - 20, offsetY - 15)
    ctxRef.current.stroke()
  }

  function clearCanvas() {
    ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
  }

  async function saveSignature() {
    const imageUrl = canvasRef.current.toDataURL()
    if (documentId && studentId) {
      try {
        setLoading(true);
        let url = apiRoutes.addSignature;
        let options = {
          method: "post",
          headers: {
            Authorization: `Bearer ${localData.refreshToken}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            documentId,
            documentType: doctype,
            image: imageUrl,
            staffId: localData.id,
            studentId
          }),
        };
        let res = await fetch(url, options);
        let result = await res.json();

        setLoading(false);

        if (result && result.error === true) {
          setError(result.message);
          notif.error(result.message)
          return;
        }
        notif.success(result.message)
        setTimeout(() => {
          window.location.reload(true)
        }, 1000);
        // setData(result.data);
      } catch (err) {
        setLoading(false);
        setError(err.message);
        notif.error(err.message)
      }
    }

  }

  return (
    <div className="sign-doc">
      <div className="main">
        <canvas
          className="canvas"
          onMouseDown={startDrawing}
          onMouseUp={finishDrawing}
          onMouseMove={draw}
          ref={canvasRef}
        ></canvas>

        <br />
        <div className="action">
          <button className="btn btn-danger" onClick={() => setViewSign(false)}>Close</button>
          <button className="btn btn-info" onClick={clearCanvas}>Clear</button>
          <button className="btn save" onClick={saveSignature}>
            {loading ? "Saving..." : "Save Signature"}
          </button>
        </div>
      </div>
    </div>
  )
}