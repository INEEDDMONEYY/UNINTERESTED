import UserProfileView from '../users/UserProfileView';

export default function ProfilePage() {
  return (
    <section className="w-full min-h-screen px-4 sm:px-6 lg:px-12 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <UserProfileView />
        </div>
      </div>
    </section>
  );
}
