import UserProfileHeader from '../../components/Users/UserProfileHeader';
import PostList from '../../components/Posts/PostList';
// import PostDetail from './PostDetail'; // Optional: include if showing expanded post view

export default function UserProfileViewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* 👤 User Info Section */}
      <section>
        <UserProfileHeader />
      </section>

      {/* 📝 User Posts Section */}
      <section>
        {/**Will add Contact info & availbity */}
      </section>

      {/* 📌 Optional: Detailed Post View Section */}
      {/* <section>
        <PostDetail />
      </section> */}
    </div>
  );
}
