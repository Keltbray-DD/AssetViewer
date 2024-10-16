const projectID = "b.71ff72dd-8834-4510-9042-1df3fd9d2cd1";
let catID = 5;
let accessToken; //= "eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIl0sImNsaWVudF9pZCI6IlVNUElvRmM4aVFvSjJlS1M2R3NKYkNHU21NYjRzMVBZIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoieGpXanp0elM3U3JyRnAzTTZSdFB3MFBwU3A3Tm00aldLcUJ4WnN1WkVzaWd5VVJyQXZRaGpzNmJtU0lWSU9GdyIsImV4cCI6MTcyOTA3OTg5MCwidXNlcmlkIjoiWlJDSjMyVVJLWTQ4OUFYUSJ9.Wc9Jo-PN6zaQOamtgw6jyTF8n10JVo3wYWjBNdhgArbTyhwVpJKBfS2eFHDYvpcQeXzXQtgsr61P710j9UtiKZ6j762YTPutgAZUG3a9VnZDItISuThV4eCYxMx9QX9mZGaHLj0IuLENH7dRHfhMNcEsA9cOZaTkGxbqCCatXUdxVmwIc397gqbLuIfOI2jM3CgNxCu6wNdKFkj8snUz11s_C8zmzrH7Y6i61tu2vbjoAF-YRSFAm58YKaaSuBtT78t5hL5tc8mX195lsqzkbQ7ykMqiue0YsFoMuefu7n15a67L1LE9XFzCB0zcsUuzKFZYnQGjBnuQvP-vUooLvw"
let customAttributeList;
let assetRawList;
let assetList = [];
let assetListUpdated = [];
let excel_MIDP_Filename = "ACC_Training_Project_Asset_Data";

const routesData = [
    {
        name: "East Coast Main Line (ECML)",
        color: "blue",
        coordinates: [
            [51.5308, -0.1236],  // London King's Cross
            [52.0616, -0.1971],  // Stevenage
            [52.5806, -0.2425],  // Peterborough
            [52.9067, -0.6425],  // Grantham
            [53.0809, -0.8093],  // Newark North Gate
            [53.5229, -1.1358],  // Doncaster
            [53.9576, -1.0827],  // York
            [54.5231, -1.5552],  // Darlington
            [54.7763, -1.5768],  // Durham
            [54.9783, -1.6174],  // Newcastle
            [55.7710, -2.0067],  // Berwick-upon-Tweed
            [55.9533, -3.1883]   // Edinburgh
        ]
    },
    {
        name: "West Coast Main Line (WCML)",
        color: "green",
        coordinates: [
            [51.5281, -0.1337],  // London Euston
            [52.0416, -0.7558],  // Milton Keynes
            [52.3791, -1.2654],  // Rugby
            [52.4080, -1.5106],  // Coventry
            [52.4797, -1.9020],  // Birmingham
            [52.5862, -2.1283],  // Wolverhampton
            [52.8055, -2.1164],  // Stafford
            [53.0989, -2.4415],  // Crewe
            [53.3891, -2.6025],  // Warrington
            [53.5455, -2.6324],  // Wigan
            [53.7632, -2.7031],  // Preston
            [54.0483, -2.8019],  // Lancaster
            [54.8951, -2.9390],  // Carlisle
            [55.8580, -4.2590]   // Glasgow Central
        ]
    },
    {
        name: "Great Western Main Line (GWML)",
        color: "red",
        coordinates: [
            [51.5152, -0.1759],  // London Paddington
            [51.4591, -0.9711],  // Reading
            [51.6097, -1.2435],  // Didcot Parkway
            [51.5640, -1.7776],  // Swindon
            [51.4612, -2.1195],  // Chippenham
            [51.3813, -2.3576],  // Bath Spa
            [51.4505, -2.5833],  // Bristol Temple Meads
            [51.5842, -2.9984],  // Newport
            [51.4788, -3.1780],  // Cardiff Central
            [51.6208, -3.9462]   // Swansea
        ]
    },
    {
        name: "Midland Main Line (MML)",
        color: "orange",
        coordinates: [
            [51.5296, -0.1269],  // London St Pancras
            [51.8796, -0.4172],  // Luton
            [52.1364, -0.4686],  // Bedford
            [52.3022, -0.7031],  // Wellingborough
            [52.3975, -0.7259],  // Kettering
            [52.6329, -1.1321],  // Leicester
            [52.7674, -1.2046],  // Loughborough
            [52.9548, -1.1581],  // Nottingham
            [52.9230, -1.4751],  // Derby
            [53.3811, -1.4700]   // Sheffield
        ]
    },
    {
        name: "CrossCountry Route (XC)",
        color: "purple",
        coordinates: [
            [50.1182, -5.5371],  // Penzance
            [50.7263, -3.5375],  // Exeter St Davids
            [51.4505, -2.5833],  // Bristol Temple Meads
            [52.4780, -1.8989],  // Birmingham New Street
            [52.9225, -1.4746],  // Derby
            [53.3811, -1.4700],  // Sheffield
            [53.7965, -1.5479],  // Leeds
            [53.9576, -1.0827],  // York
            [54.9783, -1.6174],  // Newcastle
            [55.9533, -3.1883],  // Edinburgh
            [55.8580, -4.2590]   // Glasgow
        ]
    },
    {
        name: "TransPennine Route (TPX)",
        color: "darkblue",
        coordinates: [
            [53.4084, -2.9916],  // Liverpool Lime Street
            [53.3925, -2.5962],  // Warrington Central
            [53.4769, -2.2314],  // Manchester Piccadilly
            [53.6490, -1.7842],  // Huddersfield
            [53.7944, -1.5476],  // Leeds
            [53.9576, -1.0827],  // York
            [54.9783, -1.6174]   // Newcastle
        ]
    },
    {
        name: "Brighton Main Line (BML)",
        color: "darkgreen",
        coordinates: [
            [51.4952, -0.1447],  // London Victoria
            [51.4647, -0.1705],  // Clapham Junction
            [51.3758, -0.0931],  // East Croydon
            [51.1569, -0.1616],  // Gatwick Airport
            [50.9964, -0.1036],  // Haywards Heath
            [50.8284, -0.1395]   // Brighton
        ]
    },
    {
        name: "West of England Main Line",
        color: "cyan",
        coordinates: [
            [51.5034, -0.1136],  // London Waterloo
            [51.3195, -0.5584],  // Woking
            [51.2657, -1.0876],  // Basingstoke
            [51.2101, -1.4816],  // Andover
            [51.0700, -1.7937],  // Salisbury
            [50.7293, -3.5339],  // Exeter St Davids
            [50.3772, -4.1427]   // Plymouth
        ]
    },
    {
        name: "Chiltern Main Line",
        color: "pink",
        coordinates: [
            [51.5222, -0.1635],  // London Marylebone
            [51.6300, -0.7482],  // High Wycombe
            [52.0604, -1.3409],  // Banbury
            [52.2855, -1.5334],  // Leamington Spa
            [52.2819, -1.5873],  // Warwick
            [52.4797, -1.8989],  // Birmingham Moor Street
            [52.4814, -1.8955]   // Birmingham Snow Hill
        ]
    },
    {
        name: "Anglia Main Line (Great Eastern Main Line)",
        color: "yellow",
        coordinates: [
            [51.5175, -0.0812],  // London Liverpool Street
            [51.5378, -0.0036],  // Stratford
            [51.7360, 0.4766],   // Chelmsford
            [51.8915, 0.9037],   // Colchester
            [52.0588, 1.1482],   // Ipswich
            [52.6309, 1.2974]    // Norwich
        ]
    }
];


start();


// Store the initial view settings for the map
const initialLat = 54.5;
const initialLng = -3.5;
const initialZoom = 6;

// Initialize the map and set its view to the initial latitude and longitude
const map = L.map("map").setView([initialLat, initialLng], initialZoom); // Default view over the UK

// Define different tile layers (Terrain, Satellite, Street, etc.)

// OpenStreetMap standard tile layer (default)
const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
}).addTo(map); // Add it by default to the map

// Google Satellite tile layer
const satelliteLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: '© Google'
});
const hybridLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
    maxZoom: 19,
    attribution: '© Google'
});
const googleTerrainLayer = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
    maxZoom: 18,
    attribution: '© Google'
});

// Add a control to switch between layers
const baseLayers = {
    "Street Map": osmLayer,
    "Satellite": satelliteLayer,
    "Terrain": googleTerrainLayer,
    "Hybrid":hybridLayer,
};

L.control.layers(baseLayers).addTo(map); // Add layer control to the map

// Object to hold the polyline objects by route name
const polylines = {};

// Create polylines from route data and store them in the 'polylines' object
routesData.forEach(route => {
    const polyline = L.polyline(route.coordinates, { color: route.color });
    polylines[route.name] = polyline;
    polyline.addTo(map); // Add to the map initially
});
console.log(routesData)
// Create a custom control to toggle routes
const customControl = L.Control.extend({
    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.padding = '10px';

        // Add checkboxes for each route dynamically from the array
        container.innerHTML = `<h4>Routes</h4>`;
        routesData.forEach((route, index) => {
            const routeId = `route${index+1}Checkbox`;
            // container.innerHTML += `
            //     <label>
            //         <input type="checkbox" id="${routeId}" checked> ${route.name}
            //     </label><br>
            // `;

            // Attach event listener for each checkbox to toggle the route
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = routeId;
            checkbox.checked = true;
            checkbox.addEventListener('change', function() {
                toggleRoute(route.name, this.checked);
            });
            const label = document.createElement('li');
            
            label.innerHTML = ` <label>
                         ${route.name}
                    </label>`
                    label.appendChild(checkbox)   
            container.appendChild(label)

            // Append the checkbox to the container
            // container.querySelector(`#${routeId}`).addEventListener('change', function() {
            //     toggleRoute(route.name, this.checked);
            // });
        });

        return container;
    }
});

// Add the custom control to the map
map.addControl(new customControl({ position: 'topright' }));

// Function to toggle the visibility of a route (polyline)
function toggleRoute(routeName, isVisible) {
    console.log(routeName)
    if (isVisible) {
        polylines[routeName].addTo(map);
    } else {
        map.removeLayer(polylines[routeName]);
    }
}




async function start() {
  // Call the function to plot all assets
  await createAssetList();
  await plotAssetsOnMap(assetListUpdated);
}

// Add reset button functionality to zoom back to the initial view
document.getElementById("resetButton").addEventListener("click", function () {
  map.setView([initialLat, initialLng], initialZoom, { animate: true }); // Reset to initial view
});

// Function to create markers for each asset and handle asset list clicks
async function plotAssetsOnMap(array) {
  array.forEach(async (asset) => {
    let assetItem = document.createElement("div"); // Create the list item for the asset
    assetItem.classList.add("asset-item");

    if (asset.Postcode !== "NULL") {
      // If the asset has a valid postcode, geocode it
      let convertedData = await getCoordinatesUK(asset.Postcode);

      if (convertedData) {
        // Create a marker at the asset's location
        let marker = L.marker([convertedData.lat, convertedData.lng]).addTo(
          map
        );

        // Bind popup with asset information
        marker.bindPopup(`
                    <strong>${asset["Site Name"]}</strong><br>
                    ${asset["Postcode"]}<br>
                    <a href="https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${convertedData.lat},${convertedData.lng}" target="_blank">
                        Open Street View
                    </a>
                `);

        // Populate the sidebar item with the asset details
        assetItem.innerHTML = `
                    <strong>${asset["Site Name"]}</strong><br>
                    ${asset["Postcode"]}
                `;

        assetItem.addEventListener("mouseout", function () {
          marker.closePopup(); // Close popup when not hovering
        });

        // Click functionality to pan and zoom the map to the marker
        assetItem.addEventListener("click", function () {
          // Set the map view to the marker's location, zoom level 15 for closer zoom
          map.setView([convertedData.lat, convertedData.lng], 15, {
            animate: true,
          });
          setTimeout(() => marker.openPopup(), 300); // Delay opening the popup to allow zoom animation

          // Display more details in the right-side panel
          showDetailsPanel(asset); // Pass the clicked asset's data to the details panel
        });
      } else {
        console.error(`Could not geocode postcode: ${asset.Postcode}`);
        greyOutAssetItem(assetItem, asset); // Grey out the asset if no geocode data is available
      }
    } else {
      greyOutAssetItem(assetItem, asset); // Grey out the asset if no postcode is available
    }

    // Append the asset item to the sidebar list regardless of validity
    document.getElementById("assets").appendChild(assetItem);
  });
}

// Helper function to grey out assets without valid postcodes
function greyOutAssetItem(assetItem, asset) {
  assetItem.innerHTML = `
        <strong>${asset["Site Name"]}</strong><br>
        Location not available
    `;
  assetItem.style.color = "#888"; // Greyed out text color
  assetItem.style.backgroundColor = "#f0f0f0"; // Light grey background
  assetItem.style.cursor = "not-allowed"; // Change cursor to indicate non-clickable
}
document.addEventListener('DOMContentLoaded',async function(){
    let detailsPanel = document.getElementById('detailsPanel');
    let resizeHandle = document.getElementById('resizeHandle');
    let closeDetails = document.getElementById('closeDetails');
    let isResizing = false;



    // Close the details panel
    closeDetails.addEventListener('click', function() {
        detailsPanel.style.right = '-60vw'; // Hide the panel by sliding it out
        adjustLayerControlPosition(0); // Move the control back to default position
    });

    // JavaScript for resizable panel
    resizeHandle.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'ew-resize'; // Change cursor while resizing
    });

    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;

        // Calculate new width based on mouse movement
        let newWidth = window.innerWidth - e.clientX;
        if (newWidth > 200 && newWidth < window.innerWidth * 0.5) { // Set min and max width
            detailsPanel.style.width = newWidth + 'px';
        }
        adjustLayerControlPosition(newWidth); // Adjust the layer control position
    });

    document.addEventListener('mouseup', function() {
        isResizing = false;
        document.body.style.cursor = ''; // Reset cursor after resizing
    });

    // Sample function that gets triggered when an asset is clicked
    function onAssetClick(asset) {
        // Call showDetailsPanel with the asset's data
        showDetailsPanel(asset);
    }
})
// Function to adjust the position of the layer control
function adjustLayerControlPosition(panelWidth) {
    const controlContainer = document.querySelector('.leaflet-control-layers'); // Get the control container
    if (controlContainer) {
        controlContainer.style.right = panelWidth ? `${panelWidth +30}px` : '10px'; // Adjust based on panel width
    }
}
// Show the details panel with asset information
function showDetailsPanel(asset) {
  // Populate the details panel with information from the selected asset
  const detailsContent = document.getElementById("detailsContent");
  detailsContent.innerHTML = `
    <strong>Site Name:</strong> ${asset["Site Name"]}<br>
    <strong>Postcode:</strong> ${asset["Postcode"]}<br>
    <strong>Category ID:</strong> ${asset["categoryId"]}<br>
    <strong>Asset ID:</strong> ${asset["assetId"]}<br>
    <strong>Frequency:</strong> ${asset["Frequency"]}<br>
    <strong>Region:</strong> ${asset["Region"]}<br>
    <strong>Route:</strong> ${asset["Route"]}<br>
    <strong>ELR:</strong> ${asset["ELR"]}<br>
    <strong>Mileage:</strong> ${asset["Mileage"]}<br>
    <strong>Operator:</strong> ${asset["Operator"]}<br>
    <strong>Area:</strong> ${asset["Area"]}<br>
    <strong>Banding:</strong> ${asset["Banding"]}<br>
    <strong>Percentage Complete:</strong> ${asset["Percentage Complete"]}<br>
    <strong>NR Status:</strong> ${asset["NR Status"]}<br>
    <strong>Examiner:</strong> ${asset["Examiner"]}<br>
    <strong>Line Block:</strong> ${asset["Line Block"]}<br>
    <strong>Site Tolerance Date (earliest):</strong> ${asset["Site Tolerance Date (earliest)"]}<br>
    <strong>Required Exam Site Date:</strong> ${asset["Required Exam Site Date"]}<br>
    <strong>Requested Site Tolerance Date (latest):</strong> ${asset["Requested Site Tolerance Date (latest)"]}<br>
    <strong>Baseline Date:</strong> ${asset["Baseline Date"]}<br>
    <strong>Works Started on-site Date:</strong> ${asset["Works Started on-site Date"]}<br>
    <strong>Completion on-site Date:</strong> ${asset["Completion on-site Date"]}<br>
    <strong>Date exam becomes over 28 Days:</strong> ${asset["Date exam becomes over 28 Days"]}<br>
    <strong>Date Ready for STE2 Checks:</strong> ${asset["Date Ready for STE2 Checks"]}<br>
    <strong>Planned Submission Date:</strong> ${asset["Planned Submission Date"]}<br>
`;
const panelWidthPx = vwToPx(30); // Convert panel width from vw to pixels
    adjustLayerControlPosition(panelWidthPx);
  // Slide the details panel in from the right
  document.getElementById("detailsPanel").style.right = "0";
}

// Close the details panel
document.getElementById("closeDetails").addEventListener("click", function () {
  document.getElementById("detailsPanel").style.right = "-60vw"; // Hide the panel off-screen
});
function vwToPx(vw) {
    return (vw / 100) * window.innerWidth;
}
// Function to filter and search through the asset list
function searchAssets() {
  // Get the value from the search bar
  let searchValue = document.getElementById("searchBar").value.toLowerCase();

  // Get all the asset items in the asset list
  let assetItems = document.querySelectorAll("#assets .asset-item");

  // Loop through all asset items and hide or show based on the search query
  assetItems.forEach(function (item) {
    // Get the text content of each asset item (e.g., site name and postcode)
    let itemText = item.textContent.toLowerCase();

    // If the item text includes the search value, show the item; otherwise, hide it
    if (itemText.includes(searchValue)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

async function getCoordinatesUK(postcode) {
  let location;
  let lat;
  let lng;
  let apiUrl = `https://api.postcodes.io/postcodes/${encodeURIComponent(
    postcode
  )}/nearest`;
  console.log(apiUrl);
  try {
    let response = await fetch(apiUrl);
    let data = await response.json();

    if (data.status === 200) {
      location = data.result[0];
      lat = location.latitude;
      lng = location.longitude;

      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      return { lat: lat, lng: lng };
    } else {
      console.error("Postcode not found");
      apiUrl = `https://api.postcodes.io/terminated_postcodes/${encodeURIComponent(
        postcode
      )}`;
      response = await fetch(apiUrl);
      data = await response.json();
      location = data.result;
      lat = location.latitude;
      lng = location.longitude;

      console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      return { lat: lat, lng: lng };
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

async function createAssetList() {
  accessToken = await get3LegToken();
  customAttributeList = await getCustomAttributeDetails();
  assetArray = await getAssets();
  assetRawList = assetArray;
  const lookup = {};
  customAttributeList.results.forEach((item) => {
    lookup[item.name] = item.displayName;
  });
  assetRawList.forEach((element) => {
    tempObject = {
      assetId: element.id,
      categoryId: element.categoryId,
      ...element.customAttributes,
    };
    assetList.push(tempObject);
  });
  assetListUpdated = assetList.map((obj) => {
    let newObj = {};

    Object.keys(obj).forEach((key) => {
      if (lookup[key]) {
        // Replace the key with the displayName
        newObj[lookup[key]] = obj[key];
      } else {
        // Keep the key as is if not found in the lookup
        newObj[key] = obj[key];
      }
    });

    return newObj;
  });

  console.log("Asset List:", assetListUpdated);

  //uploadtoSP(assetListUpdated,excel_MIDP_Filename)
}
async function get3LegToken() {
  const bodyData = {};

  const headers = {
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "GET",
    headers: headers,
    //body: JSON.stringify(bodyData)
  };

  const apiUrl = `https://prod-26.uksouth.logic.azure.com:443/workflows/477a403e5c7345bf9dc3eaa77599a3eb/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=tY2VJt9GRJAxUMI_DNm2b-Np0VHAUQm9lChOHEyLABw`;
  //console.log(apiUrl)
  //console.log(requestOptions)
  responseData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const JSONdata = data;

      console.log("SP Response accessToken:", JSONdata);

      return JSONdata.accessToken;
    })
    .catch((error) => console.error("Error fetching data:", error));

  return responseData;
}
async function getCustomAttributeDetails() {
  const bodyData = {};

  const headers = {
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "GET",
    headers: headers,
    //body: JSON.stringify(bodyData)
  };

  const apiUrl = `https://developer.api.autodesk.com/bim360/assets/v1/projects/${projectID}/custom-attributes`;
  //console.log(apiUrl)
  //console.log(requestOptions)
  responseData = await fetch(apiUrl, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const JSONdata = data;

      console.log("ACC Response CustomAttributesList:", JSONdata);

      return JSONdata;
    })
    .catch((error) => console.error("Error fetching data:", error));

  return responseData;
}

async function getAssets() {
  const headers = {
    Authorization: "Bearer " + accessToken,
    "Content-Type": "application/json",
  };

  let apiUrl = `https://developer.api.autodesk.com/construction/assets/v2/projects/${projectID}/assets?filter[categoryId]=${catID}&includeCustomAttributes=true`;
  let allResults = []; // Array to hold all results across paginated requests

  // Loop to fetch all paginated data
  while (apiUrl) {
    try {
      const requestOptions = {
        method: "GET",
        headers: headers,
      };

      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      // Add current page results to the total results
      allResults = allResults.concat(data.results);

      // Check if a nextUrl is present, and if so, update the apiUrl to the nextUrl
      if (data.pagination && data.pagination.nextUrl) {
        apiUrl = data.pagination.nextUrl;
      } else {
        apiUrl = null; // No more pages
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      break; // Stop on error
    }
  }

  console.log("ACC Response allAssets:", allResults);
  return allResults; // Return in the same structure as the previous version
}

async function uploadtoSP(array, fileName) {
  const bodyData = {
    fileName: fileName,
    inputArray: array,
  };

  const headers = {
    //'Authorization':'Bearer '+access_token,
    "Content-Type": "application/json",
  };

  const requestOptions = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(bodyData),
  };
  const apiUrl =
    "https://prod-08.uksouth.logic.azure.com:443/workflows/936465390a80402abf0aab45f1bdc322/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=iQojsSUmBSNp-QpfEBvMN8WZrciGJXdLQNdduJWMpvY";
  //console.log(requestOptions)
  await fetch(apiUrl, requestOptions);
}

// Modal functionality
const modal = document.getElementById("assetModal");
const toggleButton = document.getElementById("toggleButton");
const closeModal = document.getElementById("closeModal");

// Toggle the modal when the button is clicked
toggleButton.addEventListener("click", () => {
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
  toggleButton.textContent =
    modal.style.display === "flex" ? "Hide Asset List" : "Show Asset List";
});

// Close the modal when the close (X) is clicked
closeModal.addEventListener("click", () => {
  modal.style.display = "none";
  toggleButton.textContent = "Show Asset List";
});


