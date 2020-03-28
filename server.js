require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')
console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

app.use(function validateBearerToken(req, res, next) {
  //store (in their own variables) the value for stored api token and api token submitted by user 
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN

  console.log('validate bearer token middleware')

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  //debugger
  //move to the next middleware
  next()
})

function handleGetTypes(req, res) {
  res.json(validTypes)
}
app.get('/types', handleGetTypes)

/*  get pokemon from query string param */
function handleGetPokemon(req, res) {
  //console.log(req.query)
  //res.send('Hello, Pokemon!')
}

app.get('/pokemon', function handleGetPokemon(req, res){
  let response = POKEDEX.pokemon;
  //console.log(response);
  if (req.query.name) {
    response = response.filter(pokemon =>
      // case insensitive searching
      pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())
    )
  }

  // filter our pokemon by type if type query param is present
  if (req.query.type) {
    response = response.filter(pokemon =>
      pokemon.type.includes(req.query.type)
    )
  }

  res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})