const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateIdRepositorio(request, response, next){
  const {id} = request.params;

  if(!isUuid(id))
    return response.status(400).json('Invalid repository Id.');
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0)
    return response.status(400).json('Repository not found.');
  
  return next();
}

app.get("/repositories", (request, response) => {
  const retorno = repositories;

  return response.json(retorno);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repositorio = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(repositorio);

  return response.json(repositorio);
});

app.put("/repositories/:id", validateIdRepositorio, (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  const likes = repositories[repositoryIndex].likes;

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
  
});

app.delete("/repositories/:id", validateIdRepositorio, (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateIdRepositorio, (request, response) => {
  const {id} = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  const repository = repositories[repositoryIndex];
  
  repository.likes++;
  
  repositories[repositoryIndex] = repository;
  
  return response.json(repository);
});

module.exports = app;
