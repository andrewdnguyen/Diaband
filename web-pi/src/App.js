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

class App extends Component {
  constructor() {
    super();

    // this.app = firebase.initializeApp(config);
    !firebase.apps.length ? this.app = firebase.initializeApp(config) : this.app = firebase.app();

    this.database = this.app.database().ref().child('log');

    this.state = {
      event: "Food",
      reading: "",
      time: "",
      info: "",
      infoArray:[],
      response: [87, 91, 114, 125, 100, 140, 55, null, 110, 98, 140, 150, null, 110, 98, null, 10, 160, 90, 87, 91, 114, 125, 100, 140, 150, 100, 110, 230, 90, 70, 180, 200],
      endpoint: "http://127.0.0.1:4001"
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("FromAPI", data => this.setState({ response: data }));
    this.database.on('value', snap => {
      console.log(JSON.stringify(snap.val().infoArray));
      this.setState({
        infoArray:snap.val().infoArray,
      });
      console.log(this.state.image);
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

getDiff(event){
  let j = 1;
  let bigChange1;
  let bigChange2;
  let difference = 0;
  while(j < event.length){
    if(Math.abs(event[j] - event[j-1]) > Math.abs(difference)){
      difference = event[j] - event[j-1];
      bigChange1 = j;
      bigChange2 = j-1;
    }
    j++;
  }

  let changeArr = [bigChange1, bigChange2, difference];
  return changeArr;
}

  renderImage(event){

    const events = {
      food: require("./assets/img/food.png"),
      exercise: require("./assets/img/exercise.jpg"),
      insulin: require("./assets/img/insulin.png"),
      other: require("./assets/img/other.jpg")
    }

      if (event === "Food"){
        return <img src={events.food} style={{maxHeight: 250}} alt="" className="img-responsive" />
      }

      else if (event === "Exercise"){
        return <img src={events.exercise} style={{maxHeight: 250}} alt="" className="img-responsive" />
      }

      else if (event === "Insulin"){
        return <img src={events.insulin} style={{maxHeight: 250}} alt="" className="img-responsive" />
      }

      else{
        return <img src={events.other} style={{maxHeight: 250}} alt="" className="img-responsive" />
      }
  }

getMean(event){
  let i = 0;
  let total =0;
  while(i < event.length){


    total = total + event[i];

    i++;
  }

  let mean = total/event.length;
  return mean;
}

getHigh(event){
  let i = 0;
  let index = 0;
  let high = event[0];
  while(i < event.length){
    if(event[i] > high){
      high = event[i];
      index = i;
    }
    i++;
  }
  return [high, index];
}

getLow(event){
  let i = 0;
  let low = event[0];
  let index = 0;
  while(i < event.length){
    if(event[i] < low){
      low = event[i];
      index = i;
    }
    i++;
  }
  return [low, index];
}

lastHour(event){
  let latest = event[event.length-1];
  let hourAgo = event[event.length -4]
  let difference = latest-hourAgo;
  if(latest === hourAgo){
    return "Stable"
  }
  else if (latest > hourAgo) {
    return ["increase", difference]
  }
  else{
    return ["decrease", difference]
  }
}

renderTips(event){
  let adjective = "looking good at the moment, keep it up! Here's your reward:"
  let tip1;
  let tip2;
  let tip3;
  let tip4;
  let background = {backgroundColor: "#28a745", color:"white"};

  let sugarWarning = 0;

  if(event[(event.length-1)] > 180){
    sugarWarning = 1;
    adjective = "higher than it should be, make sure that you have regularly administered insulin! Here are some ways to naturally bring it down:"
    tip1 = "1) Make sure to exercise regularly.";
    tip2 = "2) Watch your carbohydrate intake.";
    tip3 = "3) Drink lots of water.";
    tip4 = "4) Lower your stress levels.";
    background = {backgroundColor: "#dc3545", color:"white"};
  }

  if(event[(event.length-1)] < 70){
    sugarWarning = -1;
    adjective = "lower than it should be! Here is what you should do:"
    tip1 = "1) Check for symptoms such as: Weakness and/or fatigue, headache, sweating, anxiety, dizziness, shaking, or increased heartbeat";
    tip2 = "2) If your latest reading is lower than 70 eat 15 to 30 grams of carbohydrates (E.g about one small fruit or 1/2 a cup of juice)";
    tip3 = "3) If it remains low after 15 minutes (at the next reading) eat another 15 grams of carbohydrates.";
    tip4 = "4) Your blood sugar levels may have dropped due to: skipping a meal, taking too much insulin or eating too few carbohydrates, or recently exercising.";
    background = {backgroundColor: "#ffc107"};
  }

  let tipsArray = [sugarWarning, adjective, tip1, tip2, tip3, tip4, background];

  return tipsArray;
}

updateTime = e => {
  console.log(e.target.value);
  this.setState({
    time: e.target.value
  });
  console.log(this.state.time);
}

updateReading = e => {
  console.log([e.target.name]);
  this.setState({
    [e.target.name]: e.target.value
  });
}

updateInfo = e => {
  console.log(e.target.value);
  this.setState({
    [e.target.name]: e.target.value
  });
}

updateEvent = e => {
  console.log(e.target.value);
  this.setState({
    event: e.target.value
  });
  console.log(this.state.event);
}

addData = e => {
  e.preventDefault();
  let testObject = {time: this.state.time, event: this.state.event, reading: this.state.reading, info: this.state.info};
  this.state.infoArray.push(testObject);
  let toSend = {infoArray:this.state.infoArray};
  console.log(testObject);
  this.database.set(toSend);
  this.setState({
    time: "",
    event: "Food",
    info: "",
    reading: ""
  });
};

removeInfo = e => {
  e.preventDefault();
  if(this.state.infoArray.length > 1){
  this.state.infoArray.pop()
  }
  let toSend = {infoArray:this.state.infoArray}
  this.database.set(toSend);
  this.setState({
    time: "",
    event: "",
    info: "",
    reading: ""
  });
};

  render() {
    const { response } = this.state;
    const data = {response}.response;
    console.log(data);
    let graphData ={
       data: {
         labels: ["-8h",,,, "-7h",,,, "-6h",,,, "-5h",,,, "-4h",,,, "-3h",,,, "-2h",,,, "-1h",,,, "0h"],
        series: [],
        replacement: 6
      }
    }

    graphData.data.series[0] = data;
    let variables = graphData.data.series[0];
    let increment = 0;
    while(increment < variables.length){
      if(!Number.isInteger(variables[increment])){
        variables[increment] = Math.floor(Math.random() * 256);;
      }
      increment++;
    }

    let iArr = this.state.infoArray;



    let mean = parseInt(this.getMean(variables));
    let highest = this.getHigh(variables);
    let lowest = this.getLow(variables);
    let change = this.getDiff(variables);
    let diff = change[2];
    let tips = this.renderTips(variables);
    let change1 = (32-change[0]) * 15;
    let change2 = (32-change[1]) * 15;
    let lastHr = this.lastHour(variables);

    return (
      <div style={{ textAlign: "center" }}>
        {response
          ? <p>
              Our respone is {JSON.stringify(response)}
            </p>
          : <p>Loading... (This is a demo. Our app is not yet taking in real data.)</p>}

          <div class="jumbotron" style={{backgroundColor: "#563d7c", color:"white"}}>
              <h1 class="display-4"> Your Child's Diabetes Report </h1>
              <p class="lead">Here are some summary statistics regarding your child's blood sugar levels over the last 8 hours!</p>
              <p class="lead">Below is a chart of your child's blood sugar levels in mg/dL over the last 8 hours:</p>

              <ChartistGraph
                className="ct-chart"
                data={graphData.data}
                type="Line"
                options={dailySalesChart.options}
                plugins={dailySalesChart.plugins}
             />

         </div>

         <div class="row">

         <div class="card" style={{width: "50%"}}>
         <br/>
          <h1>{variables[(variables.length-1)]}</h1>
          <div class="card-body">
            <h5 class="card-title">Latest Reading</h5>
            { (variables[(variables.length-1)] > 180) || (variables[(variables.length-1)] < 70)  ? <p class="card-text text-danger">Warning: Blood sugar outside of normal levels!</p> : <p class="card-text text-success">Blood sugar is normal! Please remember to check regularly!</p>}
          </div>
        </div>



        <div class="card" style={{width: "50%", height: "100%"}}>
        <br/>
         <h1>{graphData.data.replacement}</h1>
         <div class="card-body">
           <h5 class="card-title">Time Until Replacement</h5>
           { (graphData.data.replacement > 5)  ? <p class="card-text text-success">You won't need to worry about replacing your child's sensor anytime soon!</p> : <p class="card-text text-danger">Sensor is nearing expiration date, be sure to replace it soon!</p>}
         </div>
       </div>

       </div>

       <div class="row">

           <div class="card" style={{width: "50%"}}>
           <br/>
            <h1>{mean}</h1>
            <div class="card-body">
              <h5 class="card-title">Average Reading</h5>
              { (mean > 126) || (mean < 70)  ? <p class="card-text text-danger">Your child's blood sugar average is outside the standard acceptable range given by Kaiser Permanente. </p> : <p class="card-text text-success">Your child's blood sugar average is within the acceptable range given by Kaiser Permanente!</p>}
            </div>
          </div>



          <div class="card" style={{width: "50%"}}>
          <br/>
           <h1>{diff}</h1>
           <div class="card-body">
             <h5 class="card-title">Biggest Change</h5>
              <p>The biggest change in your child's blood sugar levels occured between {change2} and {change1} minutes ago!</p>
           </div>
         </div>

         </div>

         <div class="row">

             <div class="card" style={{width: "50%"}}>
             <br/>
              <h1>Sugar level {lastHr[0]}</h1>
              <div class="card-body">
                <h5 class="card-title">Change in the Last Hour</h5>
                  <p>Over the last hour, your child's blood sugar level {lastHr[0]}d by {Math.abs(lastHr[1])}</p>
              </div>
            </div>



            <div class="card" style={{width: "50%"}}>
            <br/>
             <h1>[{lowest[0]}, {highest[0]}]</h1>
             <div class="card-body">
               <h5 class="card-title">Lowest and Highest Reading in Last 8 Hours</h5>
               <p> The lowest reading occured {(32 - lowest[1]) * 15} minutes ago while the highest reading occured {(32 - highest[1]) * 15} minutes ago. </p>
             </div>
           </div>

           </div>

               <br/>

       <div class="jumbotron" style={tips[6]}>
           <h1 class="display-4"> Tips</h1>
           <p class="lead">Your current blood reading is {tips[1]}</p>
             {tips[0] === 0 ? <img src={require("./assets/img/cute-cat.jpg")} style={{maxHeight: 250}} alt="" className="img-responsive" /> : ""}
             <p>{tips[2]} </p>
             <p>{tips[3]}</p>
             <p>{tips[4]}</p>
             <p>{tips[5]}</p>
      </div>

      <div class="container">
        <h1> Log an Event </h1>
        <form onSubmit={this.addData}>
          <div class="form-group">
            <label for="exampleFormControlInput1">Time</label>
            <input class="form-control" name="time" value={this.state.time} onChange={this.updateTime} placeholder="Enter the time which the event occured."/>
          </div>
          <div class="form-group">
            <label for="exampleFormControlInput1">Reading</label>
            <input class="form-control" name="reading" value={this.state.reading} onChange={this.updateReading} placeholder="Enter the latest reading or the reading at the time of the event."/>
          </div>
          <div class="form-group">
            <label for="exampleFormControlSelect1">Select the Event Type</label>
            <select class="form-control" name="event" value={this.state.event} onChange={this.updateEvent} id="exampleFormControlSelect1">
              <option value="Food">Food</option>
              <option value="Exercise">Exercise</option>
              <option value ="Insulin">Insulin</option>
              <option value ="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label for="exampleFormControlTextarea1">Describe the Event</label>
            <textarea class="form-control" name="info" value={this.state.info} onChange={this.updateInfo} id="exampleFormControlTextarea1" rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-lg btn-primary mr-5">Add Log</button>
          <button onClick={this.removeInfo} class="btn btn-lg btn-primary ml-5">Remove Log</button>
        </form>
      </div>

      <br/>

      <div class="row justify-content-center" style={{backgroundColor: "#563d7c", color:"black"}}>

          <div class = "container" style={{color:"white"}}>
            <br/>
            <h1> Logged Event </h1>

            <div style={{color:"black"}}>
              {iArr.map((d)=>{
                console.log(JSON.stringify(d.event));
                 return (
                   <div class="card m-3">
                   <br/>
                   <h1> {d.event} </h1>
                   {this.renderImage(d.event)}

                    <div class="card-body">
                      <h5 class="card-title">Reading at {d.time} was {d.reading}</h5>
                      <p>{d.info}</p>
                    </div>
                  </div>
                 )
               })}
            </div>
          </div>


        </div>

      </div>
    );
  }
}

export default App;
