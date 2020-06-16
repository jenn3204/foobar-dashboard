"use strict";
window.addEventListener("DOMContentLoaded", start);
import "@babel/polyfill";
import moment from "moment";
import { heroku } from "./components/js/heroku";
import { kegsStart } from "./components/js/kegs";
import { foobarUrl, beertypesUrl, orderUrl } from "./components/js/vars";

let dannieInherit = document
  .querySelector(".dannie-img")
  .getBoundingClientRect();
let dannieInheritTop = dannieInherit.top + 20 + "px";
let dannieInheritLeft = dannieInherit.left + "px";

let jonasInherit = document.querySelector(".jonas-img").getBoundingClientRect();
let jonasInheritTop = jonasInherit.top + 20 + "px";
let jonasInheritLeft = jonasInherit.left + "px";

let peterInherit = document.querySelector(".peter-img").getBoundingClientRect();
let peterInheritTop = peterInherit.top + 20 + "px";
let peterInheritLeft = peterInherit.left + "px";

function start() {
  console.log("start");
  getTap();
  kegsStart();
  orderNo();
  heroku.getData();
}
function orderNo() {
  fetch(foobarUrl, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })
    .then((res) => res.json())
    .then(orderNumber);
}

function getTap() {
  fetch(foobarUrl, {
    method: "get",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  })
    .then((res) => res.json())
    .then(tapNo);
}
//sending data from Heroku to tapNo
function tapNo(tap) {
  // console.log(tap);
  //finding the array for bartenders
  const bartenders = tap.bartenders;
  const dannie = document.querySelector(".dannie-img");
  const jonas = document.querySelector(".jonas-img");
  const peter = document.querySelector(".peter-img");

  //trying to dry it up
  bartenders.forEach((bartender) => {
    let name = bartender.name.toLowerCase();
    let bartenderHead = document.querySelector(`.${name}-img`);

    document.querySelector(`.${name}`).innerHTML =
      "Using tap <br>" + bartender.usingTap;

    if (bartender.usingTap == null) {
      bartenderHead.style.filter = "grayscale(100%)";
      document.querySelector(`.${name}`).innerHTML = "Available";
    } else {
      bartenderHead.style.filter = "grayscale(0%)";
    }

    let currentBeer = document.querySelector(`#container${bartender.usingTap}`);

    if (currentBeer) {
      let currentBeerPos = currentBeer.getBoundingClientRect();

      bartenderHead.style.position = "fixed";
      bartenderHead.style.top =
        currentBeerPos.top + currentBeerPos.height - 70 + "px";
      bartenderHead.style.left =
        currentBeerPos.left + currentBeerPos.width - 30 + "px";
    } else {
      bartenderHead.style.position = "fixed";

      if (name == "dannie") {
        document.querySelector(".dannie-img").style.top = dannieInheritTop;
        document.querySelector(".dannie-img").style.left = dannieInheritLeft;
      } else if (name == "jonas") {
        document.querySelector(".jonas-img").style.top = jonasInheritTop;
        document.querySelector(".jonas-img").style.left = jonasInheritLeft;
      } else if (name == "peter") {
        document.querySelector(".peter-img").style.top = peterInheritTop;
        document.querySelector(".peter-img").style.left = peterInheritLeft;
      }
    }
  });

  //finding usingTap in the array for each bartender
  // document.querySelector(".dannie").innerHTML =
  //   "Using tap <br>" + bartender[2].usingTap;
  // document.querySelector(".jonas").innerHTML =
  //   "Using tap <br>" + bartender[1].usingTap;
  // document.querySelector(".peter").innerHTML =
  //   "Using tap <br>" + bartender[0].usingTap;
  // //if/else statement for when the tap = null, add grayscale effect
  // if (bartender[2].usingTap == null) {
  //   dannie.style.filter = "grayscale(100%)";
  //   document.querySelector(".dannie").innerHTML = "Available";
  // } else {
  //   dannie.style.filter = "grayscale(0%)";
  // }
  // if (bartender[1].usingTap == null) {
  //   jonas.style.filter = "grayscale(100%)";
  //   document.querySelector(".jonas").innerHTML = "Available";
  // } else {
  //   jonas.style.filter = "grayscale(0%)";
  // }
  // if (bartender[0].usingTap == null) {
  //   peter.style.filter = "grayscale(100%)";
  //   document.querySelector(".peter").innerHTML = "Available";
  // } else {
  //   peter.style.filter = "grayscale(0%)";
  // }

  // //animation of heads
  // setTimeout(() => {
  //   //Dannie
  //   let dannieCurrent = document.querySelector(
  //     `#container${bartender[2].usingTap}`
  //   );

  //   if (dannieCurrent) {
  //     let currentPos = dannieCurrent.getBoundingClientRect();
  //     console.log("dannie" + dannieCurrent.offsetTop + " " + currentPos.left);

  //     document.querySelector(".dannie-img").style.position = "fixed";
  //     document.querySelector(".dannie-img").style.top =
  //       currentPos.top + currentPos.height - 70 + "px";
  //     document.querySelector(".dannie-img").style.left =
  //       currentPos.left + currentPos.width - 30 + "px";
  //   } else {
  //     document.querySelector(".dannie-img").style.position = "fixed";
  //     document.querySelector(".dannie-img").style.top = dannieInheritTop;
  //     document.querySelector(".dannie-img").style.left = dannieInheritLeft;
  //   }

  //   //Jonas
  //   let jonasCurrent = document.querySelector(
  //     `#container${bartender[1].usingTap}`
  //   );

  //   if (jonasCurrent) {
  //     let currentPos1 = jonasCurrent.getBoundingClientRect();

  //     document.querySelector(".jonas-img").style.position = "fixed";
  //     document.querySelector(".jonas-img").style.top = currentPos1.top + "px";
  //     document.querySelector(".jonas-img").style.left = currentPos1.left + "px";
  //   } else {
  //     document.querySelector(".jonas-img").style.position = "fixed";
  //     document.querySelector(".jonas-img").style.top = jonasInheritTop;
  //     document.querySelector(".jonas-img").style.left = jonasInheritLeft;
  //   }

  //   //Peter
  //   let peterCurrent = document.querySelector(
  //     `#container${bartender[0].usingTap}`
  //   );

  //   if (peterCurrent) {
  //     let currentPos2 = peterCurrent.getBoundingClientRect();

  //     document.querySelector(".peter-img").style.position = "fixed";
  //     document.querySelector(".peter-img").style.top = currentPos2.top + "px";
  //     document.querySelector(".peter-img").style.left = currentPos2.left + "px";
  //   } else {
  //     document.querySelector(".peter-img").style.position = "fixed";
  //     document.querySelector(".peter-img").style.top = peterInheritTop;
  //     document.querySelector(".peter-img").style.left = peterInheritLeft;
  //   }
  // }, 10);

  // // if (dannieCurrent !== "null") {
  // //   let where = dannieCurrent.getBoundingClientRect();
  // //   console.log("left" + where.left);
  // // }

  // // console.log(bartender[2].usingTap);
  // //setting interval to reset the data evert 10 secs
  setInterval(getTap(), 1000);
}

function orderNumber(order) {
  //fetching the queue length to order-number div
  document.querySelector(".order-number").textContent = order.queue.length;
  //setting interval to reset the data evert 5 secs
  setInterval(orderNo(), 3000);
}
