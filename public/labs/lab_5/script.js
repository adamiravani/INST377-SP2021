function mapInit() {
  // follow the Leaflet Getting Started tutorial here
  const mymap = L.map("mapid").setView([38.9898, -76.9378], 13);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYWRhbWlyYXZhbmkiLCJhIjoiY2ttNGtzb3pnMDVodTJ3cXNiZnMydGRwayJ9.yNmGysNLAaN6KaQWj6PH-A",
    {
      maxZoom: 18,
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
    }
  ).addTo(mymap);
  // console.log("mymap", mymap);
  return mymap;
}

async function dataHandler(mapFromLeaflet) {
  // use your assignment 1 data handling code here
  // and target mapObjectFromFunction to attach markers
  const form = document.querySelector("#search-form");
  const search = document.querySelector("#search");
  const input = document.querySelector("input");
  const targetList = document.querySelector(".targetList");
  const request = await fetch("/api");
  const data = await request.json();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const value = input.value;
    if (!value) {
      input.dataset.state = "";
      return;
    }

    const trimmed = value.trim();

    if (trimmed) {
      input.dataset.state = "valid";
      const filtered = data.filter(
        (record) =>
          record.zip.includes(search.value) && record.geocoded_column_1
      );
      const topFive = filtered.slice(0, 5);
      console.table(topFive);
      length = Object.keys(topFive).length;
      if (0 < length) {
        topFive.forEach((item) => {
          const longLat = item.geocoded_column_1.coordinates;
          console.log("markerLongLat", longLat[0], longLat[1]);
          const marker = L.marker([longLat[1], longLat[0]]).addTo(
            mapFromLeaflet
          );
          const appendItem = document.createElement("li");
          appendItem.classList.add("block");
          appendItem.classList.add("list-item");
          appendItem.innerHTML = `<div class="list-header is size-5">${item.name}</div><address class="is-size-6">${item.address_line_1}</address>`;
          targetList.append(appendItem);
        });
        console.log("this is topFive", topFive);
        return topFive;
      } else {
        const appendItem = document.createElement("li");
        appendItem.classList.add("block");
        appendItem.classList.add("list-item");
        appendItem.innerHTML = `<div class="list-header is size-5">There are no results in this zip code.</div>`;
        targetList.append(appendItem);
      }
    } else {
      input.dataset.state = "invalid";
      const appendItem = document.createElement("li");
      appendItem.classList.add("block");
      appendItem.classList.add("list-item");
      appendItem.innerHTML = `<div class="list-header is size-5">Please enter a valid zip code.</div>`;
      targetList.append(appendItem);
    }
  });
    //const pan = topFive[0];
    //let latLngs = pan.geocoded_column_1;
    //console.log(latLngs)
    //mymap.panTo(markersById[markerId].getLatLng());
    // my failed failed attempt at getting a pan to work correctly
}


async function windowActions() {
  const mymap = mapInit();
  await dataHandler(mymap);
  move()
}

window.onload = windowActions;
