import React, { useState, useEffect } from 'react'

function useFetch(url, options = { method: "", headers: {}, body: "" }) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [result, setResult] = useState([])

    useEffect(() => {
        try {
            (async function makeRequest() {
                setLoading(true)
                let req = await fetch(url, options);
                let res = await req.json();

                setLoading(false)

                if (req.status !== 200 && res.error === true) {
                    setLoading(false)
                    return setError(res.message)
                }
                setError("")
                setResult(res);
            })()
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setResult([]);
        }
    }, [url])

    return { loading, error, result }
}

export default useFetch