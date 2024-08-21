import { useState, useEffect } from 'react';
const useGetRecentlyAddedEvents = () => {
    const [recentlyAddedEvents, setRecentlyAddedEvents] = useState();
    const [loading, setLoading] = useState(false);

    const fetchRecentlyAddedEvents = async () => {
        setLoading(true);

        try {
            const url = 'http://3.139.60.94:8000/new'
            const response = await fetch(url, {
                method: "GET",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "25"
                })
            });
            const json = await response.json();

            setLoading(false);
            setRecentlyAddedEvents(json.slice(0, 3));
        } catch (error) {
            console.error(error.message)
        }

    };

    useEffect(() => {
        fetchRecentlyAddedEvents();
    }, []);

    return { recentlyAddedEvents, loading, refetch: fetchRecentlyAddedEvents };
};

export default useGetRecentlyAddedEvents;