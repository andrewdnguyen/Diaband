import React, { Component } from "react";
import socketIOClient from "socket.io-client";

import "bootstrap/dist/css/bootstrap.css";
import firebase from "firebase"

// react plugin for creating charts
import ChartistGraph from "react-chartist";

import {
  dailySalesChart
} from "./variables/charts.jsx";

var config = {
  apiKey: "AIzaSyC2h9JcfucVwd12Ud4ejL7pQj6eeC37J-8",
  authDomain: "diaband-78956.firebaseapp.com",
  databaseURL: "https://diaband-78956.firebaseio.com",
  projectId: "diaband-78956",
  storageBucket: "diaband-78956.appspot.com",
  messagingSenderId: "105285075120"
};

let stat1 = dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)]
let stat2 = dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-4)] //check trend over past hour
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

let adjective = "looking good at the moment, keep it up! Here's your reward:"
let tip1;
let tip2;
let tip3;
let tip4;
let background = {backgroundColor: "#28a745", color:"white"};

let sugarWarning = 0;

if(dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)] > 180){
  sugarWarning = 1;
  adjective = "higher than it should be, make sure that you have regularly administered insulin! Here are some ways to naturally bring it down:"
  tip1 = "1) Make sure to exercise regularly.";
  tip2 = "2) Watch your carbohydrate intake.";
  tip3 = "3) Drink lots of water.";
  tip4 = "4) Lower your stress levels.";
  background = {backgroundColor: "#dc3545", color:"white"};
}

if(dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)] < 70){
  sugarWarning = -1;
  adjective = "lower than it should be! Here is what you should do:"
  tip1 = "1) Check for symptoms such as: Weakness and/or fatigue, headache, sweating, anxiety, dizziness, shaking, or increased heartbeat";
  tip2 = "2) If your latest reading is lower than 70 eat 15 to 30 grams of carbohydrates (E.g about one small fruit or 1/2 a cup of juice)";
  tip3 = "3) If it remains low after 15 minutes (at the next reading) eat another 15 grams of carbohydrates.";
  tip4 = "4) Your blood sugar levels may have dropped due to: skipping a meal, taking too much insulin or eating too few carbohydrates, or recently exercising.";
  background = {backgroundColor: "#ffc107"};
}




class App extends Component {
  constructor() {
    super();

    this.app = firebase.initializeApp(config);
    this.database = this.app.database().ref().child('value')

    this.state = {
      value: 0,
      response: false,
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
    this.database.on('value', snap => {
      this.setState({
        value: snap.val()
      });
    });
  }

  testFunction(trend){
      if (trend === 0){
        return "Stable"
      }

      else if (trend === 1){
        return "Sugar Level Increase"
      }

      else{
        return "Sugar Level Decrease"
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
              <h1 class="display-4"> Firebase Test Value: {this.state.value} </h1>
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



        <div class="card" style={{width: "50%", height: "100%"}}>
        <br/>
         <h1>{dailySalesChart.data.replacement}</h1>
         <div class="card-body">
           <h5 class="card-title">Time Until Replacement</h5>
           { (dailySalesChart.data.replacement > 5)  ? <p class="card-text text-success">You won't need to worry about replacing your sensor anytime soon!</p> : <p class="card-text text-danger">Sensor is nearing expiration date, be sure to replace it soon!</p>}
         </div>
       </div>

       </div>

       <div class="row">

           <div class="card" style={{width: "50%"}}>
           <br/>
            <h1>{parseInt(mean)}</h1>
            <div class="card-body">
              <h5 class="card-title">Average Reading</h5>
              { (dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)] > 180) || (dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)] < 70)  ? <p class="card-text text-danger">Warning: Blood sugar outside of normal levels!</p> : <p class="card-text text-success">Blood sugar is normal! Please remember to check regularly!</p>}
            </div>
          </div>



          <div class="card" style={{width: "50%"}}>
          <br/>
           <h1>{difference}</h1>
           <div class="card-body">
             <h5 class="card-title">Biggest Change</h5>
             { (dailySalesChart.data.replacement > 5)  ? <p class="card-text text-success">You won't need to worry about replacing your sensor anytime soon!</p> : <p class="card-text text-danger">Sensor is nearing expiration date, be sure to replace it soon!</p>}
           </div>
         </div>

         </div>

         <div class="row">

             <div class="card" style={{width: "50%"}}>
             <br/>
              <h1>{this.testFunction(trend)}</h1>
              <div class="card-body">
                <h5 class="card-title">Change in the Last Hour</h5>
                { (dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)] > 180) || (dailySalesChart.data.series[0][(dailySalesChart.data.series[0].length-1)] < 70)  ? <p class="card-text text-danger">Warning: Blood sugar outside of normal levels!</p> : <p class="card-text text-success">Blood sugar is normal! Please remember to check regularly!</p>}
              </div>
            </div>



            <div class="card" style={{width: "50%"}}>
            <br/>
             <h1>[{low}, {high}]</h1>
             <div class="card-body">
               <h5 class="card-title">Highest and Lowest Reading in Last 8 Hours</h5>
               { (dailySalesChart.data.replacement > 5)  ? <p class="card-text text-success">You won't need to worry about replacing your sensor anytime soon!</p> : <p class="card-text text-danger">Sensor is nearing expiration date, be sure to replace it soon!</p>}
             </div>
           </div>

           </div>

               <br/>

       <div class="jumbotron" style={background}>
           <h1 class="display-4"> Recommendations</h1>
           <p class="lead">Your current blood reading is {adjective}</p>
             {sugarWarning === 0 ? <img src={require("./assets/img/cute-cat.jpg")} style={{maxHeight: 250}} alt="" className="img-responsive" /> : ""}
             <p>{tip1} </p>
             <p>{tip2}</p>
             <p>{tip3}</p>
             <p>{tip4}</p>
      </div>

      </div>
    );
  }
}

export default App;
