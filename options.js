document.addEventListener("DOMContentLoaded", () => {
  const productiveSitesList = document.getElementById("productiveSites");
  const unproductiveSitesList = document.getElementById("unproductiveSites");
  const newProductiveSiteInput = document.getElementById("newProductiveSite");
  const newUnproductiveSiteInput = document.getElementById(
    "newUnproductiveSite"
  );
  const addProductiveSiteButton = document.getElementById("addProductiveSite");
  const addUnproductiveSiteButton = document.getElementById(
    "addUnproductiveSite"
  );
  const saveButton = document.getElementById("saveSettings");
  const statusMessage = document.getElementById("statusMessage");

  let productiveSites = [];
  let unproductiveSites = [];

  // Load saved sites
  chrome.storage.sync.get(
    ["productiveSites", "unproductiveSites"],
    (result) => {
      if (chrome.runtime.lastError) {
        showStatus(
          "Error loading settings: " + chrome.runtime.lastError.message,
          "error"
        );
      } else {
        productiveSites = result.productiveSites || [];
        unproductiveSites = result.unproductiveSites || [];
        renderSites();
        showStatus("Settings loaded successfully", "success");
      }
    }
  );

  function renderSites() {
    productiveSitesList.innerHTML = "";
    unproductiveSitesList.innerHTML = "";

    renderSiteList(productiveSites, productiveSitesList, true);
    renderSiteList(unproductiveSites, unproductiveSitesList, false);
  }

  function renderSiteList(sites, listElement, isProductive) {
    sites.forEach((site) => {
      const li = document.createElement("li");
      li.textContent = site;
      const removeButton = document.createElement("button");
      removeButton.textContent = "Remove";
      removeButton.onclick = () => removeSite(site, isProductive);
      li.appendChild(removeButton);
      listElement.appendChild(li);
    });
  }

  function addSite(site, isProductive) {
    site = site.trim().toLowerCase();
    if (site && isValidUrl(site)) {
      if (isProductive) {
        if (!productiveSites.includes(site)) {
          productiveSites.push(site);
          showStatus(`Added ${site} to productive sites`, "success");
        } else {
          showStatus(`${site} is already in productive sites`, "info");
        }
      } else {
        if (!unproductiveSites.includes(site)) {
          unproductiveSites.push(site);
          showStatus(`Added ${site} to unproductive sites`, "success");
        } else {
          showStatus(`${site} is already in unproductive sites`, "info");
        }
      }
      renderSites();
    } else {
      showStatus("Please enter a valid URL", "error");
    }
  }

  function removeSite(site, isProductive) {
    if (isProductive) {
      productiveSites = productiveSites.filter((s) => s !== site);
      showStatus(`Removed ${site} from productive sites`, "success");
    } else {
      unproductiveSites = unproductiveSites.filter((s) => s !== site);
      showStatus(`Removed ${site} from unproductive sites`, "success");
    }
    renderSites();
  }

  function isValidUrl(string) {
    try {
      new URL(string.startsWith("http") ? string : "http://" + string);
      return true;
    } catch (_) {
      return false;
    }
  }

  function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = type;
    setTimeout(() => {
      statusMessage.textContent = "";
      statusMessage.className = "";
    }, 3000);
  }

  addProductiveSiteButton.onclick = () => {
    addSite(newProductiveSiteInput.value, true);
    newProductiveSiteInput.value = "";
  };

  addUnproductiveSiteButton.onclick = () => {
    addSite(newUnproductiveSiteInput.value, false);
    newUnproductiveSiteInput.value = "";
  };

  saveButton.onclick = () => {
    chrome.storage.sync.set({ productiveSites, unproductiveSites }, () => {
      if (chrome.runtime.lastError) {
        showStatus(
          "Error saving settings: " + chrome.runtime.lastError.message,
          "error"
        );
      } else {
        showStatus("Settings saved successfully", "success");
      }
    });
  };
});
