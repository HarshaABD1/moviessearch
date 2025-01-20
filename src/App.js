import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [randomMovies, setRandomMovies] = useState([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?s=action&apikey=277026cd`);
        if (response.data.Response === 'True') {
          setRandomMovies(response.data.Search.slice(0, 4));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRandomMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % randomMovies.length);
    }, 1000);
    return () => clearInterval(interval);
  }, [randomMovies]);

  const fetchMovies = async () => {
    if (!searchTerm) return;
    setSearching(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchTerm}&apikey=277026cd`
      );
      if (response.data.Response === 'True') {
        setMovies(response.data.Search);
        setError('');
      } else {
        setMovies([]);
        setError(response.data.Error);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again later.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Movie Search</h1>
        <p>Discover your favorite movies and shows</p>
      </header>

      <main className="app-main">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="search-input"
            />
            <button onClick={fetchMovies} className="search-button">
              Search
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <div className="suggested-movies-section">
            <h2 className="section-title">{searching ? 'Search Results' : 'Suggested Movies'}</h2>
            <div className="movies-grid">
              {(movies.length > 0 ? movies : randomMovies).map((movie) => (
                <div key={movie.imdbID} className="movie-card">
                  <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
                    alt={movie.Title}
                    className="movie-poster"
                  />
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.Title}</h3>
                    <p className="movie-year">Year: {movie.Year}</p>
                    <p className="movie-plot">
                      {movie.Plot ? movie.Plot : 'Plot information is unavailable.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
