const { default: axios } = require("axios");
const { useState, useMemo, useEffect } = require("react");

const useFetch = (url, method = "GET", options = {}) => {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [refreshIndex, setRefreshIndex] = useState(0)

    const optionString = JSON.stringify(options)
    const requestOption = useMemo(() => {
        const opts = { ...options }
        if (method === 'POST' && !opts.data) {
            opts.data = {}
        }
        return opts
    }, { method, optionString })

    useEffect(() => {
        const apiCall = async () => {
            setLoading(true)
            setError(null)
            try {
                const { data: response } = await axios({
                    url,
                    method,
                    ...(requestOption)
                })

                if (!response.success) {
                    throw new Error(response.message)
                }

                setData(response)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        apiCall()

    }, [requestOption, url, refreshIndex])

    const refetch = () => {
        setRefreshIndex(prev => prev + 1)
    }

    return { data, loading, error, refetch }
}

export default useFetch