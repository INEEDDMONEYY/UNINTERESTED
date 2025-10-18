// backend/config/rolesList.js

// ✅ Define roles consistently as lowercase strings
const ROLES_LIST = Object.freeze({
  Admin: "admin",
  Editor: "editor",
  User: "user",
});

// Export module
module.exports = ROLES_LIST;
