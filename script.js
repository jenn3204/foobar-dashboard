"use strict";
window.addEventListener("DOMContentLoaded", start);
import "@babel/polyfill";
import moment from "moment";
import { heroku } from "./components/js/heroku";
import { kegsStart } from "./components/js/kegs";
import { foobarUrl, beertypesUrl, orderUrl } from "./components/js/vars";

function start() {
  console.log("start");

  heroku.getData(orderNumber);
  heroku.getData(tapNo);
  kegsStart();
  heroku.getData();

  //calling the checkScreenSize function to set the height of the background svgs and then calls this function everytime the screensize changes
  checkScreensize();
  window.addEventListener("resize", checkScreensize);
}

function checkScreensize() {
  // this function is added to improve responsivity, as the background svgs are 100vw width, the height needs to match the width at every screen size
  const bg = document.querySelector(".dashboard_background");
  const statusBg = document.querySelector("#status_background");

  if (window.innerWidth > window.innerHeight) {
    bg.style.height = (window.innerWidth / 1282) * 568 + "px";
    statusBg.style.height = (window.innerWidth / 1280) * 162 + "px";
  } else {
    bg.style.height = (window.innerWidth / 796) * 967 + "px";
  }
  console.log(window.innerWidth + bg.style.height + statusBg.style.height);
}

//sending data from Heroku to tapNo
function tapNo(tap) {
  // console.log(tap);
  //finding the array for bartenders
  const bartenders = tap.bartenders;

  //looping through the array of bartenders
  bartenders.forEach((bartender) => {
    let name = bartender.name.toLowerCase();
    let bartenderHead = document.querySelector(`.${name}-img`);

    // putting the right text and number at each of the bartenders, to show which tap theyre using or if they are not using a tap
    document.querySelector(`.${name}`).innerHTML =
      "Using tap <br>" + bartender.usingTap;

    if (bartender.usingTap == null) {
      bartenderHead.style.filter = "grayscale(100%)";
      document.querySelector(`.${name}`).innerHTML = "Available";
    } else {
      bartenderHead.style.filter = "grayscale(0%)";
    }

    // the currentBeer is the beer with the a container with the id matcking this id
    let currentBeer = document.querySelector(`#container${bartender.usingTap}`);
    let currentBeerTap = document.querySelector(
      `#container${bartender.usingTap} .keg_tap`
    );

    if (currentBeer) {
      // if the bartender is using a tap, his head moves to the position of the tap
      let currentBeerPos = currentBeer.getBoundingClientRect();

      bartenderHead.style.bottom =
        window.innerHeight - currentBeerPos.top - currentBeerPos.height + "px";
      bartenderHead.style.left =
        currentBeerPos.left + currentBeerPos.width - 30 + "px";

      bartenderHead.style.transform = "scale(1.2)";
    } else {
      // if the bartender is not using a tap, remove the js elemt.style/dont give any
      bartenderHead.style = "";
    }
  });

  //calling getData function every second to keef the data updated
  setInterval(heroku.getData(tapNo), 1000);
}

function orderNumber(order) {
  //fetching the queue length to order-number div
  document.querySelector(".order-number").textContent = order.queue.length;
  //setting interval to reset the data every second
  setInterval(heroku.getData(orderNumber), 1000);
}
