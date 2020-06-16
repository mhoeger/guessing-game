import axios from 'axios'
export default axios.create({
  baseURL: 'https://guessing-game.azurewebsites.net',
  timeout: 5000
})