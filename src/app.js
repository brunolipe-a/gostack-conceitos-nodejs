const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
    const { id } = request.params;
    let hasID = false;
    const { title, url, techs } = request.body;
    let updatedRepository = {};


    repositories.map(repository => {
      if (repository.id === id) {
          hasID = true;
          repository.title = title || repository.title;
          repository.url = url || repository.url;
          repository.techs = techs || repository.techs;
          updatedRepository = repository;
      }

      return repository;
    });

    if(!hasID) {
        return response.status(400).json();
    }

    return response.json({ ...updatedRepository });
});

app.delete("/repositories/:id", (request, response) => {
    const { id } = request.params;
    let hasID = false;

    repositories.map((repository, index) => {
        if (repository.id === id) {
            hasID = true;
            repositories.splice(index, 1);
        }
    });

    if(!hasID) {
        return response.status(400).json();
    }

    return response.status(204).json({ message: "Deletado com sucesso" });
});

app.post("/repositories/:id/like", (request, response) => {
    const { id } = request.params;
    let likes = null;

    repositories.map((repository) => {
        if (repository.id === id) {
            repository.likes++;
            likes = repository.likes;
        }
    });

    if(likes === null) {
        return response.status(400).json();
    }

    return response.json({ likes });
});

module.exports = app;
