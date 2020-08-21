import React from 'react';
import Controller from './Controller/Controller'
import axios from 'axios';
// import * as qs from 'querystring'
import Pagination from "../Pagination/Pagination";
import deployment from './Controllers.module.scss'


class Controllers extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            page: 0,
            controllers: null,
            length: 0,
            search: ""
        };

        this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
    }

    getControllersState = async () => {
        const url = `http://localhost:3001/controllers?page=${this.state.page}&regex=${this.state.search}`;
        try {
            const response = await axios.get(`${url}`);
            // console.log(response.data);
            return response.data;
        } catch (e) {
            console.log('ERROR: could not get deployments state object');
            console.log(e.stack)
        }
    };

    // TODO query params (url) integration
    //   const query_params = qs.parse(`${this.props.location.search.slice(1)}`);

    handleSearchSubmit(data) {
        console.log('in handle submit func');

        (async () => {
            this.setState({
                search: data.search
            });
        })().then(() => {
            this.getControllersState().then((data) => {
                if (data) {
                    this.setState({
                        data: data.data,
                        length: data.length
                    })
                }
            });
        });
    };

    pageUp = () => {
        console.log('Page Up');

        (async () => {
            this.setState({
                page: this.state.page + 1
            });
        })().then(() => {
            this.getControllersState().then((data) => {
                if (data) {
                    this.setState({
                        data: data.data,
                        length: data.length
                    })
                }
            });
        });
    };

    pageDown = () => {
        console.log('Page Down');
        if (this.state.page - 1 < 0) {
            return;
        }

        (async () => {
            this.setState({
                page: this.state.page - 1
            });
        })().then(() => {
            this.getControllersState().then((data) => {
                if (data) {
                    this.setState({
                        controllers: data.data,
                        length: data.length
                    })
                }
            });
        });
    };


    componentDidMount() {
        this.renderControllers();
    }

    renderControllers = async () => {
        let payload = await this.getControllersState();
        let length = payload.length;
        let data = payload.data;

        if(data){
            this.setState({
                controllers: data,
                length: length
            })
        }
    }

    render() {
        let renderedControllers = [];
        if (this.state.controllers) {
            renderedControllers = this.state.controllers.map((controller, i) => <Controller key={i} state={controller}/>);
        }

        return (
            <div>
                <section className={deployment.options_bar}>
                    <Pagination
                        page={this.state.page}
                        pageUp={this.pageUp}
                        pageDown={this.pageDown}
                        onSubmit={this.handleSearchSubmit}/>
                </section>
                {renderedControllers}
            </div>
        );
    }
}

export default Controllers;
