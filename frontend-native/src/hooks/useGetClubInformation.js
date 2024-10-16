import { useState, useEffect } from 'react';
const useGetClubInformation = (url) => {
    const [clubInfo, setClubInfo] = useState();
    const [loading, setLoading] = useState(false);

    const fetchClubInfo = async () => {
        setLoading(true);

        try {
            // const url = 'https://d7ea-138-51-92-56.ngrok-free.app/upcoming'
            const response = await fetch(url, {
                method: "GET",
                headers: new Headers({
                    "ngrok-skip-browser-warning": "25"
                })
            });
            const json = await response.json();

            setLoading(false);
            setClubInfo(json);
            // console.log(json)
        } catch (error) {
            console.error(error.message)
        }

    };

    useEffect(() => {
        fetchClubInfo();
    }, []);

    return { clubInfo, loading, refetch: fetchClubInfo };
};

export default useGetClubInformation;