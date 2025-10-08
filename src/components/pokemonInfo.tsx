import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pokeapi from "../api/pokeapi";
import './pokemonInfo.css'

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

interface PokemonTypeListResponse {
    results: {
        name: string;
        url: string;
    }[];
}

function title(val: string | undefined) {
    if (val == null) {
        return "";
    }
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function PokemonInfo() {
    const navigate = useNavigate();
    const {id} = useParams<{ id: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [pokemonTypeListResponse, setPokemonTypes] = useState<PokemonTypeListResponse>()

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
  });

  useEffect(() => {
    async function getPokemon() {
      try {
        const res = await pokeapi.get<Pokemon>(`/pokemon/${id}`);
        const results = res.data;
        setPokemon(results);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
      }
    }

    if (id) getPokemon();
  }, [id]);

  return (
    <div className="pokemon-page">
        <div className="card-container">
            <button className="nav-button" onClick={() => navigate(`/pokemon/${pokemon?.id! - 1}`)} disabled={pokemon?.id! <= 1}>&lt;</button>
            <div className="pokemon-card">
                <h1>{title(pokemon?.name)}</h1>
                <img src={pokemon?.sprites.front_default} alt={pokemon?.name} className="pokemon-sprite"/>
                <div>
                    <p>Species: {title(pokemon?.species.name)}</p>
                    <p>Height: {pokemon?.height}</p>
                    <p>Weight: {pokemon?.weight}</p>
                    <p>Base Experience: {pokemon?.base_experience}</p>
                </div>
            </div>
            <button className="nav-button" onClick={() => navigate(`/pokemon/${pokemon?.id! + 1}`)} disabled={pokemon?.id! >= 1000}> &gt;</button>
        </div>
    </div>
  );
}

export default PokemonInfo;
