import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";
import InputLabel from "@material-ui/core/InputLabel";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardAvatar from "components/Card/CardAvatar.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";

import avatar from "assets/img/faces/nadir.jpg";

import firebase from "firebase/app";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyC2h9JcfucVwd12Ud4ejL7pQj6eeC37J-8",
  authDomain: "diaband-78956.firebaseapp.com",
  databaseURL: "https://diaband-78956.firebaseio.com",
  projectId: "diaband-78956",
  storageBucket: "diaband-78956.appspot.com",
  messagingSenderId: "105285075120"
};

var fire = firebase.initializeApp(config);


const styles = {
  cardCategoryWhite: {
    color: "rgba(255,255,255,.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitleWhite: {
    color: "#FFFFFF",
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none"
  }
};



function UserProfile(props) {

  let about;

  const state = {
    role: 'PROFESSOR/FACULTY',
    name: 'Nadir Weibel',
    history: "I am an Associate Research Professor in the Department of Computer Science and Engineering at UC San Diego, and a Research Health Science Specialist at the VA San Diego Health System. My work on Human-Centered Computing is situated at the intersection of computer science, cognitive science and the health sciences. I am a computer scientist who investigates tools, techniques and infrastructure supporting the deployment of innovative interactive multimodal and tangible devices in context, and an ethnographer using novel methods for studying and quantifying the cognitive consequences of the introduction of this technology in the everyday life.",
  }


  const { classes } = props;

  function handleSubmit(e) {
      e.preventDefault();

      const info = {
        role: state.role,
        name: state.name,
        history: state.history
      }

    }

  return (

    <div>
      <GridContainer>
        <GridItem xs={12} sm={12} md={8}>
          <Card>
            <CardHeader color="primary">
              <h4 className={classes.cardTitleWhite}>Change Profile</h4>
              <p className={classes.cardCategoryWhite}>Complete your profile</p>
            </CardHeader>
            <CardBody>

              <GridContainer>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Label"
                    id="label"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <CustomInput
                    labelText="Full Name"
                    id="full-name"
                    formControlProps={{
                      fullWidth: true
                    }}
                  />
                </GridItem>
              </GridContainer>
              <GridContainer>
                <GridItem xs={12} sm={12} md={12}>
                  <InputLabel style={{ color: "#AAAAAA" }}>Diabetes History</InputLabel>
                  <CustomInput
                    labelText="Have had diabetes since birth and have been looking for new ways to track blood sugar levels without constant pricking."
                    id="about-me"
                    formControlProps={{
                      fullWidth: true
                    }}
                    inputProps={{
                      multiline: true,
                      rows: 5
                    }}
                  />
                </GridItem>
              </GridContainer>
            </CardBody>
            <CardFooter>
              <Button color="primary" onClick={() => { state.role = document.getElementById("label").value; state.name = document.getElementById("full-name").value; state.history = document.getElementById("about-me").value; }}>Change State</Button>
              <Button color="primary" onClick={() => { document.getElementById("userrole").innerHTML = state.role; document.getElementById("username").innerHTML = state.name; document.getElementById("userhistory").innerHTML = state.history;}}>Update State</Button>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={4}>
          <Card profile>
            <CardAvatar profile>
              <a href="#pablo" onClick={e => e.preventDefault()}>
                <img src={avatar} alt="..." />
              </a>
            </CardAvatar>
            <CardBody profile>
              <h6 id="userrole" className={classes.cardCategory}>{state.role}</h6>
              <h4 id="username" className={classes.cardTitle}>{state.name}</h4>
              <p id="userhistory" className={classes.description}>
                {state.history}

              </p>
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}

export default withStyles(styles)(UserProfile);
