import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pokeapi from "../api/pokeapi"; 
import './gallery.css'


interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  }
}

interface PokemonListResponse {
  results: {
    name: string;
    url: string;
  }[];
}

// Props for GalleryItem
interface GalleryItemProp {
  name: string;
  id: number;
  imageSrc: string;
}


function capitalizeFirstLetter(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const GalleryItem = ({ name, id, imageSrc }: GalleryItemProp) => {
  const navigate = useNavigate();
  return  (
    <button className="gallery-item" onClick={() => navigate(`/pokemon/${id}`)}>
      <img src={imageSrc} className="gallery-item-sprite"/>
      <p>{capitalizeFirstLetter(name)}</p>
    </button>
  )
};

function Gallery() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPokemonSprites() {
      try {
        const res = await pokeapi.get<PokemonListResponse>("/pokemon?limit=150"); // start with 151 for speed
        // const data = await res.json();/

        // Fetch details (including sprites)
        const detailed = await Promise.all(
          res.data.results.map(async (p) => {
            const detailRes = await pokeapi.get<Pokemon>(`/pokemon/${p.name}`);
            const detail = detailRes.data;
            return detail;
          })
        );

        setPokemonList(detailed);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
      } finally {
        setLoading(false);
      }
    }

    getPokemonSprites();
  }, []);

  return (
    <div>
      <div className="gallery-view">
        {pokemonList.map((p) => (
          <GalleryItem id={p.id} name={p.name} imageSrc={p.sprites.front_default}/>
        ))}
      </div>
    </div>
  );
}




export default Gallery;
