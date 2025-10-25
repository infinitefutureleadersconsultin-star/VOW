const fs = require('fs');

const additions = {
  "pricing": {
    "title": "Choose Your Path",
    "subtitle": "Select a plan that fits your journey",
    "select_plan": "Select Plan",
    "current_plan": "Current Plan",
    "per_month": "/month",
    "per_day": "/day",
    "popular": "Popular",
    "tiers": {
      "seeker": {"name": "Seeker", "description": "Perfect for getting started"},
      "explorer": {"name": "Explorer", "description": "For dedicated growth"},
      "master": {"name": "Master", "description": "For transformation leaders"}
    }
  },
  "settings": {
    "title": "Settings",
    "account": "Account",
    "preferences": "Preferences",
    "notifications": "Notifications",
    "language": "Language",
    "theme": "Theme",
    "save_changes": "Save Changes"
  },
  "profile": {
    "title": "Profile",
    "edit": "Edit Profile",
    "save": "Save Changes"
  },
  "errors": {
    "unauthorized": "Please log in to continue",
    "not_found": "Page not found",
    "server_error": "Something went wrong. Please try again."
  }
};

['en', 'es', 'fr', 'hi', 'zh', 'pt'].forEach(lang => {
  const file = `locales/${lang}.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  Object.assign(data, additions);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  console.log(`✅ Updated ${file}`);
});
