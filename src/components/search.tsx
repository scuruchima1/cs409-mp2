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

function title(val: string | undefined) {
    if (val == null) {
        return "";
    }
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function PokemonInfo() {
    
  return (
    <div className="search-view">
        <search>
        <form>
            <input type="text" placeholder="Search.."></input>
        
        </form>
        </search>
    </div>
  );
}

export default PokemonInfo;
