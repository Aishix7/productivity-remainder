let unproductiveTime = 0; // in minutes
let currentSite = "";
let isProductive = true;
let lastUpdateTime = Date.now();
let isPaused = false;
let activeTabId = null;
let notificationInterval = null;

chrome.tabs.onActivated.addListener((activeInfo) => {
  activeTabId = activeInfo.tabId;
});

chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === activeTabId) {
    resetTimer();
  }
});

function resetTimer() {
  unproductiveTime = 0;
  currentSite = "";
  isProductive = true;
  lastUpdateTime = Date.now();
  isPaused = false;
  chrome.action.setBadgeText({ text: "" });
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const now = Date.now();

  if (request.action === "updateSite") {
    if (!isProductive && !isPaused) {
      unproductiveTime += (now - lastUpdateTime) / 60000; // Convert to minutes
    }
    lastUpdateTime = now;

    currentSite = request.site;
    isProductive = request.isProductive;
    if (!isProductive) {
      startTracking();
    } else {
      stopTracking();
    }
    sendResponse({ success: true });
  } else if (request.action === "getStatus") {
    if (!isProductive && !isPaused) {
      unproductiveTime += (now - lastUpdateTime) / 60000; // Convert to minutes
    }
    lastUpdateTime = now;

    sendResponse({
      currentSite: currentSite,
      unproductiveTime: Math.floor(unproductiveTime),
      isProductive: isProductive,
    });
  } else if (request.action === "updateTime") {
    if (!isPaused && !isProductive) {
      unproductiveTime += request.time / 60; // Convert seconds to minutes
    }
    sendResponse({ success: true });
  } else if (request.action === "setPaused") {
    isPaused = request.isPaused;
    if (!isPaused) {
      lastUpdateTime = now;
    }
    sendResponse({ success: true });
  }
  return true;
});

function startTracking() {
  chrome.alarms.create("updateTime", { periodInMinutes: 1 });
  if (!notificationInterval) {
    notificationInterval = setInterval(showNotification, 60000); // Check every minute
  }
}

function stopTracking() {
  chrome.alarms.clear("updateTime");
  if (notificationInterval) {
    clearInterval(notificationInterval);
    notificationInterval = null;
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "updateTime") {
    if (!isProductive && !isPaused) {
      unproductiveTime++;
      chrome.action.setBadgeText({
        text: Math.floor(unproductiveTime).toString(),
      });
      showNotification(); // Add this line
    }
  }
});

function showNotification() {
  if (!isProductive && !isPaused) {
    const minutes = Math.floor(unproductiveTime);
    if (minutes % 10 === 0 && minutes > 0) {
      const messages = [
        `You've spent ${minutes} minutes on ${currentSite}. Time for a productive break?`,
        `${minutes} minutes on ${currentSite}? How about switching to something more productive?`,
        `Productivity check: ${minutes} minutes on ${currentSite}. Ready to switch gears?`,
        `${currentSite} has taken ${minutes} minutes of your day. What's next on your to-do list?`,
      ];
      const message = messages[Math.floor(Math.random() * messages.length)];

      chrome.notifications.create({
        type: "basic",
        iconUrl: "icon.png",
        title: "Productivity Reminder",
        message: message,
      });
    }
  }
}

// Handle extension context invalidation
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.query({}, (tabs) => {
    for (let tab of tabs) {
      chrome.tabs.sendMessage(tab.id, { action: "extensionReloaded" }, () => {
        if (chrome.runtime.lastError) {
          // Ignore errors from tabs that don't have our content script
        }
      });
    }
  });
});
