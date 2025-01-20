import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const response = await axios.get(`https://www.omdbapi.com/?s=action&apikey=277026cd`);
        if (response.data.Response === 'True') {
          setMovies(response.data.Search);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchRandomMovies();
  }, []);

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
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {movies.length > 0 && movies.map((movie) => (
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

      <footer className="app-footer">
        <p>&copy; 2025 Movie Search. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
