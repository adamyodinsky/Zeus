import React from "react";
import container from "./Container.module.scss";
import BarGraph from "../BarGraph/BarGraph";

const Container = props => {
  return (
    <div className={container.box}>
      <div className={container.requests_txt_block}>
        <div className={container.title_container}>
          <strong>Container:</strong> {props.state.container_name}
          CPU Consumption in Percentage
        </div>
        {/*<div className={container.title_request}>Requests:</div>*/}
        {/*<div className={container.resources_block}>*/}
        {/*  <div>CPU={props.state.resources.txt.requests.cpu}</div>*/}
        {/*  <div>RAM={props.state.resources.txt.requests.memory}</div>*/}
        {/*</div>*/}
      </div>
      <BarGraph state={props.state} />
    </div>
  );
};

export default Container;
