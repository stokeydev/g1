let exchangeRates = null;

const streetMap = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

const satelliteHybridMap = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
  }
);

const satelliteMap = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner-hybrid/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    subdomains: "abcd",
    ext: "png",
  }
);

const hybridMap = L.layerGroup([satelliteHybridMap, satelliteMap]);
const overlays = L.markerClusterGroup();

const baseMaps = {
  "<strong style='font-size: 16px'>Streets</strong>": streetMap,
  "<strong style='font-size: 16px'>Satellite</strong>": satelliteMap,
  "<strong style='font-size: 16px'>Hybrid</strong>": hybridMap,
};

const map = L.map("map", {
  center: [51.505, -0.09],
  zoom: 4,
  minZoom: 2,
  zoomControl: true,
  layers: [streetMap, overlays],
});
  


var airports = L.markerClusterGroup({
  polygonOptions: {
    fillColor: '#FF5733',
    color: '#000',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
}).addTo(map);

var cities = L.markerClusterGroup({
  polygonOptions: {
    fillColor: '#0000FF',
    color: '#00FFFF',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
}).addTo(map);

var hotels = L.markerClusterGroup({
  polygonOptions: {
    fillColor: '#800080',
    color: '#000',
    weight: 2,
    opacity: 1,
    fillOpacity: 0.5
  }
}).addTo(map);

var airportIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-plane',
  iconColor: 'black',
  markerColor: 'red',
  shape: 'square'
});

var cityIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-city',
  iconColor: 'black',
  markerColor: 'white',
  shape: 'square'
});

var hotelIcon = L.ExtraMarkers.icon({
  prefix: 'fa',
  icon: 'fa-hotel',
  iconColor: 'black',
  markerColor: 'white',
  shape: 'square'
});

const overlayMaps = {
  "airports": airports,
  "cities": cities,
  "hotels": hotels,
  // overlays,
};
  







L.control.layers(baseMaps, overlayMaps).addTo(map);

let countryLookup = getCountryNamesAndCodes();
let countries = null;

function getCountryNamesAndCodes() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "libs/php/getCountryData.php",

      type: "GET",

      success: function (result) {
        countries = result;
        let options = countries.map((country) => {
          return $("<option/>").attr("value", country[1]).text(country[0]);
        });

        resolve(
          countries.reduce((result, country) => {
            result[country[1]] = country[0];
            return result;
          }, {})
        );



        $(document).ready(async function () {
          // populate country select at top
          // $("#countrySelect").append(
          //   "<option default> Select Country</option>"
          // );
          $("#countrySelect").append(options);

        });
      },
    });
  });
}

function getUserLocation() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          const { latitude, longitude } = position.coords;

          // const userMarker = L.marker([latitude, longitude]).addTo(map);

          // userMarker.bindPopup("You are here!").openPopup();

          map.setView([latitude, longitude], 10);

          // Automatically open the relevant modal
          const countryCode = highlightCountryBorders(latitude, longitude);
          openModalForCountry(countryCode);

          // Automatically select the country in the dropdown
          $("#countrySelect").val(countryCode).trigger("change");

          resolve(position);
        },
        function (error) {
          console.error("Error getting user location:", error);
          reject(error);
        }
      );
    } else {
      alert("Geolocation is not available in this browser.");
      reject("Geolocation not available");
    }
  });
}

// using the Rest Countries API.
$(document).ready(function () {
  getUserLocation();

  let countryBorder;
  // Function to add marker for a country
  function addMarker(countryName, lat, lng) {
    var marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(countryName).openPopup();
  }


  // Highlight country borders based on user's location
  function highlightCountryBorders(lat, lng) {
    countryInfoFromLatLong(lat, lng).then(([countryCode]) => {
      selectCountry(countryCode);
    });
  }

  // Get user's location and highlight country borders
  getUserLocation().then((userLocation) => {
    const { latitude, longitude } = userLocation.coords;
    highlightCountryBorders(latitude, longitude);
  });



  function getUserLocation() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          function (position) {
            const { latitude, longitude } = position.coords;

            // const userMarker = L.marker([latitude, longitude]).addTo(map);

            // userMarker.bindPopup("You are here!").openPopup();

            map.setView([latitude, longitude], 10);

            // Automatically open the relevant modal
            const countryCode = highlightCountryBorders(latitude, longitude);
            openModalForCountry(countryCode);

            resolve(position);
          },
          function (error) {
            console.error("Error getting user location:", error);
            reject(error);
          }
        );
      } else {
        alert("Geolocation is not available in this browser.");
        reject("Geolocation not available");
      }
    });
  }

  
   function openModalForCountry(countryCode) {
    
   }





  globalCountryCode = null;

  // country select onchange event
  $("#countrySelect").on("change", function (event) {
    let selectedCountryCode = event.target.value;
    globalCountryCode = selectedCountryCode;

    outlineOfCountry(event.target.value)
      .then((result) => {
        const inputCoordinates = result.coordinates;
        const type = result.type;

        
        if (inputCoordinates) {
          const coordinates = [];
          inputCoordinates.map((c) => {
            coordinates.push(...c);
          });
          return { coordinates, type };
        } else {
          // console.log('Input coordinates are undefined or empty. Using default values.');
  
          return { coordinates: [], type };
        }
      })
        
      .then(({ coordinates, type }) => {
        function setCountryBorder() {
          const defaultStyle = {
            weight: 3,
            opacity: 0.3,
            color: "red",
            fillOpacity: 0.3,
          };

          if (type === "MultiPolygon") {
            countryBorder = L.geoJson({
              type: "Polygon",
              coordinates: coordinates,
            })
              .setStyle(defaultStyle)
              .addTo(map);
          } else {
            countryBorder = L.geoJson({
              type: "Polygon",
              coordinates: [coordinates],
            })
              .setStyle(defaultStyle)
              .addTo(map);
          }

          map.fitBounds(countryBorder.getBounds());
        }

        if (countryBorder === undefined) {
          setCountryBorder();
        } else {
          map.removeLayer(countryBorder);
          setCountryBorder();
        }

        if (coordinates) {
          countryLookup.then((lookup) => {
            getCountryInfo(selectedCountryCode, lookup[selectedCountryCode]);
          });
        }
      });
       

  });
});

async function outlineOfCountryJson(countryCode) {
  const response = await fetch("./libs/js/countryBorders.geo.json");
  const data = await response.json();

  let feature = data.features.find((feature) => {
    return feature?.properties?.iso_a2 === countryCode;
  });

  // Check if feature is defined before accessing its geometry property
  if (feature && feature.geometry) {
    console.log('FINDME', feature, feature.geometry);
    return feature.geometry;
  } else {
    
    console.error(`Country with code ${countryCode} not found or has no geometry.`);
    
    throw new Error(`Country with code ${countryCode} not found or has no geometry.`);
  }
}

async function outlineOfCountry(countryCode) {
  const response = await fetch("libs/php/countryInfo2.php?country_code=" + countryCode);
  const data = await response.json();

  if (data.data) {
    return data.data;
  }

  console.error(`Country with code ${countryCode} not found or has no geometry.`);
    
  throw new Error(`Country with code ${countryCode} not found or has no geometry.`);
}

function getCountryInfo(countryCode, countryName) {
  $.ajax({
    url: "libs/php/countryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      Cname: countryCode,
      countryName: countryCode,
    },
    success: function (result) {
      // console.log("AJAX request successful");
      // console.log(result);

      if (result.data) {
        var lat = result.data.lat;
        var lng = result.data.lng;
        var currencyCode = result.data.currency;

        // console.log("Latitude: " + lat);
        // console.log("Longitude: " + lng);

        // getting apis

       
        getWeather(lat, lng);

        getWikipedia(lat, lng);
        getAirports(countryCode);
        getCities(countryCode);
        getHotels(countryCode);
        //getGeonamesCountryInfo(countryCode);
        getGeonamesCountryInfo(countryCode).then((isoAlpha3) => {
          // console.log('isoalpha3: ', isoAlpha3);
        });
        getExchangeRates(countryCode, countryCode, currencyCode);
        getNewsForCountry(countryCode);
      } else {
        console.log("Data object not found in the response.");
      }
    },
    error: function (error) {
      console.log("AJAX request error:", error);
      // Handle error here
    },
  });
}

async function countryCodeToCurrencyCode(countryCode) {
  let isoalpha3 = await getGeonamesCountryInfo(countryCode);
  return isoalpha3;
}

var txtSourceAmount = 1;

const currencyCodeToName = {
  AED: "United Arab Emirates Dirham",
  AFN: "Afghan Afghani",
  ALL: "Albanian Lek",
  AMD: "Armenian Dram",
  ANG: "Netherlands Antillean Guilder",
  AOA: "Angolan Kwanza",
  ARS: "Argentine Peso",
  AUD: "Australian Dollar",
  AWG: "Aruban Florin",
  AZN: "Azerbaijani Manat",
  BAM: "Bosnia and Herzegovina Convertible Mark",
  BBD: "Barbadian Dollar",
  BDT: "Bangladeshi Taka",
  BGN: "Bulgarian Lev",
  BHD: "Bahraini Dinar",
  BIF: "Burundian Franc",
  BMD: "Bermudian Dollar",
  BND: "Brunei Dollar",
  BOB: "Bolivian Boliviano",
  BRL: "Brazilian Real",
  BSD: "Bahamian Dollar",
  BTN: "Bhutanese Ngultrum",
  BWP: "Botswanan Pula",
  BYN: "Belarusian Ruble",
  BZD: "Belize Dollar",
  CAD: "Canadian Dollar",
  CDF: "Congolese Franc",
  CHF: "Swiss Franc",
  CLP: "Chilean Peso",
  CNY: "Chinese Yuan",
  COP: "Colombian Peso",
  CRC: "Costa Rican Colón",
  CUP: "Cuban Peso",
  CVE: "Cape Verdean Escudo",
  CZK: "Czech Republic Koruna",
  DJF: "Djiboutian Franc",
  DKK: "Danish Krone",
  DOP: "Dominican Peso",
  DZD: "Algerian Dinar",
  EGP: "Egyptian Pound",
  ERN: "Eritrean Nakfa",
  ETB: "Ethiopian Birr",
  EUR: "Euro",
  FJD: "Fijian Dollar",
  FKP: "Falkland Islands Pound",
  FOK: "Faroese Króna",
  FJD: "Fijian Dollar",
  FKP: "Falkland Islands Pound",
  FOK: "Faroese Króna",
  GBP: "British Pound Sterling",
  GEL: "Georgian Lari",
  GGP: "Guernsey Pound",
  GHS: "Ghanaian Cedi",
  GIP: "Gibraltar Pound",
  GMD: "Gambian Dalasi",
  GNF: "Guinean Franc",
  GTQ: "Guatemalan Quetzal",
  GYD: "Guyanaese Dollar",
  HKD: "Hong Kong Dollar",
  HNL: "Honduran Lempira",
  HRK: "Croatian Kuna",
  HTG: "Haitian Gourde",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Sheqel",
  IMP: "Isle of Man Pound",
  INR: "Indian Rupee",
  IQD: "Iraqi Dinar",
  IRR: "Iranian Rial",
  ISK: "Icelandic Króna",
  JEP: "Jersey Pound",
  JMD: "Jamaican Dollar",
  JOD: "Jordanian Dinar",
  JPY: "Japanese Yen",
  KES: "Kenyan Shilling",
  KGS: "Kyrgystani Som",
  KHR: "Cambodian Riel",
  KID: "Kiribati Dollar",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  KYD: "Cayman Islands Dollar",
  KZT: "Kazakhstani Tenge",
  LAK: "Laotian Kip",
  LBP: "Lebanese Pound",
  LKR: "Sri Lankan Rupee",
  LRD: "Liberian Dollar",
  LSL: "Lesotho Loti",
  LYD: "Libyan Dinar",
  MAD: "Moroccan Dirham",
  MDL: "Moldovan Leu",
  MGA: "Malagasy Ariary",
  MKD: "Macedonian Denar",
  MMK: "Myanma Kyat",
  MNT: "Mongolian Tugrik",
  MOP: "Macanese Pataca",
  MRU: "Mauritanian Ouguiya",
  MUR: "Mauritian Rupee",
  MVR: "Maldivian Rufiyaa",
  MWK: "Malawian Kwacha",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  MZN: "Mozambican Metical",
  NAD: "Namibian Dollar",
  NGN: "Nigerian Naira",
  NIO: "Nicaraguan Córdoba",
  NOK: "Norwegian Krone",
  NPR: "Nepalese Rupee",
  NZD: "New Zealand Dollar",
  OMR: "Omani Rial",
  PAB: "Panamanian Balboa",
  PEN: "Peruvian Nuevo Sol",
  PGK: "Papua New Guinean Kina",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Złoty",
  PYG: "Paraguayan Guarani",
  QAR: "Qatari Rial",
  RON: "Romanian Leu",
  RSD: "Serbian Dinar",
  RUB: "Russian Ruble",
  RWF: "Rwandan Franc",
  SAR: "Saudi Riyal",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychellois Rupee",
  SDG: "Sudanese Pound",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  SHP: "Saint Helena Pound",
  SLL: "Sierra Leonean Leone",
  SOS: "Somali Shilling",
  SRD: "Surinamese Dollar",
  STN: "São Tomé and Príncipe Dobra",
  SYP: "Syrian Pound",
  SZL: "Swazi Lilangeni",
  THB: "Thai Baht",
  TJS: "Tajikistani Somoni",
  TMT: "Turkmenistani Manat",
  TND: "Tunisian Dinar",
  TOP: "Tongan Pa'anga",
  TRY: "Turkish Lira",
  TTD: "Trinidad and Tobago Dollar",
  TWD: "New Taiwan Dollar",
  TZS: "Tanzanian Shilling",
  UAH: "Ukrainian Hryvnia",
  UGX: "Ugandan Shilling",
  USD: "United States Dollar",
  UYU: "Uruguayan Peso",
  UZS: "Uzbekistan Som",
  VES: "Venezuelan Bolívar",
  VND: "Vietnamese Dong",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tala",
  XAF: "Central African CFA franc",
  XCD: "East Caribbean Dollar",
  XOF: "Central African CFA franc",
  XPF: "CFP Franc",
  YER: "Yemeni Rial",
  ZAR: "South African Rand",
  ZMW: "Zambian Kwacha",
  ZWL: "Zimbabwean Dollar",
  // Add more currency code to full name mappings here
};

 






$("#txtSourceAmount").on("change", async function(){
  let targetCurrencyCode = document.getElementById("targetCurrencySelect").value;
  let sourceCountryCode = globalCountryCode;
  let sourceCurrencyCode = await countryCodeToCurrencyCode(sourceCountryCode);
  //  console.log(sourceCountryCode);
  
  sourceCurrencyCode = sourceCurrencyCode; // Replace with your source currency code
const fullCurrencyName = currencyCodeToName[sourceCurrencyCode] || "Unknown Currency";

// console.log(fullCurrencyName);


  var sourceCurrencyUSDRate = exchangeRates[fullCurrencyName];
  if (!sourceCurrencyUSDRate) {
    throw new Error(`currency ${sourceCurrencyCode} not found`)
  }
  txtSourceAmount = $('#txtSourceAmount').val();
  var amountSourceCurrency = 1; 
  var sourceInUSD = amountSourceCurrency / sourceCurrencyUSDRate;
  var targetRate = exchangeRates[fullCurrencyName];
  if (targetRate) {
    var targetAmount = txtSourceAmount  * targetRate;
    // console.log(targetAmount);

    $("#toAmount").val(`${targetAmount.toFixed(2)} ${targetCurrencyCode}`);
    // console.log(`${amountSourceCurrency} ${sourceCurrencyCode} is equal to ${targetAmount.toFixed(2)} ${targetCurrencyCode}`);
  
    // source country name
    
    
    
   
  } else {
    throw new Error(` ${targetRate} not found`)
  }
});



// modal currency select onchange event
$("#targetCurrencySelect").on("change", async function (event) {
  try {
    let targetCurrencyCode = event.target.value;
    let sourceCountryCode = globalCountryCode;
    let sourceCurrencyCode = await countryCodeToCurrencyCode(sourceCountryCode);
       let fullCurrencyNames = "";
        // console.log(sourceCurrencyCode);

        sourceCurrencyCode = sourceCurrencyCode; // Replace with your source currency code
const fullCurrencyName = currencyCodeToName[sourceCurrencyCode] || "Unknown Currency";

// console.log(fullCurrencyName);

        





    var sourceCurrencyUSDRate = exchangeRates[fullCurrencyName];
    if (sourceCurrencyUSDRate === undefined) {
      throw new Error(`Currency ${sourceCurrencyCode} not found`);
    }

    var amountSourceCurrency = 1; 
    var sourceInUSD = amountSourceCurrency / sourceCurrencyUSDRate;

    var targetRate = exchangeRates[targetCurrencyCode];
    if (targetRate === undefined) {
      throw new Error(`Can't get rate for ${targetCurrencyCode}`);
    }

    var targetAmount = txtSourceAmount  * targetRate;

    // Set the result in the toAmount field
    $("#toAmount").val(`${targetAmount.toFixed(2)} ${targetCurrencyCode}`);

    countryLookup.then(result => { $("#txtCountry").text(result[sourceCountryCode]) });
    $("#txtSourceCurrency").text(sourceCurrencyCode);
    $("#txtExchange").text(`${txtSourceAmount} ${sourceCurrencyCode} is equal to ${targetAmount.toFixed(2)} ${targetCurrencyCode}`);
  } catch (error) {
    console.error(error);
    // Handle the error, show a user-friendly message, or take appropriate actions.
  }
});














// let exchangeRates = null;
function getExchangeRates(sourceCountryCode, sourceCountryName, currencyCode) {
  var baseCurrency = "GBP"; // Set the base currency to British Pound
  //  console.log(sourceCountryCode);
  //  console.log(sourceCountryName);
  //  console.log(currencyCode);
  //  console.log("====");

  $.ajax({
    url: "libs/php/exchangeRates.php", 
    type: "POST",
    dataType: "json",
    data: {
      //baseCurrency: baseCurrency,
      countryCode: sourceCountryCode, 
      countryName: sourceCountryName, 
    },
    success: function (result) {
      // console.log("AJAX request for exchange rates successful");
      // console.log(result);
      //console.log(sourceCountryCode, sourceCountryName, sourceCurrency)

      if (result.data) {
        // Access exchange rate data here
        exchangeRates = result.data;
        // console.log(result.data);

        // populate targetCurrencySelect
        // console.log($("#targetCurrencySelect"));

        $("#targetCurrencySelect").html(
          "<option>Select Country</option>"
        );
        // console.log(countries);

        let options2 = [];
        // console.log(exchangeRates);
        let currencyCodes = Object.keys(exchangeRates).sort();
        for (let code of currencyCodes) {
          let selected = (code == currencyCode);
          options2.push($("<option/>").attr("value", code).prop('selected', selected).text(`${code}`));
        }

        $("#targetCurrencySelect").append(options2);

      } else {
        console.log("Data object not found in the response.");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error(
        "AJAX request for exchange rates error:",
        textStatus,
        errorThrown
      );
    },
  });
}

/// Weather
function getWeather(lat, lng) {
  return new Promise((resolve, reject) => {
    let url = "libs/php/weather.php";
    $.ajax({
      url: url,
      method: "POST",
      
      data: {
        lat: lat,
        lng: lng,
      },

      dataType: "json",
      success: resolve,
      error: reject,
    });
  }).then((response) => {
    let data = response.data.current;
    const current = response.data.forecast.forecastday[0];
    const day1 = response.data.forecast.forecastday[1];
    const day2 = response.data.forecast.forecastday[2];

    const day1Date = new Date(day1.date);
    const day2Date = new Date(day2.date);

    // console.log("weather", response);

    $('#todayConditions').text(current.day.condition.text);
    $('#todayIcon').attr('src', current.day.condition.icon);
    $('#todayMaxTemp').text(Math.round(current.day.maxtemp_c) + '°C');
    $('#todayMinTemp').text(Math.round(current.day.mintemp_c) + '°C');

    $('#day1Date').text(day1Date.toLocaleDateString('en-GB', { weekday: 'short', 'day': 'numeric' }));
    $('#day1Icon').attr('src', day1.day.condition.icon);
    $('#day1MaxTemp').text(Math.round(day1.day.maxtemp_c) + '°C');
    $('#day1MinTemp').text(Math.round(day1.day.mintemp_c) + '°C');

    $('#day2Date').text(day2Date.toLocaleDateString('en-GB', { weekday: 'short', 'day': 'numeric' }));
    $('#day2Icon').attr('src', day2.day.condition.icon);
    $('#day2MaxTemp').text(Math.round(day2.day.maxtemp_c) + '°C');
    $('#day2MinTemp').text(Math.round(day2.day.mintemp_c) + '°C');

    $("#txtClouds").text((+data.clouds).toFixed(0) + "%");
    $("#txtDT").text(new Date(data.dt * 1000));
    
    let celcius = +data.temp - 273.15;
    let fahrenheit = (celcius * 9) / 5 + 32;
    $("#txtTemperature").text(
      celcius.toFixed(1) + "°C" + " (" + fahrenheit.toFixed(1) + " F)"
    );
    $("#txtHumidity").text((+data.humidity).toFixed(0) + "%");
  });
}


function getAirports(countryCode) {
  $.ajax({
    url: "libs/php/airportInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      // console.log(JSON.stringify(result));


      if (result.status.code == 200) {
        


        result.data.forEach(function (item) {
         
          L.marker([item.lat, item.lng], { icon: airportIcon })
            .bindTooltip(item.name, { direction: 'top', sticky: true })
            .addTo(airports);

        })

      } else {

        showToast("Error retrieving airport data", 4000, false);

      }

    },

    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}

//get cities
function getCities(countryCode) {
  $.ajax({
    url: "libs/php/getCities.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result.status.code == 200) {
        result.data.forEach(function (item) {
          L.marker([item.lat, item.lng], { icon: cityIcon })
            .bindTooltip(item.name, { direction: 'top', sticky: true })
            .addTo(cities);
        });
      } else {
        showToast("Error retrieving airport data", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}

//get hotels
function getHotels(countryCode) {
  $.ajax({
    url: "libs/php/getHotels.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: countryCode,
    },
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result.status.code == 200) {
        result.data.forEach(function (item) {
          L.marker([item.lat, item.lng], { icon: hotelIcon })
            .bindTooltip(item.name, { direction: 'top', sticky: true })
            .addTo(hotels);
        });
      } else {
        showToast("Error retrieving airport data", 4000, false);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}

function getWikipedia(incoming_latitude, incoming_longitude) {
  $.ajax({
    url: "libs/php/Wikipedia.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: incoming_latitude,
      lng: incoming_longitude,
    },
    success: function (result) {
      // console.log(JSON.stringify(result));
      if (result.status.name === "ok") {
        const data = result.data.geonames[0]; 
        $("#txtSummary").html(data?.summary ?? "");

        $("#txtTitle").html(data?.title ?? "");
        let url = data?.wikipediaUrl ?? "";
        
        if (url.substr(0, 2) !== "//" && url.indexOf(":") < 0) url = "//" + url;

        // Create a link element with target="_blank"
        let link = $("<a/>").attr("href", url).attr("target", "_blank").text(url);

        // Append the link to the element with id "txtWU"
        $("#txtWU").empty().append(link);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("AJAX error:", textStatus, errorThrown);
    },
  });
}

map.on("click", (event) => {
  // console.log("map click", event);
  countryInfoFromLatLong(event.latlng.lat, event.latlng.lng).then(
    ([countryCode, info]) => {
      // console.log("country info", countryCode);
      selectCountry(countryCode);
    }
  );
});

var geojsonData = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        "city ": "Glasgow",
        region: "north lanakshire",
      },
      geometry: {
        coordinates: [-4.255901553292944, 55.87424672838188],
        type: "Point",
      },
      id: 0,
    },
  ],
};

function countryInfoFromLatLong(lat, lng) {
  let url =
    "https://nominatim.openstreetmap.org/reverse" +
    "?lat=" +
    encodeURIComponent(+lat) +
    "&lon=" +
    encodeURIComponent(+lng) +
    "&format=json";

  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: resolve,
      error: reject,
    });
  }).then((addressInfo) => {
    return [addressInfo.address?.country_code?.toUpperCase(), addressInfo];
  });
}

function selectCountry(countryCode) {
  $("#countrySelect").val(countryCode).trigger("change");
}

// Easy Buttons
L.easyButton("fa-circle-info fa-xl", function (btn, map) {
  $("#modal1").modal("show");
}).addTo(map);
// Btn-1

L.easyButton("fa-wallet fa-xl", function (btn, map) {
  $("#modal2").modal("show");
}).addTo(map);
// Btn-2

// Button for opening WEATHER modal
L.easyButton("fa-cloud fa-xl", function (btn, map) {
  $("#modal3").modal("show");
}).addTo(map);



// Button for opening WIKIPEDIA modal
L.easyButton("fa-w fa-xl", function (btn, map) {
  $("#modal5").modal("show");
}).addTo(map);

// Button for opening NEWS modal
L.easyButton("fa-newspaper fa-xl", function (btn, map) {
  $("#newsModal").modal("show");
}).addTo(map);

function getGeonamesCountryInfo(countryCode) {
  let url = "libs/php/getCountryInfo.php";

  return new Promise((resolve, reject) => {
    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      data: {
        countryCode: countryCode,
      },
      success: resolve,
      error: reject,
    });
  })
    .then((response) => {
      // console.log(response);
      let data = response.data.geonames[0];
      $("#txtArea").text(
        (+data?.areaInSqKm).toLocaleString() + " km²"
      );
      $("#txtPopulation").text(
        (+data?.population).toLocaleString() ?? ""
      );
      $("#txtLanguages").text(data?.languages ?? "");
      $("#txtCapital").text(data?.capital ?? "");
      $("#txtContinent").text(data?.continent);
      return data.currencyCode;
    })
    .catch((err) => {
      console.log("geonames country info error", err);
    });
}






// Populate news modal
function getNewsForCountry(countryCode) {
  $.ajax({
      url: "libs/php/news.php",
      type: "POST",
      dataType: "json",
      data: {
        countryCode: countryCode,
      },
      success: function (data) {
          if (data.status.code === "200" && data.data.articles.length > 0) {
            // console.log('NEWS PROCESS');

            const newsTemplate = `<div class="newsItem mb-4">
                <h5 class="fw-bold">{{newsTitle}}</h5>
                <p class="lead">{{newsSummary}}</p>
                <div class="row">
                    <div class="col-6">
                        <a href="{{newsLink}}">
                          <img src="{{newsImg}}" alt="News image" class="img-fluid">
                        </a>
                    </div>
                    <div class="col-6">
                        <a href="{{newsLink}}" target="_blank">Read More</a>
                    </div>
                </div>
              </div>`;

            const newsItems = data.data.articles.map(function (article) {
              let item = String(newsTemplate);
              item = item.replaceAll('{{newsTitle}}', article.title || '')
              item = item.replaceAll('{{newsSummary}}', article.description || '');
              item = item.replaceAll('{{newsLink}}', article.url || '#');
              item = item.replaceAll('{{newsImg}}', article.urlToImage || 'placeholder.png');
              
              return item;
            });

            $('#theNEWS').html(newsItems.join("\r\n"));
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("AJAX error:", textStatus, errorThrown);
      },
  });
}
