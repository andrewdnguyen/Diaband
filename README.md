# Diaband
Team 3 Project for CSE 218/118 at UC San Diego, Fall Quarter 2018.

## Getting Started
### Hardware
To run this project you will need one or more devices capable of running 
node and npm. In addition to this, one of the devices must be a [Raspberry Pi 3+](https://www.raspberrypi.org) with a [NFC module](https://www.itead.cc/wiki/ITEAD_PN532_NFC_MODULE) connected through I2C. 
For details on how to do this please go to this [page](https://www.itead.cc/blog/raspberry-pi-drives-itead-pn532-nfc-module-with-libnfc). **Note:** This assumes the pi is already set-up with some form of operating system and SSD card.

### Software
This project is separated into two applications, where the `sensor-pi` app is designed to run on the Raspberry Pi connected to the NFC module. The `web-pi` app can actually run on any device as long as it is connected to the same access point as the Raspberry Pi. 

The first step for both devices is to download and install both node and npm from this [site](https://nodejs.org/en/download/). The project is currently running on **Node version 9.9.0**. After node is installed, install the newest version of [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) on both devices and clone the repository to both. Finally make sure both of the devices are connected to the same wi-fi access point if you are indeed using two.

Next, navigate to the `sensor-pi` folder on the Raspberry Pi and open up the terminal. Then type `npm install` followed by `npm start`. The Pi is now done!

Now for the last part, start up the other device and navigate to the `web-pi` folder and open up the terminal or commandline. Then similarily to the Pi, run the command `npm install` followed by `npm start`. Before you start, make sure that the `endpoint` in `web-pi/src/app.js` is the IP address belonging to the Raspberry, if you are running both apps on the same device the `endpoint` should point to localhost.

And that's it! When you accsess the React App running on your second device you should see whatever data is picked up by the nfc nodule on the Raspberry Pi.
