import React from "react";
import noMatch from './noMatch.module.css'
import axios from 'axios';

class NoMatch extends React.Component {
  // init state
  state = {};

  getQuote = async () => {
    const url = 'https://quotes.rest/qod';
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (e) {
      console.log("ERROR, can't get quote!");
    }
  };

  componentDidMount() {
    this.getQuote().then((data) => {
      this.setState({
          quote: data.contents.quotes[0].quote,
          author: data.contents.quotes[0].author
        });
    });
  }

  render() {
    let renderedQuote = <p>''</p>;
    if(this.state.quote) {
      renderedQuote = <p>"{this.state.quote}"<br/><br/>{this.state.author}</p>
    }

    return (
        <div className={noMatch.noMatch}>
          <h1> 404 PAGE NOT FOUND </h1>
          {renderedQuote}
        </div>
    )
  }
}

export default NoMatch;
