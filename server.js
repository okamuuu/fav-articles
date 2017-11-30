const path = require('path')
const faker = require('faker')
const express = require('express')
const jsonServer = require('json-server')
const server = jsonServer.create()

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
  next()
})

const rewriter = jsonServer.rewriter({'/api/': '/'})
const router = jsonServer.router(getArticles())

// server.use(rewriter)
server.use('/api/', router)
server.use('/static', express.static(__dirname + '/build/static'))
server.get('*', function (req, res, next) {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});


function getArticles() {
  const articles = []

  for (var id = 1; id < 51; id++) {

    articles.push({
      "id": id,
      "title": faker.lorem.words(),
      "description": faker.lorem.paragraphs(),
      "isFavorite": false
    })
  }

  return { "articles": articles }
}

module.exports = server
