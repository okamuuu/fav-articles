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
