import React from "react";
import pagination from './Pagination.module.scss'

const Pagination = props => {
    return (
        <section className={pagination.pagination_box}>
            <div className={[pagination.page_box, pagination.btn].join(' ')} onClick={props.pageUp}>
                Page Up
            </div>
            <div className={[pagination.page_box, pagination.btn].join(' ')} onClick={props.pageDown}>
                Page Down
            </div>
            <div className={pagination.page_box}>
                Page: {props.page}
            </div>
        </section>
    );
};

export default Pagination;
