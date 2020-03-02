import React from 'react';
import AreaGraph from "../AreaGraph/AreaGraph";

const Node = (props) => {

    return (
        <div>
            {/*cpu*/}
            <AreaGraph
                formal={props.state.node}
                real={props.state.usage}
                name={props.state.name}
            />

        </div>
    )
};

export default Node;