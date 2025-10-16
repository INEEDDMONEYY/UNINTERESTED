import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import App from "./App.jsx";
import Home from "./pages/homePage.jsx";
import SignIn from "./pages/signInPage.jsx";
import SignUp from "./pages/signUpPage.jsx";
import ForgotPass from "./pages/forgotPassPage.jsx";
import Post from "./pages/postPage";
import AdminDashboard from "./pages/admin/dashboard.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import UserDashboard from "./pages/users/dashboard.jsx";
import UserProfileSettings from "./pages/users/UserProfileSettings.jsx";
import PromoteAccount from "./pages/promoteAccount.jsx";
import TermsOfUsePage from './pages/policies/TermsOfUsePage.jsx';
import PrivacyPolicy from './pages/policies/PrivacyPolicyPage.jsx';
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ✅ Import UserProvider
import { UserProvider } from "./context/UserContext.jsx";

// ✅ Import new post-related views
import PostDetail from "./pages/users/PostDetail.jsx";
import UserProfileView from "./pages/users/UserProfileView.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "home",
    element: <Home />,
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "analytics",
    element: <AdminAnalytics />,
  },
  {
    path: "user/dashboard",
    element: <UserDashboard />,
  },
  {
    path: "user/profile",
    element: <UserProfileSettings />,
  },
  {
    path: "user/:userId",
    element: <UserProfileView />,
  },
  {
    path: "signin",
    element: <SignIn />,
  },
  {
    path: "signup",
    element: <SignUp />,
  },
  {
    path: "forgotpass",
    element: <ForgotPass />,
  },
  {
    path: "post",
    element: <Post />,
  },
  {
    path: "posts/:postId",
    element: <PostDetail />,
  },
  {
    path: "promote",
    element: <PromoteAccount />,
  },
  {
    path: "terms-policy",
    element: <TermsOfUsePage />,
  },
  {
    path: "privacy-policy",
    element: <PrivacyPolicy />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* ✅ Wrap entire app in UserProvider */}
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>
);
