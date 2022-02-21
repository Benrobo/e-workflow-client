import React, { useState, useEffect } from 'react'

function Request(url, options) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [data, setData] = useState("")

    return [loading, error, data];

    useEffect(() => {
        try {
            if (url === undefined || url === "" || url === null) {
                return setError("Request requires a url parameter but got none")
            }
            if (options.header === undefined || options.header === "" || options.header === null) {
                return setError("Request requires a header parameter but got none")
            }
            if (options.method === undefined || options.method === "" || options.method === null) {
                return setError("Request requires a method parameter but got none")
            }
            if (options.body === undefined || options.body === "" || options.body === null) {
                return setError("Request requires a body parameter but got none")
            }

            async function makeRequest() {
                setLoading(!loading)
                let req = await fetch(url, options);
                let res = await req.json();

                setLoading(!loading)

                if (req.status !== 200 && res.error === true) {
                    return setError(res.message)
                }

                setError("")
                setData(res);
            }

            makeRequest()

            return [loading, error, data];
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setData([]);
            return [loading, error, data];
        }
    }, [loading, error])
}

export default Request