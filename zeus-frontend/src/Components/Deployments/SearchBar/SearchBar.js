import React from "react";
import { useForm } from 'react-hook-form'
// import searchbar from './SearchBar.module.scss'

const SearchBar = (props) => {
    const { register, handleSubmit } = useForm();

    return (
        <form onSubmit={handleSubmit(props.onSubmit)}>
            <label>Search:</label>
            <input name="search" ref={register} />
        </form>
    );
};

export default SearchBar;
