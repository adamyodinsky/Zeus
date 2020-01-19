import React from "react";
import noMatch from './noMatch.module.css'

const NoMatch = (props) => {
  return <div className={noMatch.noMatch}>
    <h1> 404 PAGE NOT FOUND </h1>
        <p>"{props.quote.quote}"<br/><br/>{props.quote.author}</p>
  </div>
  ;
};

export default NoMatch;
