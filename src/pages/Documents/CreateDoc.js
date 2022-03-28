import React, { useContext, useEffect, useRef, useState } from 'react'
import MainCont from '../../components/MainCont/MainCont'
import LeftNavbar from '../../components/LeftNavbar'
import Layout from '../../components/Layout/Layout'
import TopNavbar from '../../components/TopNavbar/Top'
import { Notification, Util } from '../../helpers/util'
import "./style.css"
import DataContext from '../../context/DataContext'
import apiRoutes from '../../api_routes'

const notif = new Notification()
const util = new Util()

function CreateDocument() {
    const { localData, fetchUser } = useContext(DataContext)
    const [loading, setLoading] = useState(false)
    const [visibility, setVisibility] = useState(true)
    const [doctype, setDocType] = useState("CF");
    const [title, setTitle] = useState("")
    const [courseadvisor, setCourseAdvisor] = useState("")
    const [schoolofficer, setSchoolOfficer] = useState("")
    const [hod, setHOD] = useState("")
    const [supervisor, setSupervisor] = useState("")
    const [externalsupervisor, setExternalSupervisor] = useState("")
    const [coursetype, setCoursetype] = useState("")
    const [coursename, setCoursename] = useState("")
    const [filedata, setFileData] = useState("")
    const [filetype, setFileType] = useState("")
    const [groupId, setGroupId] = useState("")


    useEffect(() => {
        (async () => {
            let res = await fetchUser();
            const { loading, error, data } = res;
            let user = data[0][0];

            if (user.userId !== localData.id || user.type !== "student") {
                util.redirect("http://localhost:3000/user/settings", 0)
            }
        })()

    }, [])

    // users data
    const [error, setError] = useState("")
    const [usersdata, setUsersData] = useState([]);

    const restStates = {
        title, supervisor, courseadvisor, schoolofficer, externalsupervisor, hod, coursename, coursetype, filedata, filetype, setTitle, setSupervisor, setCourseAdvisor, setSchoolOfficer, setExternalSupervisor, setHOD, setCoursetype, setCoursename, setFileData, setFileType, setGroupId
    }

    // get users data
    useEffect(() => {
        (async () => {
            setLoading(true)
            let url = apiRoutes.getAllUsers;
            const data = {
                method: "post",
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${localData.refreshToken}`
                },
            }

            let req = await fetch(url, data);
            let res = await req.json();

            if (res && res.message && res.error === true) {
                setLoading(false);
                setError(res.message)
                setUsersData([])
                return
            }

            setLoading(false);
            setUsersData(res.data);
            setError("")
        })()

    }, [])


    async function submitDocument() {
        // validate
        if (title === "") {
            return notif.error("document title cant be left empty")
        }
        if (doctype === "CF" && courseadvisor === "") {
            return notif.error("document course advisor cant be left empty")
        }
        if (doctype === "FYP" && supervisor === "") {
            return notif.error("document supervisor cant be left empty")
        }
        if (doctype === "CF" && schoolofficer === "") {
            return notif.error("document school officer cant be left empty")
        }
        if (hod === "") {
            return notif.error("document HOD cant be left empty")
        }
        if (doctype === "FYP" && externalsupervisor === "") {
            return notif.error("document external supervisor cant be left empty")
        }
        if (coursetype === "") {
            return notif.error("document coursetype cant be left empty")
        }
        if (coursename === "") {
            return notif.error("document coursename cant be left empty")
        }
        if (filedata === "") {
            return notif.error("document file cant be left empty")
        }
        if (filetype === "") {
            return notif.error("document filetype cant be left empty")
        }
        // this would only run when the doctype is FYP
        if (doctype === "FYP" && groupId === "") {
            return notif.error("document groupId cant be left empty")
        }

        let sendPayload;

        if (doctype === "CF") {
            sendPayload = {
                userId: localData.id,
                title,
                documentType: doctype,
                courseName: coursename,
                courseType: coursetype,
                schoolOfficer: schoolofficer,
                courseAdvisor: courseadvisor,
                HOD: hod,
                file: {
                    type: filetype,
                    data: filedata
                }
            }
        }

        if (doctype === "FYP") {
            sendPayload = {
                userId: localData.id,
                groupId,
                title,
                documentType: doctype,
                courseName: coursename,
                courseType: coursetype,
                supervisor: supervisor,
                externalSupervisor: externalsupervisor,
                HOD: hod,
                file: {
                    type: filetype,
                    data: filedata
                }
            }
        }

        try {
            setLoading(true)
            let url = apiRoutes.addDocument;
            let options = {
                method: "post",
                headers: {
                    "Authorization": `Bearer ${localData.refreshToken}`,
                    "content-type": "application/json"
                },
                body: JSON.stringify(sendPayload)
            }
            let res = await fetch(url, options);
            let result = await res.json();

            setLoading(false)

            if (result && result.error === true) {
                return notif.error(result.message)
            }

            return notif.success(result.message);
        } catch (err) {
            console.log(err);
            setLoading(false)
            return notif.error(err.message)
        }
    }

    return (
        <Layout>
            <LeftNavbar active="addDocument" />
            <MainCont>
                <TopNavbar activeBar="Submit Document" />

                {visibility && <div className="options-cont">
                    <div className="bx">
                        <p>Final Year Project</p>
                        <button className="btn fyp-btn" onClick={() => {
                            setVisibility(false);
                            setDocType("FYP")
                        }}>Submit FYP</button>
                    </div>
                    <div className="bx">
                        <p>Course Form</p>
                        <button className="btn cf-btn" onClick={() => {
                            setVisibility(false);
                            setDocType("CF")
                        }}>Submit CF</button>
                    </div>
                </div>}

                {(doctype === "FYP" && visibility === false) && <FinalYearProject setVisibility={setVisibility} setDocType={setDocType} restStates={restStates} submitDocument={submitDocument} loading={loading} usersdata={usersdata} error={error} localData={localData} />}
                {(doctype === "CF" && visibility === false) && <CourseForm setVisibility={setVisibility} setDocType={setDocType} restStates={restStates} submitDocument={submitDocument} loading={loading} usersdata={usersdata} error={error} />}

            </MainCont>
        </Layout>
    )
}

export default CreateDocument

function CourseForm({ setVisibility, setDocType, restStates, submitDocument, loading, usersdata, error }) {
    const [filename, setFilename] = useState("")
    const [filetype, setFiletype] = useState("");
    const [valid, setValid] = useState(null)

    console.log(usersdata);

    const fileRef = useRef()

    const validType = ["pdf"]

    function handleFile(e) {
        let filedata = e.target.files[0];
        const fileType = filedata.type.split("/")[1];
        setFiletype(fileType)
        restStates.setFileType(fileType)
        setFilename(filedata.name)
        if (!validType.includes(fileType)) {
            setValid(false)
            return notif.error("file type is invalid")
        }
        setValid(true)
        let reader = new FileReader()

        reader.readAsDataURL(filedata)
        reader.onload = (e) => {
            let result = e.target.result;
            restStates.setFileData(result)
        }
    }

    let courseAdvisor = usersdata.filter((users, i) => users.documentPermissions === 6)
    let schoolOfficers = usersdata.filter((users, i) => users.documentPermissions === 5)
    let HOD = usersdata.filter((users, i) => users.documentPermissions === 2)

    // console.log(courseAdvisor, schoolOfficers, HOD);

    return (
        <div className="doc-cont">
            <div className="head">
                <label htmlFor="">Submit course form.</label>
                <hr />
            </div>
            <div className="d-flex">
                <div className="bx">
                    <label htmlFor="">Title</label>
                    <input type="text" defaultValue={restStates.title} onChange={(e) => restStates.setTitle(e.target.value)} placeholder='some dummy title' className="input" />
                </div>
                <div className="bx">
                    <label htmlFor="">Course Type</label>
                    <input type="text" defaultValue={restStates.coursetype} onChange={(e) => restStates.setCoursetype(e.target.value)} placeholder='Computer Science' className="input" />
                </div>
            </div>
            <div className="d-flex">
                <div className="bx">
                    <label htmlFor="">Course Name</label>
                    <input type="text" defaultValue={restStates.coursename} onChange={(e) => restStates.setCoursename(e.target.value)} placeholder='Computer Science' className="input" />
                </div>
                <div className="bx">
                    <label htmlFor="">School Officers</label>
                    <select className="select" onChange={(e) => restStates.setSchoolOfficer(e.target.value)}>
                        <option value="">----</option>
                        {
                            loading === true ?
                                "fetching school officers..."
                                :
                                error !== "" ?
                                    <option value="">{error}</option>
                                    :
                                    schoolOfficers.length === 0 ?
                                        <option value="">No course advisor available</option>
                                        :
                                        schoolOfficers.map((users) => {
                                            if (users.type === "staff" && users.type !== "student") {
                                                return (<option value={users.userId}>{users.userName} ({users.type})</option>)
                                            }
                                        })

                        }
                    </select>
                </div>
                <div className="bx">
                    <label htmlFor="">Course Advisor</label>
                    <select className="select" onChange={(e) => restStates.setCourseAdvisor(e.target.value)}>
                        <option value="">----</option>
                        {
                            loading === true ?
                                "fetching supervisors..."
                                :
                                error !== "" ?
                                    <option value="">{error}</option>
                                    :
                                    courseAdvisor.length === 0 ?
                                        <option value="">No course advisor available</option>
                                        :
                                        courseAdvisor.map((users) => {
                                            if (users.type === "staff" && users.type !== "student") {
                                                return (<option value={users.userId}>{users.userName} ({users.type})</option>)
                                            }
                                        })

                        }
                    </select>
                </div>
                <div className="bx">
                    <label htmlFor="">HOD's</label>
                    <select className="select" onChange={(e) => restStates.setHOD(e.target.value)}>
                        <option value="">----</option>
                        {
                            loading === true ?
                                "fetching HOD's..."
                                :
                                error !== "" ?
                                    <option value="">{error}</option>
                                    :
                                    HOD.length === 0 ?
                                        <option value="">No HOD available</option>
                                        :
                                        HOD.map((users) => {
                                            if (users.type === "staff" && users.type !== "student") {
                                                return (<option value={users.userId}>{users.userName} ({users.type})</option>)
                                            }
                                        })

                        }
                    </select>
                </div>
            </div>
            <div className="file-cont">
                <div className="left">
                    <label htmlFor="">{filename === "" ? "file name" : filename.split("").splice(0, 20)}...</label>
                    <button className="file btn" onClick={() => {
                        fileRef.current.click()
                    }}>Upload File</button>
                    <input type="file" ref={fileRef} onChange={(e) => {
                        handleFile(e)
                    }} hidden />
                </div>
                <div className="right">
                    <br />
                    <div className={valid === null ? "file-type" : valid === true ? "file-type valid" : "file-type invalid"}>.{filetype === "" ? "pdf" : filetype}</div>
                </div>
            </div>
            <br />
            <div className="action-cont">
                <button className="btn cancel" onClick={() => {
                    setVisibility(true);
                    setDocType("")
                }}>Cancel</button>
                <button className="btn submit" onClick={async () => {
                    await submitDocument()
                }}>{loading ? "Submitting..." : "Submit Doc"}</button>
            </div>
        </div>
    )
}

function FinalYearProject({ setVisibility, setDocType, restStates, submitDocument, loading, usersdata, error, localData }) {
    const [filename, setFilename] = useState("")
    const [filetype, setFiletype] = useState("");
    const [valid, setValid] = useState(null)
    const [grouploading, setGroupLoading] = useState(false);
    // groups data
    const [gloading, setGloading] = useState(false)
    const [gerror, setGError] = useState("")
    const [groupdata, setGroupData] = useState([]);

    const fileRef = useRef()

    const validType = ["pdf"]

    function handleFile(e) {
        let filedata = e.target.files[0];
        const fileType = filedata.type.split("/")[1];
        setFiletype(fileType)
        restStates.setFileType(fileType)
        setFilename(filedata.name)
        if (!validType.includes(fileType)) {
            setValid(false)
            return notif.error("file type is invalid")
        }
        setValid(true)
        let reader = new FileReader()

        reader.readAsDataURL(filedata)
        reader.onload = (e) => {
            let result = e.target.result;
            restStates.setFileData(result)
        }
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

    // fetch groups data
    useEffect(() => {
        getGroups()
    }, [])

    let supervisor = usersdata.filter((users, i) => users.documentPermissions === 4)
    let externalSupervisor = usersdata.filter((users, i) => users.documentPermissions === 7)
    let HOD = usersdata.filter((users, i) => users.documentPermissions === 2)

    return (
        <div className="doc-cont">
            <div className="head">
                <label htmlFor="">Submit final year project</label>
                <hr />
            </div>
            <div className="d-flex">
                <div className="bx">
                    <label htmlFor="">Title</label>
                    <input type="text" defaultValue={restStates.title} onChange={(e) => restStates.setTitle(e.target.value)} placeholder='some dummy title' className="input" />
                </div>
                <div className="bx">
                    <label htmlFor="">Course Type</label>
                    <input type="text" defaultValue={restStates.coursetype} onChange={(e) => restStates.setCoursetype(e.target.value)} placeholder='Computer Science' className="input" />
                </div>
            </div>
            <div className="d-flex">
                <div className="bx">
                    <label htmlFor="">Course Name</label>
                    <input type="text" defaultValue={restStates.coursename} onChange={(e) => restStates.setCoursename(e.target.value)} placeholder='Computer Science' className="input" />
                </div>
                <div className="bx">
                    <label htmlFor="">External Supervisors</label>
                    <select className="select" onChange={(e) => restStates.setExternalSupervisor(e.target.value)}>
                        <option value="">----</option>
                        {
                            loading === true ?
                                "fetching..."
                                :
                                error !== "" ?
                                    <option value="">{error}</option>
                                    :
                                    externalSupervisor.length === 0 ?
                                        <option value="">No external supervisors available</option>
                                        :
                                        externalSupervisor.map((users) => {
                                            if (users.type === "staff" && users.type !== "student") {
                                                return (<option value={users.userId}>{users.userName} ({users.type})</option>)
                                            }
                                        })

                        }
                    </select>
                </div>
                <div className="bx">
                    <label htmlFor="">Supervisor</label>
                    <select className="select" onChange={(e) => restStates.setSupervisor(e.target.value)}>
                        <option value="">----</option>
                        {
                            loading === true ?
                                "fetching supervisors..."
                                :
                                error !== "" ?
                                    <option value="">{error}</option>
                                    :
                                    supervisor.length === 0 ?
                                        <option value="">No supervisor available</option>
                                        :
                                        supervisor.map((users) => {
                                            if (users.type === "staff" && users.type !== "student") {
                                                return (<option value={users.userId}>{users.userName} ({users.type})</option>)
                                            }
                                        })

                        }
                    </select>
                </div>
                <div className="bx">
                    <label htmlFor="">HOD's</label>
                    <select className="select" onChange={(e) => restStates.setHOD(e.target.value)}>
                        <option value="">----</option>
                        {
                            loading === true ?
                                "fetching HOD's..."
                                :
                                error !== "" ?
                                    <option value="">{error}</option>
                                    :
                                    HOD.length === 0 ?
                                        <option value="">No HOD available</option>
                                        :
                                        HOD.map((users) => {
                                            if (users.type === "staff" && users.type !== "student") {
                                                return (<option value={users.userId}>{users.userName} ({users.type})</option>)
                                            }
                                        })

                        }
                    </select>
                </div>
            </div>
            <div className="file-cont">
                <div className="left">
                    <label htmlFor="">Group Name</label>
                    <select name="" id="" onChange={(e) => restStates.setGroupId(e.target.value)} className="select">
                        <option value="">-- select group --</option>
                        {
                            grouploading ?
                                <option value="">fetching group...</option>
                                :
                                groupdata && groupdata.length === 0 ?
                                    <option value="">No group available.</option>
                                    :
                                    groupdata.map((g) => {
                                        return (
                                            <option value={g.id} key={g.id}>{g.name} ({g.courseName})</option>
                                        )
                                    })
                        }
                    </select>
                    <br />
                    <label htmlFor="">{filename === "" ? "file name" : filename.split("").splice(0, 20)}...</label>
                    <button className="file btn" onClick={() => {
                        fileRef.current.click()
                    }}>Upload File</button>
                    <input type="file" ref={fileRef} onChange={(e) => {
                        handleFile(e)
                    }} hidden />
                </div>
                <div className="right">
                    <br />
                    <div className={valid === null ? "file-type" : valid === true ? "file-type valid" : "file-type invalid"}>.{filetype === "" ? "pdf" : filetype}</div>
                </div>
            </div>
            <br />
            <div className="action-cont">
                <button className="btn cancel" onClick={() => {
                    setVisibility(true);
                    setDocType("")
                }}>Cancel</button>
                <button className="btn submit" onClick={async () => {
                    await submitDocument()
                }}>{loading ? "Submitting..." : "Submit Doc"}</button>
            </div>
        </div>
    )
}