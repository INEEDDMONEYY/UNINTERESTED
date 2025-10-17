import UserProfileHeader from '../../components/Users/UserProfileHeader';
import PostList from '../../components/Posts/PostList';
// import PostDetail from './PostDetail'; // Optional: include if showing expanded post view

export default function UserProfileViewPage() {
  return (
    <>
      <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">
        {/* 👤 User Info */}
        <UserProfileHeader />

        {/* 📝 User Posts */}
        <PostList />

        {/* 📌 Optional: Detailed Post View */}
        {/* <PostDetail /> */}
      </section>
    </>
  );
}
