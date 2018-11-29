import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import "bootstrap/dist/css/bootstrap.css";

// react plugin for creating charts
import ChartistGraph from "react-chartist";

import {
  dailySalesChart
} from "variables/charts.jsx";

let stat1 = dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)]
let stat2 = dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-5)] //check trend over past hour
let trend; //-1 if negative, 1 if positive, 0 if stable
if(stat1 === stat2){
  trend = 0;
}
else if (stat1 > stat2) {
  trend = 1;
}
else{
  trend = -1;
}

let i = 0;
let j = 1;
let total = 0;
let mean = 0;
let bigChange1 = 0;
let bigChange2 = 0;
let high = dailySalesChart.data.series[0][i];
let low = dailySalesChart.data.series[0][i];
let difference = Math.abs(dailySalesChart.data.series[0][j] - dailySalesChart.data.series[0][j-1])

while(i < dailySalesChart.data.series[0].length){
  if(dailySalesChart.data.series[0][i] > high){
    high = dailySalesChart.data.series[0][i];
  }
  if(dailySalesChart.data.series[0][i] < low){
    low = dailySalesChart.data.series[0][i];
  }

  total = total + dailySalesChart.data.series[0][i];

  i++;
}

mean = total/dailySalesChart.data.series[0].length;

while(j < dailySalesChart.data.series[0].length){
  if(Math.abs(dailySalesChart.data.series[0][j] - dailySalesChart.data.series[0][j-1]) > Math.abs(difference)){
    difference = dailySalesChart.data.series[0][j] - dailySalesChart.data.series[0][j-1];
    bigChange1 = j;
    bigChange2 = j-1;
  }
  j++;
}



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

  testFunction(trend){
      if (trend === 0){
        return "been stable."
      }

      else if (trend === 1){
        return "gone up."
      }

      else{
        return "gone down."
      }
  }

  render() {
    const { response } = this.state;
    return (
      <div style={{ textAlign: "center" }}>
        {response
          ? <p>
              Our data is {response} °F
            </p>
          : <p>Loading... (This is a demo. Our app is not yet taking in real data.)</p>}

          <div class="jumbotron" style={{backgroundColor: "#563d7c", color:"white"}}>
              <h1 class="display-4"> Your Diabetes Report </h1>
              <p class="lead">A chart displaying the latest readings from your FreeLibre sensor. Here are some interesting tidbits:</p>
                <p>- Since the last hour, overall your blood sugar has { this.testFunction(trend) } (4 readings are done per hour)</p>
                <p>- Your highest reading in the last 8 hours was ({ high }) while your lowest reading was ({low})</p>
                <p>- The biggest change in blood sugar occured between readings ({bigChange2}) and ({bigChange1}) with a change of ({difference})</p>
                <p>- Your average blood reading over the last 8 hours was about ({parseInt(mean)})</p>
              <ChartistGraph
                className="ct-chart"
                data={dailySalesChart.data}
                type="Line"
                options={dailySalesChart.options}
                listener={dailySalesChart.animation}
             />

         </div>

         <div class="row">

         <div class="card" style={{width: "50%"}}>
         <br/>
          <h1>{dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)]}</h1>
          <div class="card-body">
            <h5 class="card-title">Latest Reading</h5>
            { (dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)] > 180) || (dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)] < 70)  ? <p class="card-text text-danger">Warning: Blood sugar outside of normal levels!</p> : <p class="card-text text-success">Blood sugar is normal! Please remember to check regularly!</p>}
          </div>
        </div>

        <div class="card" style={{width: "50%"}}>
        <br/>
         <h1>{dailySalesChart.data.replacement}</h1>
         <div class="card-body">
           <h5 class="card-title">Time Until Replacement</h5>
           { (dailySalesChart.data.replacement > 5)  ? <p class="card-text text-success">You won't need to worry about replacing your sensor anytime soon!</p> : <p class="card-text text-danger">Sensor is nearing expiration date, be sure to replace it soon!</p>}
         </div>
       </div>

       </div>

      </div>
    );
  }
}

export default App;
