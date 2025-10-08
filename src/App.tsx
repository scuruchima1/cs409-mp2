import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import Layout from './pages/layout';
import SearchPage from './pages/searchPage';
import GalleryPage from './pages/galleryPage';
import PokemonInfo from './components/pokemonInfo';

function App() {
  return (
    <div className="App">
      <Router basename="/cs409-mp2">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Navigate to="search" />} />
            <Route path="search" element={<SearchPage />}/>
            <Route path="gallery" element={<GalleryPage />} />
            <Route path="pokemon/:id" element={<PokemonInfo />}/>
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
