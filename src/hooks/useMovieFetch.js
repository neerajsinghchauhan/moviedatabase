import { useState, useEffect } from "react";
import API from '../API';

export const useMovieFetch = movieId => {
    const [state, setState] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setErrror] = useState(false);

    useEffect (() => {
       const fetchMovie = async () => {
        try {
            setLoading(true);
            setErrror(false);

            const movie = await API.fetchMovie(movieId);
            const credits = await API.fetchCredits(movieId);
            //Get directions only
            const directors = credits.crew.filter(
                member => member.job === 'Director'
            );

            setState({
                ...movie,
                actors: credits.cast,
                directors
            });

            setLoading(false);

        } catch (error) {
            setErrror(true);
        }
       };

       

       fetchMovie();
    },[movieId]);

    

    return { state, loading, error };
};