import { StrictMode, Suspense, lazy, useEffect } from "react";
import ScrollToTop from "./components/ScrollToTop.jsx";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";

import { UserProvider } from "./context/UserContext.jsx";
import { DevMessageProvider } from "./context/DevMessageContext.jsx";
import { ServerReadyProvider, useServerReady } from "./context/ServerReadyContext.jsx";
import { startAnalyticsTracking } from "./utils/analyticsTracker.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// Lazy loaded pages
const App = lazy(() => import("./App.jsx"));
const Home = lazy(() => import("./pages/homePage.jsx"));
const SignIn = lazy(() => import("./pages/SignInPage.jsx"));
const SignUp = lazy(() => import("./pages/signUpPage.jsx"));
const ForgotPass = lazy(() => import("./pages/forgotPassPage.jsx"));
const Post = lazy(() => import("./pages/postPage.jsx"));
const AdminDashboard = lazy(() => import("./pages/admin/dashboard.jsx"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics.jsx"));
const UserDashboard = lazy(() => import("./pages/users/dashboard.jsx"));
const UserProfileSettings = lazy(() => import("./pages/users/UserProfileSettings.jsx"));
const UserMessages = lazy(() => import("./pages/users/UserMessages.jsx"));
const PromoteAccount = lazy(() => import("./pages/promoteAccount.jsx"));
const FAQPage = lazy(() => import("./pages/FAQPage.jsx"));
const TermsOfUsePage = lazy(() => import("./pages/policies/TermsOfUsePage.jsx"));
const PrivacyPolicy = lazy(() => import("./pages/policies/PrivacyPolicyPage.jsx"));
const ProfilePage = lazy(() => import("./pages/profiles/ProfilePage.jsx"));
const Signout = lazy(() => import("./pages/SignoutPage.jsx"));
const PlatformUpdates = lazy(() => import("./pages/updates/PlatformUpdatesPage.jsx"));
const ResetPassword = lazy(() => import("./pages/resetPasswordPage.jsx"));
const PostDetail = lazy(() => import("./components/Posts/PostDetail.jsx"));
const UserProfileView = lazy(() => import("./pages/users/UserProfileViewPage.jsx"));
const ReviewsPage = lazy(() => import('./pages/Reviews/ReviewsPage.jsx')) ;
const ContactPage = lazy(() => import("./pages/ContactPage.jsx"));

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "home", element: <Home /> },
  {
    path: "admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  { path: "analytics", element: <AdminAnalytics /> },
  { path: "user/dashboard", element: <UserDashboard /> },
  { path: "user/profile", element: <UserProfileSettings /> },
  {
    path: "user/messages",
    element: (
      <ProtectedRoute role="user">
        <UserMessages />
      </ProtectedRoute>
    ),
  },
  {
    path: "user/profilepage",
    element: (
      <ProtectedRoute role="user">
        <ProfilePage />
      </ProtectedRoute>
    ),
  },
  { path: "user/:userId", element: <UserProfileView /> },
  { path: "signin", element: <SignIn /> },
  { path: "signup", element: <SignUp /> },
  { path: "forgotpass", element: <ForgotPass /> },
  { path: "post", element: <Post /> },
  { path: "posts/:postId", element: <PostDetail /> },
  { path: "promote", element: <PromoteAccount /> },
  { path: "faq", element: <FAQPage /> },
  { path: "terms-policy", element: <TermsOfUsePage /> },
  { path: "privacy-policy", element: <PrivacyPolicy /> },
  { path: "platform-updates", element: <PlatformUpdates /> },
  { path: "reset-password/:token", element: <ResetPassword /> },
  { path: "signout", element: <Signout /> },
  { path: "/profile/:username", element: <ProfilePage /> },
  { path: "reviews/:userId", element: <ReviewsPage /> },
  { path: "contact", element: <ContactPage /> },
]);

export function AppGate() {
  const serverReady = useServerReady();

  useEffect(() => {
    const stop = startAnalyticsTracking();
    return () => stop();
  }, []);

  return (
    <>
      {!serverReady && (
        <div className="fixed inset-x-0 top-0 z-50 border-b border-amber-200 bg-amber-50/95 px-4 py-2 text-center text-sm text-amber-900 backdrop-blur-sm">
          The server is waking up. Public pages can still load, but sign in, posting, and other live data may be delayed.
        </div>
      )}
      <Toaster position="top-right" toastOptions={{ duration: 6000 }} />
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen text-lg">
            Loading...
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <DevMessageProvider>
        <ServerReadyProvider>
          <AppGate />
        </ServerReadyProvider>
      </DevMessageProvider>
    </UserProvider>
  </StrictMode>
);