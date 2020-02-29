import React from 'react';
import Deployment from './Deployment/Deployment'
import axios from 'axios';
// import * as qs from 'querystring'
import Pagination from "./Pagination/Pagination";
import SearchBar from "./SearchBar/SearchBar";


class Deployments extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      data: null,
      length: 0,
      search: ""
    };

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }

  getDeploymentsState = async () => {
    const url =  `http://localhost:3001/state?page=${this.state.page}&regex=${this.state.search}`;
    try {
      const response = await axios.get(`${url}`);
      return response.data;
    } catch (e) {
      console.log('ERROR: could not get main state object');
      console.log(e)
    }
  };

  // TODO query params (url) integration
  // getQueryParams = () => {
  //   const query_params = qs.parse(`${this.props.location.search.slice(1)}`);
  //
  //   if (query_params.page) {
  //     return query_params.page
  //   } else {
  //     return 0
  //   }
  // };

  handleSearchSubmit(data) {
    console.log('in handle submit func');
    console.log(data);

    (async() => {
      this.setState({
        search: data.search
      });
    })().then(()=>{
      this.getDeploymentsState().then((data)=> {
        this.setState({
          data: data.data,
          length: data.length
        })
      });
    });
  };

  pageUp = () => {
    console.log('Page Up');

    (async() => {
      this.setState({
        page: this.state.page + 1
      });
    })().then(()=>{
      this.getDeploymentsState().then((data)=> {
        this.setState({
          data: data.data,
          length: data.length
        })
      });
    });
  };

  pageDown = () => {
    console.log('Page Down');
    if(this.state.page - 1 < 0) {
      return;
    }
    (async() => {
      this.setState({
        page: this.state.page - 1
      });
    })().then(() => {
      this.getDeploymentsState().then((data)=> {
        this.setState({
          data: data.data,
          length: data.length
        })
      });
    });
  };

  componentDidMount() {
    this.getDeploymentsState().then((data)=> {
      this.setState({
        data: data.data,
        length: data.length
      })
    });
  }

  // shouldComponentUpdate(nextProps, nextState, nextContext) {
  //   console.warn('nextState', nextState);
  //   return nextState.page !== this.state.page || nextState.data !== this.state.data;
  // }

  render() {
    let renderedDeployments = [];
    if(this.state.data) {
      renderedDeployments = this.state.data.map((deployment, i) => {
        return (
            <Deployment key={i} state={deployment}/>
        )
      });
    }

    return(
        <div>
          <div>
            <Pagination
              page={this.state.page}
              pageUp={this.pageUp}
              pageDown={this.pageDown}
            />
            <SearchBar
            onSubmit={this.handleSearchSubmit}/>
          </div>
          {renderedDeployments}
        </div>
    );
  }
}

export default Deployments;
