import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import pokeapi from "../api/pokeapi";
import './pokemonInfo.css'

interface Pokemon {
  name: string;
  id: number;
  species: {
    name: string;
  };
  base_experience: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
  };
  abilities: {
    ability: {
      name: string;
      url: string;
    };
  }[];
}

interface AbilityEffectEntry {
  effect: string;
  language: {
    name: string;
  };
}

interface AbilityResponse {
  name: string;
  effect_entries: AbilityEffectEntry[];
}

interface AbilityEffect {
  name: string;
  effect: string;
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
    const [abilityEffects, setAbilityEffects] = useState<AbilityEffect[]>([]);

    useEffect(() => {
      async function getPokemon() {
        try {
          const res = await pokeapi.get<Pokemon>(`/pokemon/${id}`);
          const results = res.data;
          setPokemon(results);

          // Fetch ability effects
        const abilities = results.abilities;
        const effects: AbilityEffect[] = [];

        for (const entry of abilities) {
          const abilityRes = await pokeapi.get<AbilityResponse>(entry.ability.url);
          const effectEntry = abilityRes.data.effect_entries.find(
            (e) => e.language.name === "en"
          );
          effects.push({
            name: entry.ability.name,
            effect: effectEntry?.effect || "No effect description available.",
          });
        }

        setAbilityEffects(effects);
        } catch (err) {
          console.error("Error fetching Pokémon:", err);
        }
      }

      if (id) getPokemon();
    }, [id]);

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
                <div className="poke-basic-info">
                  <p>Base Experience: {pokemon?.base_experience}</p>
                  <p>Height: {pokemon?.height}</p>
                  <p>Weight: {pokemon?.weight}</p>
                </div>
                {abilityEffects.length > 0 && (
                  <div className="ability-section">
                    <h3>Abilities</h3>
                    {abilityEffects.map((a) => (
                      <div key={a.name}>
                        <p><strong>{title(a.name)}</strong></p>
                        <p>{a.effect}</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
            <button className="nav-button" onClick={() => navigate(`/pokemon/${pokemon?.id! + 1}`)} disabled={pokemon?.id! >= 1000}> &gt;</button>
        </div>
    </div>
  );
}

export default PokemonInfo;
