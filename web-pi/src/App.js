import React, { Component } from "react";
import socketIOClient from "socket.io-client";

// react plugin for creating charts
import ChartistGraph from "react-chartist";

import {
  dailySalesChart
} from "variables/charts.jsx";

class App extends Component {
  constructor() {
    super();
    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        {response
          ? <p>
              Our data is {response} °F
            </p>
          : <p>Loading...</p>}
          <ChartistGraph
            className="ct-chart"
            data={dailySalesChart.data}
            type="Line"
            options={dailySalesChart.options}
            listener={dailySalesChart.animation}
         />
      </div>
    );
  }
}

export default App;
