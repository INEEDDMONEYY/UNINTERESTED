import UserProfileView from '../users/UserProfileView';

export default function ProfilePage() {
  return (
    <>
      <section className="w-full min-h-screen bg-gradient-to-br from-pink-50 to-pink-200 px-4 sm:px-6 lg:px-12 py-8">
        <div className="max-w-5xl mx-auto">
          <header className="mb-6 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-pink-700">Public Profile</h1>
            <p className="text-gray-700 mt-2 text-sm sm:text-base">
              This is how your profile appears to other users on the platform.
            </p>
          </header>

          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <UserProfileView />
          </div>
        </div>
      </section>
    </>
  );
}
