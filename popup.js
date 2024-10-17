document.addEventListener("DOMContentLoaded", function () {
  const statusElement = document.getElementById("status");
  const openSettingsButton = document.getElementById("openSettings");

  function updateStatus() {
    chrome.runtime.sendMessage({ action: "getStatus" }, function (response) {
      // Check for runtime errors
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError);
        statusElement.innerHTML =
          '<p class="error">Error: Could not fetch status. Please try again later.</p>';
        return;
      }

      // If no response received
      if (!response) {
        statusElement.innerHTML =
          '<p class="error">Error: No response from background script. Please check your extension.</p>';
        return;
      }

      // Display the status information if everything works fine
      let statusHTML = `
        <p><strong>Currently on:</strong> ${
          response.currentSite || "Unknown"
        }</p>
        <p>
          <strong>This site is considered:</strong> 
          <span class="${
            response.isProductive ? "productive" : "unproductive"
          }">
            ${response.isProductive ? "Productive" : "Unproductive"}
          </span>
        </p>
      `;

      if (!response.isProductive) {
        statusHTML += `<p><strong>Unproductive time:</strong> ${response.unproductiveTime} minutes</p>`;
      }

      statusElement.innerHTML = statusHTML;
    });
  }

  // Call the updateStatus function initially and also set it to refresh every 5 seconds
  updateStatus();
  const intervalId = setInterval(updateStatus, 5000);

  // Clear the interval when the popup is closed to avoid memory leaks
  window.addEventListener("unload", function () {
    clearInterval(intervalId);
  });

  // Open the options/settings page when the button is clicked
  openSettingsButton.addEventListener("click", function () {
    try {
      // Open the settings page
      chrome.runtime.openOptionsPage(function () {
        if (chrome.runtime.lastError) {
          console.error(
            "Error opening options page:",
            chrome.runtime.lastError
          );
          alert(
            "Could not open the settings page. Please check if the page is correctly set in manifest."
          );
        }
      });
    } catch (e) {
      console.error("Unexpected error:", e);
      alert("An unexpected error occurred while opening the options page.");
    }
  });
});
