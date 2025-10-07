import axios from "axios";

const pokeapi = axios.create({
  baseURL: "https://pokeapi.co/api/v2",
  timeout: 10000,
});

export default pokeapi;