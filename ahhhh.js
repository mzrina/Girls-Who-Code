// USING CHECKBOXES //
var zomato_key = "41ed66d99a210899ae3e1da817f06d16";

var bobaCode = 247;
var dessertCode = 100;
var fastCasualCode = 285;
var fineDiningCode = 18;
var vegetarianCode = 308;
var healthyFoodCode = 143;

var cuisineCodes = [];
var estCodes = [];
var locations = [];
var myResults = [];
var myRatings = [];

// Detecting checkbox checks:
//https://stackoverflow.com/questions/6878757/how-to-listen-to-when-a-checkbox-is-checked-in-jquery/6878786
var checkboxes , checkboxArray;
var allCodes = {"bubble tea": bobaCode, "desserts": dessertCode,
                "vegetarian": vegetarianCode, "healthy food": healthyFoodCode};
var allLocations = ["San Francisco", "Daly City", "Burlingame", "Millbrae", "San Bruno", "Redwood City", "Palo Alto", "Sunnyvale", "San Jose"];
var allEstablishments = {"fast casual dining": fastCasualCode, "fine dining": fineDiningCode};
var allRatings = ["five stars", "four stars", "three stars", "two stars", "one star"];

function confirmCheck() {
  if (this.checked) {
    // alert('checked');
    // alert(this.value);

    var val = this.value;
    val = val.replace(/\_/g, " ");

    console.log(val);

    // collect all checked locations
    if (allLocations.includes(val)) {
      locations.push(val);
      console.log(locations);
      getResults();
    }
    // see if the string is in our allCodes dictionary
    else if (Object.keys(allCodes).includes(val)) {
      cuisineCodes.push(allCodes[val]);
      console.log(cuisineCodes);
      getResults();
    }
    else if (Object.keys(allEstablishments).includes(val)) {
      estCodes.push(allEstablishments[val]);
      console.log(estCodes);
      getResults();
    }
    else if (allRatings.includes(val)) {
      myRatings.push(val);
      console.log(myRatings);
      // if (allLocations.length > 0) {
      sortByRating();

    }
  }
}

function getCheckboxes() {
  checkboxes = document.querySelectorAll('input[type=checkbox]');
  checkboxArray = Array.from( checkboxes );

  checkboxArray.forEach(function(checkbox) {
    checkbox.addEventListener('change', confirmCheck);
  });

  console.log(checkboxes);
}



function getBubbleTea(bob) {
  resultsDiv.innerHTML =""
  //var resultsDiv = document.getElementById("results");

  bob = bob.replace(/ /g, "%20");

  var reqURL = "https://developers.zomato.com/api/v2.1/cuisines?";
  reqURL = reqURL + "q=" + bob;

  console.log(reqURL);

}

function getDesserts(des) {
  resultsDiv.innerHTML = ""

  des = des.replace(/ /g, "%20");

  var reqURL = "https://developers.zomato.com/api/v2.1/cuisines?";
  reqURL = reqURL + "q=" + des;

  console.log(reqURL);
}

function getFastCasualDining(cas) {
  resultsDiv.innerHTML = ""

  cas = cas.replace(/ /g, "%20");

  var reqURL = "https://developers.zomato.com/api/v2.1/establishments?";
  reqURL = reqURL + "q=" + cas;

  console.log(reqURL);
}

function getVegetarian(veg) {
  resultsDiv.innerHTML = ""

  veg = veg.replace(/ /g, "%20");

  var reqURL = "https://developers.zomato.com/api/v2.1/cuisines?";
  reqURL = reqURL + "q=" + veg;

  console.log(reqURL);
}

function getHealthyFood(hea) {
  resultsDiv.innerHTML = ""

  hea = hea.replace(/ /g, "%20");

  var reqURL = "https://developers.zomato.com/api/v2.1/establishments?";
  reqURL = reqURL + "q=" + hea;

  console.log(reqURL);
}

function getResults() {
  locations.forEach(function(loc) {
    var city_id = getLocations(loc);
    // console.log(city_id);
  });
}

function getLocations(loc) {


  var resultsDiv = document.getElementById("results");

  resultsDiv.innerHTML =""

  loc = loc.replace(/ /g, "%20");

  var reqURL = "https://developers.zomato.com/api/v2.1/cities?";
  reqURL = reqURL + "q=" + loc;

  console.log(reqURL);

  var city_id = 306;




  $.ajax({
        url: reqURL,
        beforeSend: function(xhr) {
             xhr.setRequestHeader("user-key", zomato_key);
        }, success: function(data){
            // console.log(data);
            // get the city ID from the result
            city_id = data["location_suggestions"][0]["id"];
            // boba_id = data["location_suggestions"][0]["id"];

            var reqURL = "https://developers.zomato.com/api/v2.1/search?";
            reqURL = reqURL + "entity_id=" + city_id + "&entity_type=city";


            // append any cuisine codes
            reqURL = reqURL + "&cuisines=";

            cuisineCodes.forEach(function(c) {
                reqURL = reqURL + c + ",";
            });

            // append any establishment ids
            reqURL = reqURL + "&establishment_type=";

            estCodes.forEach(function(c) {
                reqURL = reqURL + c + ",";
            });


            myRatings.forEach(function(rest) {
              reqURL = reqURL + rest + ",";
            });


            console.log(reqURL);

            $.ajax({
                  url: reqURL,
                  beforeSend: function(xhr) {
                       xhr.setRequestHeader("user-key", zomato_key);
                  }, success: function(data){
                      // console.log(data);
                      // get restaurants array
                      var all_rest = data["restaurants"];
                      // console.log(all_rest);
                      //console.log(all_rest[0]);
                      // var address = all_rest[0]["restaurant"]["location"]["address"];
                      // alert(name + " at " + address);

                      all_rest.forEach(function(rest) {
                      var result = document.createElement("p");
                      result.innerHTML = rest["restaurant"]["name"] + " at "
                          + rest["restaurant"]["location"]["address"];
                      resultsDiv.append(result);
                      });
                  }
            });
        }
  });

  return city_id;
}

function sortByRating() {
    myResults.forEach(function(rest) {
      var rating = rest["restaurant"]["user_rating"]["aggregate_rating"];
      rating = Math.round(rating);
      // console.log("new: " + rating);

      var reqURL = "https://developers.zomato.com/api/v2.1/restaurant/user_rating/aggregate_rating?";
      reqURL = reqURL + "q=" + rest;
      console.log(reqURL);

      myRatings.forEach(function(stars) {
       // console.log(stars);
       if (rating >= stars && rating < (stars + 0.5)) {
      console.log(rest["restaurant"]["name"] + " at "
             + rest["restaurant"]["location"]["address"]);
         }
       });
    });
  }


// do this when the document is ready -- happens BEFORE window load
// $(document).ready(getCheckboxes());
window.onload = getCheckboxes;
