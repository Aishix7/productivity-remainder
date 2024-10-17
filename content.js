let isProductive = true;
let site = window.location.hostname;
let isPaused = false;
let lastUpdateTime = Date.now();
let trackingInterval;

function analyzeContent() {
  const unproductiveSites = [
    "youtube.com",
    "facebook.com",
    "twitter.com",
    "instagram.com",
    "netflix.com",
    "primevideo.com",
    "tiktok.com",
  ];

  if (unproductiveSites.some((s) => site.includes(s))) {
    isProductive = false;

    if (site.includes("youtube.com")) {
      isProductive = analyzeYouTube();
    } else if (
      site.includes("facebook.com") ||
      site.includes("instagram.com")
    ) {
      isProductive = analyzeSocialMedia();
    } else if (site.includes("twitter.com")) {
      isProductive = analyzeTwitter();
    } else if (site.includes("tiktok.com")) {
      isProductive = analyzeTikTok();
    }
  }

  chrome.runtime.sendMessage(
    { action: "updateSite", site, isProductive },
    function (response) {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      }
    }
  );

  if (!isProductive) {
    startTracking();
  } else {
    stopTracking();
  }
}

function analyzeYouTube() {
  let title = document.querySelector("h1.title")?.textContent || "";
  let description = document.querySelector("#description")?.textContent || "";
  let channelName = document.querySelector("#channel-name")?.textContent || "";

  const productiveKeywords = [
    "tutorial",
    "educational",
    "learn",
    "course",
    "lecture",
    "documentary",
  ];
  const unproductiveKeywords = [
    "funny",
    "prank",
    "challenge",
    "vlog",
    "gaming",
  ];

  let productiveScore = productiveKeywords.filter(
    (keyword) =>
      title.toLowerCase().includes(keyword) ||
      description.toLowerCase().includes(keyword)
  ).length;

  let unproductiveScore = unproductiveKeywords.filter(
    (keyword) =>
      title.toLowerCase().includes(keyword) ||
      description.toLowerCase().includes(keyword)
  ).length;

  return productiveScore > unproductiveScore;
}

function analyzeSocialMedia() {
  let posts = document.querySelectorAll('div[role="article"]');
  let productiveCount = 0;

  posts.forEach((post) => {
    let text = post.textContent.toLowerCase();
    if (
      text.includes("learn") ||
      text.includes("article") ||
      text.includes("news") ||
      text.includes("research")
    ) {
      productiveCount++;
    }
  });

  return productiveCount > posts.length / 2;
}

function analyzeTwitter() {
  let tweets = document.querySelectorAll("article");
  let productiveCount = 0;

  tweets.forEach((tweet) => {
    let text = tweet.textContent.toLowerCase();
    if (
      text.includes("learn") ||
      text.includes("article") ||
      text.includes("news") ||
      text.includes("research")
    ) {
      productiveCount++;
    }
  });

  return productiveCount > tweets.length / 2;
}

function analyzeTikTok() {
  let videoTitle =
    document.querySelector(".tiktok-1itcwxg-DivVideoInfoContainer")
      ?.textContent || "";
  return (
    videoTitle.toLowerCase().includes("educational") ||
    videoTitle.toLowerCase().includes("learn")
  );
}

function startTracking() {
  const videoElements = document.querySelectorAll("video");
  videoElements.forEach((video) => {
    video.addEventListener("play", () => {
      isPaused = false;
      lastUpdateTime = Date.now();
      chrome.runtime.sendMessage({ action: "setPaused", isPaused: false });
    });

    video.addEventListener("pause", () => {
      isPaused = true;
      updateUnproductiveTime();
      chrome.runtime.sendMessage({ action: "setPaused", isPaused: true });
    });
  });

  if (trackingInterval) {
    clearInterval(trackingInterval);
  }
  trackingInterval = setInterval(updateUnproductiveTime, 1000);
}

function stopTracking() {
  if (trackingInterval) {
    clearInterval(trackingInterval);
  }
  isPaused = true;
  chrome.runtime.sendMessage({ action: "setPaused", isPaused: true });
}

function updateUnproductiveTime() {
  if (!isProductive && !isPaused) {
    const now = Date.now();
    const duration = (now - lastUpdateTime) / 1000;
    lastUpdateTime = now;
    chrome.runtime.sendMessage({ action: "updateTime", time: duration });
  }
}

analyzeContent();

// Re-analyze content when the page changes
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    analyzeContent();
  }
}).observe(document, { subtree: true, childList: true });
