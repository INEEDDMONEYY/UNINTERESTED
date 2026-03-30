import { useState, useEffect } from "react";
import api from "../../utils/api";
import RestrictUserSetting from "../../components/Settings/AdminDashboardSettings/RestrictUserSettings.jsx";
import UnrestrictUserSetting from "../../components/Settings/AdminDashboardSettings/UnrestrictUserSettings.jsx";
import SuspendUserSetting from "../../components/Settings/AdminDashboardSettings/SuspendUserSettings.jsx";
import DeveloperMessageSetting from "../../components/Settings/AdminDashboardSettings/DeveloperMessageSettings.jsx";
import AdminCredentialsSetting from "../../components/Settings/AdminDashboardSettings/AdminCredentialsSettings.jsx";
import ProfilePictureSetting from "../../components/Settings/AdminDashboardSettings/ProfilePictureSettings.jsx";
import DeleteUserSetting from "../../components/Settings/AdminDashboardSettings/DeleteUserSettings.jsx";
import PlatformUpdatesForm from "../../components/updates/PlatformUpdatesForm.jsx";
import NewFeatureUpdatesForm from "../../components/updates/NewFeatureUpdatesForm.jsx";


export default function AdminSettings({ onProfileUpdate, settingsData }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("/admin/users");
        setUsers(data?.data || data?.users || []);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="p-4 w-full max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-pink-700 mb-4">Admin Settings</h1>

      <RestrictUserSetting users={users} />
      <UnrestrictUserSetting users={users} />
      <SuspendUserSetting users={users} />
      <DeveloperMessageSetting />
      <AdminCredentialsSetting />
      <ProfilePictureSetting
        currentProfile={settingsData?.profilePicture}
        onProfileUpdate={onProfileUpdate}
      />
      <DeleteUserSetting users={users} />


      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold text-black mb-3">Platform Updates</h2>
        <PlatformUpdatesForm />
      </div>
      <div className="bg-white border border-pink-200 rounded-lg p-4 shadow-sm">
        <h2 className="text-lg font-bold text-black mb-3">New Feature Updates</h2>
        <NewFeatureUpdatesForm />
      </div>
    </div>
  );
}
