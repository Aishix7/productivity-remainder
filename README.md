# productivity-remainder

Productivity Tracker Chrome Extension
The Productivity Tracker is a Chrome extension designed to help users track time spent on productive and unproductive websites. It reminds users to stay focused and productive, especially when engaging in time-wasting activities like endless scrolling on social media or watching non-educational videos.

Overview
Track Productive and Unproductive Sites: Automatically detects and tracks time spent on both productive and unproductive websites.
Content Awareness: Analyzes the content on specific websites (like YouTube, Twitter, and Instagram) to determine if it’s educational or distracting.
Timely Notifications: Sends reminders to stay on task if you're spending too much time on unproductive sites.
Customizable Site Lists: Allows users to add or remove websites from the list of productive or unproductive sites based on personal preferences.
This project is my own idea, although I didn’t code everything entirely by myself. I sought help from various sources, including AI and online resources, to bring this project to life.

Features
Content Analysis: Determines if the content you're consuming on platforms like YouTube or Twitter is productive.
Notifications and Alerts: Reminds you every 10 minutes if you've been on an unproductive site for too long.
Pause/Resume Tracking: Users can pause tracking during intentional breaks and resume when ready.
Customizable: Easily modify the list of productive and unproductive sites to suit your personal workflow.
Badge Timer: Shows the amount of time spent on unproductive sites in the Chrome toolbar.


Usage
Track your browsing activity: Automatically tracks time spent on a predefined list of unproductive websites (e.g., YouTube, Twitter, Instagram).

Content analysis: The extension examines certain sites like YouTube to determine whether the content you're viewing is productive (educational) or unproductive (entertainment).

Notifications: Every 10 minutes, if you've been on an unproductive website for too long, a notification will remind you to refocus on more productive tasks.

Pause and Resume: If you're on a break, you can pause tracking and resume later when you're ready to focus again.

Badge Timer: View the time you've spent on unproductive sites directly from the Chrome extension icon.

Options Page
Add or remove sites from the unproductive and productive lists.
Customize notification preferences and save settings according to your needs.
Development
Folder Structure
background.js: Contains the logic for time tracking, notifications, and user interactions.
content.js: Injected into web pages to analyze content on certain websites.
manifest.json: Defines the Chrome extension’s settings, permissions, and background services.
options.html: The options page for managing productive/unproductive site lists.
popup.html: Placeholder for potential features that can be expanded in future versions.
Code Breakdown
background.js:
Tracks time spent on different websites and sends periodic reminders when unproductive time exceeds the set threshold.
Handles pause and resume functionality for tracking.
content.js:
Injected into certain web pages to analyze and classify the content being viewed (e.g., on YouTube).
manifest.json:
Describes the permissions required for the extension, including tracking active tabs and displaying notifications.
Permissions
activeTab: To detect and track the currently active tab.
storage: For saving and accessing user settings.
alarms: To send notifications periodically.
notifications: To alert users when they've spent too long on an unproductive site.
Customization
Add/Remove Sites: Edit the unproductiveSites array in content.js to modify the list of unproductive sites.
Notification Timing: You can adjust the reminder interval in background.js if you prefer notifications at different intervals.

Future Enhancements
Allow users to set custom intervals for notifications.
Improve content analysis using more advanced keyword matching or machine learning.
Expand content tracking to more websites.
Contributing
This project is open for contributions! Feel free to fork the repository, submit pull requests, or open issues to suggest improvements or new features.

License
This project is licensed under the MIT License. See the LICENSE file for more details.
