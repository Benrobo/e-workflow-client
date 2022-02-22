import React, { useState, useEffect } from 'react'

function useFetch(url, options = { method: "", headers: {}, body: "" }) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [data, setData] = useState("")

    useEffect(() => {
        try {
            if (url === undefined || url === "" || url === null) {
                return setError("useFetch requires a url parameter but got none")
            }
            if (options.headers === undefined || options.headers === "" || options.headers === null) {
                return setError("useFetch requires a headers parameter but got none")
            }
            if (options.method === undefined || options.method === "" || options.method === null) {
                return setError("useFetch requires a method parameter but got none")
            }
            if (options.body === undefined || options.body === "" || options.body === null) {
                return setError("useFetch requires a body parameter but got none")
            }

            (async function makeRequest() {
                setLoading(!loading)
                let req = await fetch(url, options);
                let res = await req.json();

                setLoading(!loading)

                if (req.status !== 200 && res.error === true) {
                    return setError(res.message)
                }

                setError("")
                setData(res);
            })()

        } catch (err) {
            setError(err.message);
            setLoading(false);
            setData([]);
        }

        return () => {
            return { loading, error, data }
        }
    }, [url])
}

export default useFetch