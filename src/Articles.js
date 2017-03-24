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
