import React, { Component } from 'react';
import './App.css';

// Services
import Recommender from './recommender';

// CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

// Components
// import Navbar from './components/Navbar';
import MovieContainer from './components/MovieContainer';
import Movie from './components/Movie';
import SearchForm from './components/SearchForm';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allTimePopularMovies: [],
      contentBased: [],
      searchResults: [],
      searchQuery: "",
      isLoading: true
    }

    // Bind functions
    this.loadRecommendations = this.loadRecommendations.bind(this);
    this.loadPoster = this.loadPoster.bind(this);
    this.handleSearchBox = this.handleSearchBox.bind(this);
  }

  loadRecommendations() {
    Recommender.getRecommendations().then(movies => {
      this.setState({
        allTimePopularMovies: movies["all-time-popular"],
        contentBased: movies["content-based"] ? movies["content-based"] : [],
        searchResults: [],
        searchQuery: "",
        isLoading: false
      });

      this.state.allTimePopularMovies.forEach(movie => {
        this.loadPoster(movie.id)
      });

      this.state.contentBased.forEach(recommender => {
        recommender.recommended.forEach(movie => {
          this.loadPoster(movie.id)
        });
      });
    });
  }

  loadPoster(tmdbId) {
    Recommender.getPosterUrl(tmdbId).then(url => this.setState({ [tmdbId]: url }));
  }

  componentDidMount() {
    this.loadRecommendations()
  }

  handleSearchBox(searchQuery) {
    if (searchQuery === "") { this.loadRecommendations(); return; }

    this.setState({ isLoading: true });
    Recommender.searchByTitle(searchQuery).then(searchResults => {
      this.setState({ searchResults, searchQuery, isLoading: false });
      this.state.searchResults.forEach(movie => {
        this.loadPoster(movie.id);
      });
    });
  }

  render() {
    console.log(this.state);
    return (
      <div className="root">
        {/* <Navbar/> */}
        <SearchForm onClick={this.handleSearchBox}/>
        <div className="container">
          { this.state.isLoading ?
            <div style={{textAlign: "center"}}>
              <h3>Loading...</h3>
            </div>
          : null}   

          {/* TODO: Show the highest rated show */}
          { this.state.contentBased.length > 0 && this.state.searchResults.length === 0 && !this.state.isLoading ?
            this.state.contentBased.map(recommendedBy => {
              return <MovieContainer title={`Because you liked ${recommendedBy.title}`}>
                {
                  recommendedBy.recommended.map(movie => {
                    return <Movie
                      key={movie.id}
                      id={movie.id}
                      artwork={this.state[movie.id] ? this.state[movie.id] : null}
                      title={movie.title}
                    />
                  })
                }
              </MovieContainer>
            })
          : null }

          { this.state.searchResults.length > 0  && !this.state.isLoading ?
            <MovieContainer title={`Search results for "${this.state.searchQuery}"`}>
              { this.state.searchResults.map(movie => {
                  return <Movie 
                    key={movie.id}
                    id={movie.id}
                    artwork={this.state[movie.id] ? this.state[movie.id] : null}
                    title={movie.title}
                  />
                })
              }
            </MovieContainer>
          : null }

          { this.state.searchResults.length === 0 && !this.state.isLoading ?
            <MovieContainer title="All-time Popular">
              { this.state.allTimePopularMovies.length > 0 ?
                this.state.allTimePopularMovies.map(movie => {
                  return <Movie 
                    key={movie.id}
                    id={movie.id}
                    artwork={this.state[movie.id] ? this.state[movie.id] : null}
                    title={movie.title}
                  />
                })
              : null }
            </MovieContainer>
          : null }
        </div>
      </div>
    );
  }
}


export default App;
