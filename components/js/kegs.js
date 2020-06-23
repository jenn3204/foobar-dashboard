import { heroku } from "./heroku";
const regeneratorRuntime = require("regenerator-runtime");

export function kegsStart() {
  // calling the function to fetch the heroku data and send it to dataForSvgs
  heroku.getData(dataForSvgs);

  function dataForSvgs(data) {
    // calling the function to fetch the svg files, the keg svg and the tap svg and send it to place function
    getSvg("svg/only-keg.svg", placeKegs, data);
    getSvg("svg/only-keg-tap.svg", placeTaps, data);
  }

  async function getSvg(file, callback, data) {
    // fetching svg files
    let response = await fetch(file);
    let svg = await response.text();
    callback(svg, data);
  }

  function placeKegs(svg, data) {
    // calling the placeKegsSvg function for each tap
    let taps = data.taps;
    taps.forEach((tap) => {
      createKegs(svg, tap.id);
    });
  }

  function createKegs(svg, number) {
    // creating an article for each keg/tap
    let kegContainer = document.createElement("article");
    kegContainer.classList.add("keg");
    kegContainer.id = "container" + number;
    document.querySelector("#kegs_container").appendChild(kegContainer);

    // creating the div that contains the number of the tap
    let kegNumber = document.createElement("div");
    kegNumber.classList.add("keg_number");
    kegNumber.textContent = number;
    kegContainer.appendChild(kegNumber);

    // creating a div to contain the svg and placing the svg in it
    let kegSVG = document.createElement("div");
    kegSVG.classList.add("svg_container");
    kegSVG.id = "keg" + number;
    kegSVG.innerHTML = svg;
    kegContainer.appendChild(kegSVG);

    // creating the div to show the storage
    let kegStorage = document.createElement("div");
    kegStorage.classList.add("storage");
    kegStorage.id = "storage" + number;
    kegContainer.appendChild(kegStorage);

    // create the img tag for the beer label
    let kegImage = document.createElement("img");
    kegImage.classList.add("beer_label");
    kegImage.id = "image" + number;
    kegImage.alt = "beer keg" + number;
    kegContainer.appendChild(kegImage);
  }

  function placeTaps(svg, data) {
    // calling the placeTapssSvg function for each tap
    let taps = data.taps;
    taps.forEach((tap) => {
      placeTapsSvg(svg, tap.id);
    });
  }

  function placeTapsSvg(svg, number) {
    let kegContainer = document.querySelector(`#container${number}`);

    // creating a div to contain the tap svg and placing the svg in it
    let kegTap = document.createElement("div");
    kegTap.classList.add("keg_tap");
    kegTap.innerHTML = svg;
    kegContainer.appendChild(kegTap);

    heroku.getData(dataForKegs);
    setInterval(() => {
      heroku.getData(dataForKegs);
    }, 1000);
  }

  function dataForKegs(data) {
    //this function receives the data and then calls a function to also fetch the beertypes data, as we need both
    heroku.getBeertypeData(allData, data);
  }

  function allData(data, beertypeData) {
    // this function receives all the data, cleans the needed data and calls the createKeg function for each tap with the needed data/parameters
    let taps = data.taps;
    taps.forEach((tap) => {
      let storage = data.storage;
      let storageFilter = storage.filter(function (storage) {
        return storage.name == tap.beer;
      });

      let category = beertypeData.filter(function (beertypeData) {
        return beertypeData.name == tap.beer;
      });

      showData(
        tap.id,
        tap.beer,
        storageFilter[0].amount,
        tap.level,
        category[0].category
      );
    });
  }

  function showData(number, beertype, storage, level, category) {
    // putting the right image in the img tag

    let kegIMG = document.querySelector(`#image${number}`);
    let beerLower = beertype.toLowerCase();
    let beerArray = beerLower.split(" ");

    if (beerArray.length < 2) {
      kegIMG.src = "beers_images_compressed/" + beerArray[0] + ".png";
    } else if (beerArray.length == 2) {
      kegIMG.src =
        "beers_images_resized/" + beerArray[0] + beerArray[1] + ".png";
    } else if (beerArray.length == 3) {
      kegIMG.src =
        "beers_images_resized/" +
        beerArray[0] +
        beerArray[1] +
        beerArray[2] +
        ".png";
    }
    kegIMG.alt = beertype;

    // show the storage in the storage div
    document.querySelector(`#storage${number}`).textContent = storage;

    // adding a class with transition on the beer in the keg
    document
      .querySelector(`#keg${number} #Rectangle_174`)
      .classList.add("beer_trans");
    document
      .querySelector(`#keg${number} #Rectangle_173`)
      .classList.add("beer_trans");

    // if the storage is 0 the number should be blinking red to alarm the staff that they are running out of beer
    if (storage == "0") {
      document
        .querySelector(`#storage${number}`)
        .classList.add("blinking_red_color");
    }

    // these if's changes the height of the "beer" in the keg svg to make it show the level/how much beer is in the keg
    if (level > 2000) {
      document.querySelector(`#keg${number} #Rectangle_174`).style.height =
        "120";
      document.querySelector(`#keg${number} #Rectangle_174`).style.y = "50";
      document.querySelector(`#keg${number} #Rectangle_173`).style.height =
        "157.88";
      document.querySelector(`#keg${number} #Rectangle_173`).style.y = "113.28";
      document
        .querySelector(`#keg${number} #Rectangle_172`)
        .classList.remove("blinking_red");
    }

    if (level < 2000 && level > 1500) {
      document.querySelector(`#keg${number} #Rectangle_174`).style.y = "100";
      document.querySelector(`#keg${number} #Rectangle_174`).style.height =
        "100";
      document.querySelector(`#keg${number} #Rectangle_173`).style.height =
        "140";
      document.querySelector(`#keg${number} #Rectangle_173`).style.y = "140";
      document
        .querySelector(`#keg${number} #Rectangle_172`)
        .classList.remove("blinking_red");
    }

    if (level < 1500 && level > 1000) {
      document.querySelector(`#keg${number} #Rectangle_174`).style.y = "150";
      document.querySelector(`#keg${number} #Rectangle_174`).style.height =
        "70";
      document.querySelector(`#keg${number} #Rectangle_173`).style.height =
        "100";
      document.querySelector(`#keg${number} #Rectangle_173`).style.y = "170";
      document
        .querySelector(`#keg${number} #Rectangle_172`)
        .classList.remove("blinking_red");
    }

    if (level < 1000 && level > 200) {
      document.querySelector(`#keg${number} #Rectangle_174`).style.y = "180";
      document.querySelector(`#keg${number} #Rectangle_174`).style.height =
        "40";
      document.querySelector(`#keg${number} #Rectangle_173`).style.height =
        "90";
      document.querySelector(`#keg${number} #Rectangle_173`).style.y = "180";
      document
        .querySelector(`#keg${number} #Rectangle_172`)
        .classList.remove("blinking_red");
    }

    if (level < 200) {
      document.querySelector(`#keg${number} #Rectangle_174`).style.height = "0";
      document.querySelector(`#keg${number} #Rectangle_174`).style.y = "270";
      document.querySelector(`#keg${number} #Rectangle_173`).style.height = "0";
      document.querySelector(`#keg${number} #Rectangle_173`).style.y = "270";
      document
        .querySelector(`#keg${number} #Rectangle_172`)
        .classList.add("blinking_red");
    }

    // these if's changes the color of the "beer" in the keg svg to reflect the type of beer
    if (category == "IPA") {
      document.querySelector(`#keg${number} #Rectangle_174`).style.fill =
        "#6D2D20";
      document.querySelector(`#keg${number} #Rectangle_173`).style.fill =
        "#6D2D20";
      document.querySelector(`#keg${number} #Path_126`).style.fill = "#6D2D20";
    }
    if (category == "Oktoberfest" || category == "European Lager") {
      document.querySelector(`#keg${number} #Rectangle_174`).style.fill =
        "#BF820F";
      document.querySelector(`#keg${number} #Rectangle_173`).style.fill =
        "#BF820F";
      document.querySelector(`#keg${number} #Path_126`).style.fill = "#BF820F";
    }
    if (category == "Stout") {
      document.querySelector(`#keg${number} #Rectangle_174`).style.fill =
        "black";
      document.querySelector(`#keg${number} #Rectangle_173`).style.fill =
        "black";
      document.querySelector(`#keg${number} #Path_126`).style.fill = "black";
    }
    if (category == "California Common") {
      document.querySelector(`#keg${number} #Rectangle_174`).style.fill =
        "#BF7245";
      document.querySelector(`#keg${number} #Rectangle_173`).style.fill =
        "#BF7245";
      document.querySelector(`#keg${number} #Path_126`).style.fill = "#BF7245";
    }
  }
}
