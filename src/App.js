import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";

function App() {
  // Handling data fetching states
  const [loadedResults, isLoadingResults] = useState([]);
  // Handling loading state of the data
  const [isLoading, setIsLoading] = useState(false);
  //error state
  const [error, setError] = useState(null);
  // 
  const isLoadingHandler = () => {
    setIsLoading(true);
  };
  //Error handling
  const setErrorHandler = () => {
    setError(null);
  };
  const fetchMoviesHandler = useCallback(async () => {
    try {
      isLoadingHandler();
      setErrorHandler();
      const fetchResult = await fetch(
        `https://test-project-43cf1-default-rtdb.firebaseio.com/movies.json`
      );
      if (!fetchResult.ok) {
        throw new Error("Something went wrong");
      }
      const data = await fetchResult.json();
      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }

      isLoadingResults(loadedMovies);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
    }
    //This ensures the app doesnt load after an error
    setIsLoading(false);
  }, []);

  // Using use effect for managing requests
  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);
  //Add movie Handler
  async function addMovieHandler(movie) {
    try {
      const response = await fetch(
        "https://test-project-43cf1-default-rtdb.firebaseio.com/movies.json",
        {
          method: "POST",
          body: JSON.stringify(movie),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (err) {
      alert(err.message);
    }
  }

  //

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {!isLoading ? <MoviesList movies={loadedResults} /> : "Loading..."}
        {!isLoading && error && <p>{error}</p>}
        {!isLoading &&
          loadedResults.length === 0 &&
          !error &&
          " No item found..."}
      </section>
    </React.Fragment>
  );
}

export default App;
