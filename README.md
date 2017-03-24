# React.js tutorial: My Favorite Articles

## STEP0: requirements 

This tutorial needs below modules. You should install before starting this tut.

```
npm install -g create-react-app json-server
```

After that, you can create react app easily.

```
create-react-app fav-articles && cd $_
```

## STEP1: Create fake server

`json-server` is a great libraliy for web developers. you can create a fake server with less effort. `faker` also is. These are very compatible.

```
npm install --save faker
touch server.js
```

create server.js

```javascript
const faker = require('faker')
const jsonServer = require('json-server')
const server = jsonServer.create()

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS")
  next()
})

const rewriter = jsonServer.rewriter({'/api/': '/'})
const router = jsonServer.router(getArticles())

server.use(rewriter)
server.use(router)

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
```

edit `package.json`

```
     "start": "react-scripts start",
     "build": "react-scripts build",
     "test": "react-scripts test --env=jsdom",
-    "eject": "react-scripts eject"
+    "eject": "react-scripts eject",
+    "serve": "node -e \"require('./server').listen(4000)\""
   }
```

let's serve it

```
npm run serve

> practice-app@0.1.0 serve /Users/okamuuu/practice-app
> node -e "require('./server').listen(3000)"
```

So, you can see 50 articles on `http://localhost:4000/api/articles`.

```
open http://localhost:4000/api/articles
```

## STEP2: Create Api class and the test case

I'll tell you beforehand　 using link header for pagination in this tutorial.
I lile to use `axios` and `parse-link-header` library. but you can use any other helpful modules if you want.

```
npm install --save axios parse-link-header
touch src/Api.js src/Api.test.js
```

create `src/Api.js`

```javascript
import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import parse from 'parse-link-header'

// https://github.com/mzabriskie/axios/issues/305#issuecomment-233141731
// for jest. force the node adapter
if (process.env.NODE_ENV == "test") {
  axios.defaults.adapter = httpAdapter
}

export default class Api {

  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  listArticles(page=1) {
    return axios.get(`${this.baseUrl}/api/articles?_page=${page}`).then((res) => {
      return {
        "articles": res.data || [], 
        "links": parse(res.headers.link)
      }   
    })  
  }
  
  listFavoriteArticles(page=1) {
    return axios.get(`${this.baseUrl}/api/articles?isFavorite=true&_page=${page}&_limit=50`).then((res) => {
      return {
        "articles": res.data || [], 
        "links": parse(res.headers.link)
      }   
    })  
  }
  
  showArticle(id) {
    return axios.get(`${this.baseUrl}/api/articles/${id}`).then((res) => {
      return { "article": res.data }
   })
  }

  updateArticle(id, params) {
    return axios.put(`${this.baseUrl}/api/articles/${id}`, params).then((res) => {
      return { "article": res.data }
    })
  }
}
```

create `src/Api.test.js`

```javascript
import server from '../server'
import Api from '../src/Api'

const port = server.listen(0).address().port
const api = new Api(`http://127.0.0.1:${port}`)

describe('Api', function() {

  test('listArticles', async () => {
    const result = await api.listArticles()
    expect(result.articles.length).toEqual(10)
  })  
})
```

Let's test it with `CI=true npm run test`.

```
% CI=true npm test

> fav-articles@0.1.0 test /Users/okamuuu/fav-articles
> react-scripts test --env=jsdom

 PASS  src/Api.test.js
 PASS  src/App.test.js

Test Suites: 2 passed, 2 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.843s
Ran all test suites.
```

## STEP4: A few Designing

```
npm install --save bootstrap
```

edit `src/index.js`

```
 import React from 'react';
 import ReactDOM from 'react-dom';
 import App from './App';
+import 'bootstrap/dist/css/bootstrap.css'
 import './index.css';
```

We need just only CSS in this tutorial.

## STEP5: react-router

`react-router` updates the version from 3 to 4 lately. Using `react-router@v4` in this tutorial.

```
npm install --save react-router-dom
touch src/Article.js
```

create `src/Article.js`

```javascript
import React, {Component} from 'react'
import { Link } from 'react-router-dom'

class List extends Component {

  render() {
    return (
      <div>
        <h2>Articles</h2>
        <ul>
          <li><Link to="/articles/1">Show 1</Link></li>
          <li><Link to="/articles/2">Show 2</Link></li>
          <li><Link to="/articles/3">Show 3</Link></li>
        </ul>
      </div>
    )
  }
}

class FavoriteList extends Component {

  render() {
    return (
      <div>
        <h2>Favorite Articles</h2>
	  </div>
    )
  }
}

class Show extends Component {

  render() {
    return (
      <div>
        <h3>Show {this.props.match.params.id}</h3>
      </div>
    )
  }
}

export default { List, FavoriteList, Show }
```

edit `src/App.js`

```javascript
import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link, NavLink, withRouter } from 'react-router-dom'

import Articles from './Articles'

const Header = ({onClick}) => (
  <h1 className="text-center" style={{cursor: "pointer" }} onClick={onClick}>Favorite Articles</h1>
)

const Nav = () => (
  <ul className="nav nav-pills">
    <li><NavLink exact to="/articles">Articles</NavLink></li>
    <li><NavLink exact to="/articles/favorite">Favorite Articles</NavLink></li>
  </ul>
)

const Footer = () => (<p className="text-center">Favorite Articles</p>)

const Routes = withRouter(({history}) => (
  <div className="container">
    <Header onClick={() => history.push("/")} />
    <Nav />
    <Switch>
      <Route exact path="/" component={Articles.List}/>
      <Route exact path="/articles" component={Articles.List}/>
      <Route exact path="/articles/favorite" component={Articles.FavoriteList}/>
      <Route exact path="/articles/:id" component={Articles.Show}/>
    </Switch>
    <Footer />
  </div>
))

const App = () => (
  <Router>
    <Routes />
  </Router>
)

export default App
```

Let's run the app. Do `npm start` and `open http://localhost:3000`


## STEP6: Using Api Class

Let's use Api Class before we create.

edit `src/Articles.js`

```javascript
import React, {Component} from 'react'
import { Link } from 'react-router-dom'

import Api from './Api'

const api = new Api(`http://127.0.0.1:4000`)

class List extends Component {

  constructor(props) {
    super(props)
    this.state = { articles: [] }
  }

  componentWillMount() {
    api.listArticles().then((result) => {
      this.setState({articles: result.articles, current: 1, last: result.links.last._page})
    })
  }

  render() {
    return (
      <div>
        <h2>Articles</h2>
        <ul>
          {this.state.articles.map((x, index) => (
            <li key={index}>
              <Link to={`/articles/${x.id}`}>{x.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

class FavoriteList extends Component {

  render() {
    return (
      <div>
        <h2>Favorite Articles</h2>
      </div>
    )
  }
}

class Show extends Component {

  constructor(props) {
    super(props)
    this.state = { article: {} }
  }

  componentWillMount() {
    const { id } = this.props.match.params
    api.showArticle(parseInt(id, 10)).then((result) => {
      this.setState({article: result.article})
    })
  }

  render() {
    const {article} = this.state
    return (
      <div>
        <h2>{article.title}</h2>
        <p>{article.description}</p>
      </div>
    )
  }
}

export default { List, FavoriteList, Show }
```

Let's check the app. Do `npm start` and `open http://localhost:3000` again.
Be sure to run `npm run serve`

## STEP7: Add Favorite Toggle Button

Using star icon with `react-icons`

```
npm install --save react-icons immutable
```

edit `src/Articles.js` to add FavoriteButton and update FavoriteList function.

```javascript
import React, {Component} from 'react'
import { Link } from 'react-router-dom'

import FaStar from 'react-icons/lib/fa/star'
import immutable from 'immutable'

import Api from './Api'

const api = new Api(`http://127.0.0.1:4000`)

const FavoriteButton = ({isFavorite, onClick}) => (
  <FaStar style={{cursor: "pointer"}} color={isFavorite ? "#ffa500" : "#eee"} onClick={onClick} />)

class List extends Component {

  constructor(props) {
    super(props)
    this.state = { articles: [] }
  }

  componentWillMount() {
    api.listArticles().then((result) => {
      this.setState({articles: result.articles, current: 1, last: result.links.last._page})
    })
  }

  handleFavorite(article, index) {
    article.isFavorite = article.isFavorite !== true
    api.updateArticle(article.id, article).then((result) => {
      const nextArticles = immutable.List(this.state.articles)
      nextArticles[index] = result.article
      this.setState({articles: nextArticles})
    })  
  }

  render() {
    return (
      <div>
        <h2>Articles</h2>
        <ul>
          {this.state.articles.map((x, index) => (
            <li key={index}>
              <Link to={`/articles/${x.id}`}>{x.title}</Link>
              {" "}
              <FavoriteButton isFavorite={x.isFavorite} onClick={() => this.handleFavorite(x, index)} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

class FavoriteList extends Component {

  constructor(props) {
    super(props)
    this.state = { articles: [] }
  }

  componentWillMount() {
    api.listFavoriteArticles().then((result) => {
      this.setState({articles: result.articles})
    })
  }

  render() {

    const {articles} = this.state

    return (
      <div>
        <h2>Favorites</h2>
        <ul>
        {this.state.articles.map((x, index) => (
          <li key={index}><Link to={`/articles/${x.id}`}>{x.title}</Link></li>
        ))}
        </ul>
      </div>
    )
  }
}

class Show extends Component {

  constructor(props) {
    super(props)
    this.state = { article: {} }
  }

  componentWillMount() {
    const { id } = this.props.match.params
    api.showArticle(parseInt(id, 10)).then((result) => {
      this.setState({article: result.article})
    })
  }

  render() {
    const {article} = this.state
    return (
      <div>
        <h2>{article.title}</h2>
        <p>{article.description}</p>
      </div>
    )
  }
}

export default { List, FavoriteList, Show }
```

Let's run the app. Do `npm start` and `open http://localhost:3000` again. It will end soon.

## STEP8: Add Pagination

```
npm install --save react-paginators
```

edit `src/Articles.js`

```diff
diff --git a/src/Articles.js b/src/Articles.js
index 402ed67..dc68871 100644
--- a/src/Articles.js
+++ b/src/Articles.js
@@ -5,6 +5,7 @@ import FaStar from 'react-icons/lib/fa/star'
 import immutable from 'immutable'
 
 import Api from './Api'
+import { Bootstrap3ishPaginator } from 'react-paginators'
 
 const api = new Api(`http://127.0.0.1:4000`)
 
@@ -27,13 +28,23 @@ class List extends Component {
   handleFavorite(article, index) {
     article.isFavorite = article.isFavorite !== true
     api.updateArticle(article.id, article).then((result) => {
-      const newArticles = this.state.articles
-      newArticles[index] = result.article
-      this.setState({articles: newArticles})
+      const nextArticles = immutable.List(this.state.articles)
+      nextArticles[index] = result.article
+      this.setState({articles: nextArticles})
+    })
+  }
+
+  handlePageClick(page) {
+    api.listArticles(page).then((result) => {
+       this.setState({articles: result.articles, current: page, last: result.links.last._page})
     })
   }
 
   render() {
+
+    const current = this.state && this.state.current || 1
+    const last = this.state && parseInt(this.state.last, 10) || 1
+
     return (
       <div>
         <h2>Articles</h2>
@@ -46,6 +57,15 @@ class List extends Component {
             </li>
           ))}
         </ul>
+
+        <div style={{padding: "30px",  display: "flex", justifyContent: "center" }}>
+          <Bootstrap3ishPaginator
+            current={current}
+            last={last}
+            maxPageCount={10}
+            onClick={this.handlePageClick.bind(this)}
+          />
+        </div>
       </div>
     )
   }
```

Let's run the app. Do `npm start` and `open http://localhost:3000`. 
thank you for reading it until the very end:)

