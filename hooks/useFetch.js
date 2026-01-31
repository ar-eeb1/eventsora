import axios from "axios";
import { useState, useMemo, useEffect, useRef } from "react";

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
    }, [method, optionString])

    // Use a ref to track if component is mounted
    const isMounted = useRef(true)

    useEffect(() => {
        isMounted.current = true
        return () => {
            isMounted.current = false
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController(); // Create controller

        const timeoutId = setTimeout(() => {
            const apiCall = async () => {
                setLoading(true)
                setError(null)
                try {
                    console.log('Fetching:', url) // DEBUG LOG
                    const { data: response } = await axios({
                        url,
                        method,
                        ...requestOption,
                        signal: controller.signal // Pass signal
                    })

                    if (isMounted.current) {
                        if (!response.success) {
                            throw new Error(response.message)
                        }
                        setData(response)
                    }
                } catch (error) {
                    if (axios.isCancel(error)) {
                    } else if (isMounted.current) {
                        setError(error.message)
                    }
                } finally {
                    if (isMounted.current) {
                        setLoading(false)
                    }
                }
            }
            apiCall()
        }, 100) // Debounce delay 100ms

        return () => {
            clearTimeout(timeoutId) // Clear timeout on cleanup (prevents request if unmounted quickly)
            controller.abort() // Cancel request on cleanup
        }

    }, [requestOption, url, refreshIndex])

    const refetch = () => {
        setRefreshIndex(prev => prev + 1)
    }

    return { data, loading, error, refetch }
}

export default useFetch