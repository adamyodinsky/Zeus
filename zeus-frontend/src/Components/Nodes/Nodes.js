import React from 'react';
import axios from "axios";
import Pagination from "../Pagination/Pagination";
import Node from "./Node/Node";

class Nodes extends React.Component  {

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

    getNodesState = async () => {
        const url = `http://localhost:3001/nodes?page=${this.state.page}&regex=${this.state.search}`;
        try {
            const response = await axios.get(`${url}`);
            return response.data;
        } catch (e) {
            console.log('ERROR: could not get nodes state object');
            console.log(e.stack)
        }
    };

    handleSearchSubmit(data) {
        (async () => {
            this.setState({
                search: data.search
            });
        })().then(() => {
            this.getNodesState().then((data) => {
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

        (async () => {
            this.setState({
                page: this.state.page + 1
            });
        })().then(() => {
            this.getNodesState().then((data) => {
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
        if (this.state.page - 1 < 0) {
            return;
        }
        (async () => {
            this.setState({
                page: this.state.page - 1
            });
        })().then(() => {
            this.getNodesState().then((data) => {
                if (data) {
                    this.setState({
                        data: data.data,
                        length: data.length
                    })
                }
            });
        });
    };

    componentDidMount() {
        this.getNodesState().then((data) => {
            if (data) {
                this.setState({
                    data: data.data,
                    length: data.length
                })
            }
        });
    }

    render () {
        let renderedNodes = [];
        if (this.state.data) {
            renderedNodes = this.state.data.map((node, i) => {
                return (
                    <Node key={i} state={node}/>
                )
            });
        }

        return (
            <div>
                <section className=''>
                    <Pagination
                        page={this.state.page}
                        pageUp={this.pageUp}
                        pageDown={this.pageDown}
                        onSubmit={this.handleSearchSubmit}/>
                </section>
                {renderedNodes}
            </div>
        )
    }
};

export default Nodes;
