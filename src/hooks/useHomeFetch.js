import { useState, useEffect } from "react";
//API
import API from '../API';
import { isPersistedState } from "../helpers";

const initialState = {
    page: 0,
    results: [],
    total_pages: 0,
    total_results: 0
};

export const useHomeFetch = () => {
  const[searchTerm, setSearchTerm] = useState('');
  const[state, setState] = useState(initialState);
  const[loading, setLoading] = useState(false);
  const[error, setErrror] = useState(false);
  const[isLoadingMore, setIsLoadingMore] = useState(false);

  console.log(searchTerm)

  const fetchMovies = async (page, searchTerm = "") => {
      try {
          setErrror(false);
          setLoading(true);

          const movies = await API.fetchMovies(searchTerm, page);
          

          setState(prev =>({
              ...movies,
              results:
                page > 1 ? [...prev.results, ...movies.results] : [...movies.results]
          }));

  } catch(error) {
      setErrror(true);
  }
  setLoading(false);
  };
  //initial render
  useEffect(() => {
     fetchMovies(1, );

 }, []);

  //search
  useEffect(() => {
     if (!searchTerm) {
        const sessionState = isPersistedState('homeState')

        if (sessionState) {
            console.log('Grabbing from session Storage');
            setState(sessionState);
            return;
        }
     }
     console.log('Grabbing from API');

     setState(initialState);
     fetchMovies(1, searchTerm);

  }, [searchTerm]);

  //Load More
  useEffect (() => {
     if(!isLoadingMore) return;

     fetchMovies(state.page + 1, searchTerm);
     setIsLoadingMore(false);
  },[isLoadingMore, searchTerm, state.page]);

   //Write to session storage
  useEffect (() => {
     if (!searchTerm) sessionStorage.setItem('homeState', JSON.stringify(state));
  },[searchTerm, state]);

  return { state, loading, error, setSearchTerm, searchTerm, setIsLoadingMore};

};