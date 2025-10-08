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

interface PokemonTypeListResponse {
    results: {
        name: string;
        url: string;
    }[];
}

interface PokemonByTypeResponse {
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
  }[];
}

interface GalleryItemProp {
  name: string;
  id: number;
  imageSrc: string;
}


function title(val: string) {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

const GalleryItem = ({ name, id, imageSrc }: GalleryItemProp) => {
  const navigate = useNavigate();
  return  (
    <button className="gallery-item" onClick={() => navigate(`/pokemon/${id}`)}>
      <img src={imageSrc} alt={name} className="gallery-item-sprite"/>
      <p>{title(name)}</p>
    </button>
  )
};

function Gallery() {
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [pokemonTypeListResponse, setPokemonTypes] = useState<PokemonTypeListResponse>()
  const [selectedType, setSelectedType] = useState<string>("all");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getPokemonTypes() {
      try {
        const res = await pokeapi.get<PokemonTypeListResponse>(`/type`);
        const results = res.data;
        setPokemonTypes(results);
      } catch (err) {
        console.error("Error fetching Pokémon Types:", err);
      }
    }

    getPokemonTypes()
  }, []);

    // Fetch Pokémon list (filtered)
  useEffect(() => {
    async function getPokemon() {
      setLoading(true);
      try {
        let urls: string[] = [];

        if (selectedType === "all") {
          const res = await pokeapi.get<PokemonListResponse>("/pokemon?limit=150");
          urls = res.data.results.map((p) => p.name);
        } else {
          const res = await pokeapi.get<PokemonByTypeResponse>(`/type/${selectedType}`);
          urls = res.data.pokemon.map((p) => p.pokemon.name);
        }

        const detailed = await Promise.all(
          urls.map(async (name) => {
            const detailRes = await pokeapi.get<Pokemon>(`/pokemon/${name}`);
            return detailRes.data;
          })
        );

        setPokemonList(detailed);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
      } finally {
        setLoading(false);
      }
    }

    getPokemon();
  }, [selectedType]);

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
      }
    }

    getPokemonSprites();
  }, []);

  return (
    <div>
      <div className="gallery-view">
        <div className="gallery-filters">
          <button key="all" className={`filter-button ${selectedType === "all" ? "active" : ""}`}
              onClick={() => setSelectedType("all")}>All</button>
          {pokemonTypeListResponse?.results.map((t) => (
          <button key={t.name} className={`filter-button ${selectedType === t.name ? "active" : ""}`}
              onClick={() => setSelectedType(t.name)}>{title(t.name)}</button>
          ))}
        </div> 
        <div className="gallery-items">
          {pokemonList.map((p) => (
          <GalleryItem id={p.id} name={p.name} imageSrc={p.sprites.front_default}/>
          ))}
        </div>
      </div>
    </div>
  );
}




export default Gallery;
