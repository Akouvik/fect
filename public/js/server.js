window.onload = (function() {
  let url = "https://dog.ceo/api/breed/pomeranian/images/random/50";
  let breedStore = {}; //store result
  const imgPerPage = 10;
  let input = document.getElementById("input");
  //get pomeranians on load and store the results
  get_pomeranian(url, xmlResponse => (breedStore["pomeranian"] = xmlResponse));

  input.addEventListener("click", favoriteBreed);

  //check if a breed in entered
  function favoriteBreed() {
    input.value = "";
    input.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        let breed = input.value;
        event.preventDefault();
        //check if the breed is availabl in storage
        if (breed in breedStore) {
          render_pomeranians(breedStore[breed], 0);
          img_navigation(breedStore[breed]);
        } else {
          //if not call getPome to make an api call and store the result in store
          url = `https://dog.ceo/api/breed/${breed}/images/random/50`;
          get_pomeranian(url, xmlResponse => {
            breedStore[breed] = xmlResponse;
          });
          // console.log("breed", breedStore);
        }
      }
    });
  }

  //api call
  function get_pomeranian(url, cb) {
    let xmlhttp = new XMLHttpRequest();
    let response;
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        try {
          let data = JSON.parse(xmlhttp.responseText);
          response = data.message.slice(0);
          //0 is the first page number
          render_pomeranians(response, 0);
          img_navigation(response);

          //send back the result to be stored
          if (cb) cb(response);
        } catch (err) {
          console.log(
            "we encountered an error",
            err.message + " in " + xmlhttp.responseText
          );
          return;
        }
      } else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
        alert("breed not found");
        console.log("Not found", xmlhttp.responseText);
        return;
      } else {
        return;
      }
    };

    xmlhttp.open("GET", url, true);

    xmlhttp.send();
  }

  //button and arrow click handling
  function img_navigation(response) {
    let i = 0;
    let buttons = document.getElementsByClassName("btn");
    let arrow = document.getElementsByClassName("arrow");
    let current = document.getElementsByClassName("active");

    //navigate with arrows
    for (let j = 0; j < arrow.length; j++) {
      arrow[j].addEventListener("click", e => {
        e.preventDefault();
        // console.log("i", i);

        if (arrow[j].classList[1] == "right") {
          //check if we are on the 5th page if not increase i
          if (i < buttons.length - 1) {
            i += 1;
            current[0].className = current[0].className.replace("active", "");
            buttons[i].className += " active";
            render_pomeranians(response, i);
          }
          return;
        } else {
          if (i > 0) {
            i -= 1;
            current[0].className = current[0].className.replace("active", "");
            buttons[i].className += " active";
            render_pomeranians(response, i);
          }
          return;
        }
      });
    }
    // navigate by clicking on numbers
    for (let k = 0; k < buttons.length; k++) {
      // console.log("k", k);

      buttons[k].addEventListener("click", e => {
        e.preventDefault();
        //to synch the arrow click event and the button click event
        i = k;
        current[0].className = current[0].className.replace("active", "");
        buttons[k].className += " active";
        render_pomeranians(response, k);
      });
    }
  }

  function render_pomeranians(response, currentPageNumber) {
    // let response = data.message.slice(0);
    let imageContainer = document.getElementById("imageContainer");

    //clear the img display div
    imageContainer.innerHTML = "";

    let startIndex = imgPerPage * currentPageNumber; //0,10,20,30,40
    let endIndex = imgPerPage * (currentPageNumber + 1) - 1;

    for (let i = startIndex; i <= endIndex; i++) {
      let img = document.createElement("img");
      img.classList.add("response_img");
      img.addEventListener("click", openModal);
      img.src = response[i];
      img.alt = "Cute pomeranian";
      imageContainer.appendChild(img);
    }
  }
  function openModal(e) {
    e.preventDefault();
    document.getElementById("modImg").src = e.srcElement.currentSrc;
    let modal = document.getElementById("modal");
    modal.style.display = "block";
    let close = document.getElementById("closeModal");
    modal.addEventListener("click", e => {
      e.preventDefault();
      modal.style.display = "none";
      document.getElementById("modImg").src = "";
    });
    close.addEventListener("click", () => {
      modal.style.display = "none";
      document.getElementById("modImg").src = "";
    });
  }
})();
