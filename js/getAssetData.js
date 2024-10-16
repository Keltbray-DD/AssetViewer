const projectID = "b.71ff72dd-8834-4510-9042-1df3fd9d2cd1";
let catID = 5;
let accessToken; //= "eyJhbGciOiJSUzI1NiIsImtpZCI6IlhrUFpfSmhoXzlTYzNZS01oRERBZFBWeFowOF9SUzI1NiIsInBpLmF0bSI6ImFzc2MifQ.eyJzY29wZSI6WyJkYXRhOnJlYWQiLCJkYXRhOndyaXRlIiwiZGF0YTpjcmVhdGUiLCJhY2NvdW50OnJlYWQiLCJhY2NvdW50OndyaXRlIl0sImNsaWVudF9pZCI6IlVNUElvRmM4aVFvSjJlS1M2R3NKYkNHU21NYjRzMVBZIiwiaXNzIjoiaHR0cHM6Ly9kZXZlbG9wZXIuYXBpLmF1dG9kZXNrLmNvbSIsImF1ZCI6Imh0dHBzOi8vYXV0b2Rlc2suY29tIiwianRpIjoieGpXanp0elM3U3JyRnAzTTZSdFB3MFBwU3A3Tm00aldLcUJ4WnN1WkVzaWd5VVJyQXZRaGpzNmJtU0lWSU9GdyIsImV4cCI6MTcyOTA3OTg5MCwidXNlcmlkIjoiWlJDSjMyVVJLWTQ4OUFYUSJ9.Wc9Jo-PN6zaQOamtgw6jyTF8n10JVo3wYWjBNdhgArbTyhwVpJKBfS2eFHDYvpcQeXzXQtgsr61P710j9UtiKZ6j762YTPutgAZUG3a9VnZDItISuThV4eCYxMx9QX9mZGaHLj0IuLENH7dRHfhMNcEsA9cOZaTkGxbqCCatXUdxVmwIc397gqbLuIfOI2jM3CgNxCu6wNdKFkj8snUz11s_C8zmzrH7Y6i61tu2vbjoAF-YRSFAm58YKaaSuBtT78t5hL5tc8mX195lsqzkbQ7ykMqiue0YsFoMuefu7n15a67L1LE9XFzCB0zcsUuzKFZYnQGjBnuQvP-vUooLvw"
let customAttributeList;
let assetRawList;
let assetList = [];
let assetListUpdated = [];
let excel_MIDP_Filename = "ACC_Training_Project_Asset_Data";

start();


// Store the initial view settings for the map
const initialLat = 54.5;
const initialLng = -3.5;
const initialZoom = 6;

// Initialize the map and set its view to the initial latitude and longitude
const map = L.map("map").setView([initialLat, initialLng], initialZoom); // Default view over the UK

async function start() {
  // Call the function to plot all assets
  await createAssetList();
  await plotAssetsOnMap(assetListUpdated);
}

// Add OpenStreetMap tiles
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "© OpenStreetMap",
}).addTo(map);

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
                    ${asset["Postcode"]}
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

  // Slide the details panel in from the right
  document.getElementById("detailsPanel").style.right = "0";
}

// Close the details panel
document.getElementById("closeDetails").addEventListener("click", function () {
  document.getElementById("detailsPanel").style.right = "-60vw"; // Hide the panel off-screen
});

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


