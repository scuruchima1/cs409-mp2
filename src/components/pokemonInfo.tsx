import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pokeapi from "../api/pokeapi";
import './pokemonInfo.css'

interface Pokemon {
    name: string;
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

function title(val: string | undefined) {
    if (val == null) {
        return "";
    }
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function PokemonInfo() {
    const {id} = useParams<{ id: string }>();
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getPokemon() {
      try {

        const res = await pokeapi.get<Pokemon>(`/pokemon/${id}`);
        const results = res.data;

        setPokemon(results);
      } catch (err) {
        console.error("Error fetching Pokémon:", err);
      } finally {
        setLoading(false);
      }
    }

    if (id) getPokemon();
  }, [id]);

  return (
    <div className="pokemon-page">
      <div className="pokemon-card">
        <h1>{title(pokemon?.name)}</h1>
        <img src={pokemon?.sprites.front_default} className="pokemon-sprite"/>
        <div>
            <p>Species: {title(pokemon?.species.name)}</p>
            <p>Height: {pokemon?.height}</p>
            <p>Weight: {pokemon?.weight}</p>
            <p>Base Experience: {pokemon?.base_experience}</p>
        </div>
      </div>
    </div>
  );
}

export default PokemonInfo;
