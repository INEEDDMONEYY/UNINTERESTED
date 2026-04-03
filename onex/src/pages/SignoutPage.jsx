// SignoutPage.jsx
import { useEffect } from "react";
import SignoutFlow from "../components/Flows/SignoutFlow";
import { setSEO } from "../utils/seo";

export default function Signout() {
  useEffect(() => {
    setSEO('Sign Out | Mystery Mansion', '', { robots: 'noindex, nofollow' });
  }, []);

  return <SignoutFlow />;
}
