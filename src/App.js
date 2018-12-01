import React, { Component } from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/vi';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';

const url = `${PATH_BASE}${PATH_SEARCH}${DEFAULT_QUERY}`;

const isSearched = searchTerm => item => 
  item.title.toLowerCase().includes(searchTerm.toLowerCase());


class App extends Component {
  constructor(props) {
    super(props);
    this.state = { result: null,
                   searchTerm : DEFAULT_QUERY, 
                  };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  setSearchTopStories(result) {
    this.setState({result});
  }

  componentDidMount() {
    const {searchTerm} = this.state;
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
    .then(response => response.json())
    .then(result => this.setSearchTopStories({result}))
    .catch(error => error);
  }

  onDismiss(id) {
    const isNotId = item => item.objectID !== id;
    const updatedList = this.state.list.filter(isNotId);
    this.setState({list: updatedList});
  }

  onSearchChange(event) {
    // const isNotSearched = list => list.title.splice(0, input.length - 1) !== input;
    // const searchedList = this.state.list.filter(isNotSearched);
    this.setState({searchTerm: event.target.value});
  }



  render() {
    const {searchTerm, list} = this.state;
    return (
      <div className="page">
      <div className="interactions">
      <Search 
        value={searchTerm}
        onChange={this.onSearchChange}
        >
        Search
      </Search>
      </div>
      <Table 
        list={list}
        pattern={searchTerm}
        onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}

const Search = ({ value, onChange, children })  => {
  
  return (
  <form>
        {children}
      <input 
             type="text"
             value={value}
             onChange={onChange}
      />
      </form>
  );
}


const Table =  ({list, pattern, onDismiss}) => {

const largeColumn = { width: '40%'};
const medColumn = { width: '30%' };
const smallColumn = { width: '10%' };

    return (
      <div className="table">
      {list.filter(isSearched(pattern)).map(item =>
        <div key={item.objectID} className="table-row">
          <span style={largeColumn}>
            <a href={item.url}>{item.title}</a>
          </span>
          <span style={medColumn}>
          {item.author}
          </span>
          <span style={smallColumn}>
          {item.num_comments}
          </span>
          <span style={smallColumn}>
          {item.points}
          </span>
          <span style={smallColumn}>
            <Button
              onClick={() => onDismiss(item.objectID)}
              type="button"
              className="button-inline"
            > 
              Dismiss
            </Button>
          </span>
        </div>
      )}
      </div>
    );
  }


const Button = ({onClick, className = '', children}) => {
 
  return (
      <button 
      onClick={onClick}
      className={className}
      type="button"
      >
      {children}
      </button>
    );
  }


export default App;
