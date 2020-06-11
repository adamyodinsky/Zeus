import React from "react";
import pagination from './Pagination.module.scss'
import SearchBar from '../SearchBar/SearchBar';

const Pagination = props => {
    return (
        <section className={pagination.pagination_box}>
            <div className={[pagination.page_box, pagination.btn].join(' ')} onClick={props.pageDown}>
                Previous Page
            </div>
            <div className={[pagination.page_box, pagination.btn].join(' ')} onClick={props.pageUp}>
                Next Page
            </div>
            <div className={pagination.page_box}>
                Page: {props.page}
            </div>
            <SearchBar
                onSubmit={props.onSubmit}
            />
        </section>
    );
};

export default Pagination;
