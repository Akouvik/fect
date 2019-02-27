const url = "https://dog.ceo/api/breed/pomeranian/images/random/50";

window.onload = get_pomeranian;
const imgPerPage = 10;

function render_pomeranians(data, currentPageNumber) {
  let response = data.message;
  let image_container = document.getElementById("image_container");
  image_container.innerHTML = "";

  let startIndex = imgPerPage * currentPageNumber; //0,10,20,30,40
  let endIndex = imgPerPage * (currentPageNumber + 1) - 1;

  for (let i = startIndex; i <= endIndex; i++) {
    let img = document.createElement("img");
    img.src = response[i];
    img.alt = "Cute pomeranian";
    image_container.appendChild(img);
  }
}

function get_pomeranian() {
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      try {
        let data = JSON.parse(xmlhttp.responseText);
        render_pomeranians(data, 0);
        img_navigation(data);
      } catch (err) {
        console.log(
          "we encountered an error",
          err.message + " in " + xmlhttp.responseText
        );
        return;
      }
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

function img_navigation(data) {
  let buttons = document.getElementsByClassName("btn");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      let current = document.getElementsByClassName("active");
      current[0].className = current[0].className.replace("active", "");
      buttons[i].className += " active";
      render_pomeranians(data, i);
    });
  }
}
