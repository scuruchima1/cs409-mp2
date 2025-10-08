import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pokeapi from "../api/pokeapi";
import './pokemonSearch.css'

interface Pokemon {
    name: string;
    id: number;
    species: {
        name: string;
    }
    base_experience: number;
    height: number;
    weight: number;
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

interface SearchItemProp {
  name: string;
  id: number;
  exp: number;
  weight: number;
  height: number;
  imageSrc: string;
}


function title(val: string | undefined) {
    if (val == null) {
        return "";
    }
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


const SearchItem = ({ name, id, exp, weight, height, imageSrc }: SearchItemProp) => {
  const navigate = useNavigate();
  return  (
    <button className="search-item" onClick={() => navigate(`/pokemon/${id}`)}>
      <div>
        <div className="poke-info">
          <p className="search-text">{title(name)}</p>
          <p>ID: {id}</p>
        </div>
        <div className="poke-info-details">
          <p>Weight: {weight}</p>
          <p>Height: {height}</p>
          <p>Base Experience: {exp}</p>   
        </div>     
      </div>
        <img src={imageSrc} alt={name} className="search-sprite"/>
    </button>
  )
};

function PokemonSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"name" | "id">("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
    const [filtered, setFiltered] = useState<Pokemon[]>([]);

    useEffect(() => {
        async function loadAll() {
            try {
                const res = await pokeapi.get<PokemonListResponse>("/pokemon?limit=10000");
                const detailed = await Promise.all(
                    res.data.results.map(async (p) => {
                    const detail = await pokeapi.get<Pokemon>(`/pokemon/${p.name}`);
                    return detail.data;
                    })
                );
                setAllPokemon(detailed);
            } catch (err) {
                console.error("Error fetching Pokémon:", err);
            }
        }
        loadAll();
    }, []);

useEffect(() => {
    if (searchTerm.trim() === "") {
      setFiltered([]);
      return;
    }

    const lower = searchTerm.toLowerCase();
    let matches = allPokemon.filter(
      (p) => p.name.includes(lower) || String(p.id).includes(lower)
    );

    matches.sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === "asc" ? a.id - b.id : b.id - a.id;
      }
    });

    setFiltered(matches);
  }, [searchTerm, sortBy, sortOrder, allPokemon]);

  return (
    <div className="search-view">
        <div className="search-components">
            <p>Search:</p>
            <input type="text" placeholder="Search Pokemon" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
            <p>Sort By:</p>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as "name" | "id")}>
                <option value="name">Name</option>
                <option value="id">ID</option>
            </select>
            <div className="search-order">
                <button className={`search-order-btn ${sortOrder === "asc" ? "active" : ""}`} onClick={() => setSortOrder("asc")}>Ascending</button>
                <button className={`search-order-btn ${sortOrder === "desc" ? "active" : ""}`} onClick={() => setSortOrder("desc")}>Descending</button>
            </div>
        </div>
        <search>
        <form>
            {filtered.map((p) => (
            <SearchItem
              key={p.id}
              name={p.name} id={p.id} weight={p.weight} height={p.height} exp={p.base_experience} imageSrc={p.sprites.front_default}
            />
          ))}
        </form>
        </search>
    </div>
  );
}

export default PokemonSearch;
