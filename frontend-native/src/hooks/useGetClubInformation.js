import { useState, useEffect } from 'react';
const useGetClubInformation = (url) => {
    const [clubInfo, setClubInfo] = useState();
    const [loading, setLoading] = useState(false);
    const club_url = new URL(url);
    const club_path = club_url.pathname;
    const base_api_url = "https://clubclubgo.website";
    const api_url = base_api_url + club_path;

    const fetchClubInfo = async () => {
        setLoading(true);

        try {
            // const url = 'https://d7ea-138-51-92-56.ngrok-free.app/upcoming'
            const response = await fetch(api_url, {
                method: "GET",
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