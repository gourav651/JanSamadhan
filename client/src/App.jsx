import React from "react";
import { Route, Routes } from "react-router-dom";

import CitizenHome from "./pages/citizen/Home";
import CitizenReportIssue from "./pages/citizen/ReportIssue";
import CitizenReportLocation from "./pages/citizen/ReportLocation";
import CitizenIssueDetails from "./pages/citizen/IssueDetails";
import CitizenMyIssues from "./pages/citizen/MyIssues";
import CitizenReviewIssue from "./pages/citizen/ReviewIssue";

import AuthAssignedIssues from "./pages/authority/AssignedIssues";
import AuthDashboard from "./pages/authority/Dashboard";
import AuthIssueDetails from "./pages/authority/IssueDetails";
import AuthMapView from "./pages/authority/MapView";
import AuthSettings from "./pages/authority/Settings";


import AdminAnalytics from "./pages/admin/Analytics";
import AdminAuthorities from "./pages/admin/Authorities";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminHeatmap from "./pages/admin/Heatmap";
import AdminSettings from "./pages/admin/Settings";
import RequireRole from "./components/auth/RequireRole";
import PostLoginRedirect from "./components/auth/PostLoginRedirect";

const App = () => {
  return (
    <>
      <PostLoginRedirect />
      
      <Routes>
        {/* 🌍 PUBLIC ROUTES */}
        <Route path="/" element={<CitizenHome />} />
        <Route path="/citizen/issues/:id" element={<CitizenIssueDetails />} />

        {/* 👤 CITIZEN ROUTES */}
        <Route
          path="/citizen/report"
          element={
            <RequireRole allowedRoles={["CITIZEN"]}>
              <CitizenReportIssue />
            </RequireRole>
          }
        />

        <Route
          path="/citizen/report/location"
          element={
            <RequireRole allowedRoles={["CITIZEN"]}>
              <CitizenReportLocation />
            </RequireRole>
          }
        />

        <Route
          path="/citizen/report/review"
          element={
            <RequireRole allowedRoles={["CITIZEN"]}>
              <CitizenReviewIssue />
            </RequireRole>
          }
        />

        <Route
          path="/citizen/my-issues"
          element={
            <RequireRole allowedRoles={["CITIZEN"]}>
              <CitizenMyIssues />
            </RequireRole>
          }
        />

        {/* 🏛️ AUTHORITY ROUTES */}
        <Route
          path="/authority/dashboard"
          element={
            <RequireRole allowedRoles={["AUTHORITY"]}>
              <AuthDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/authority/assigned-issues"
          element={
            <RequireRole allowedRoles={["AUTHORITY"]}>
              <AuthAssignedIssues />
            </RequireRole>
          }
        />

        <Route
          path="/authority/issues/:id"
          element={
            <RequireRole allowedRoles={["AUTHORITY"]}>
              <AuthIssueDetails />
            </RequireRole>
          }
        />

        <Route
          path="/authority/map"
          element={
            <RequireRole allowedRoles={["AUTHORITY"]}>
              <AuthMapView />
            </RequireRole>
          }
        />

        <Route
          path="/authority/settings"
          element={
            <RequireRole allowedRoles={["AUTHORITY"]}>
              <AuthSettings />
            </RequireRole>
          }
        />

        {/* 🛠️ ADMIN ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireRole allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </RequireRole>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <RequireRole allowedRoles={["ADMIN"]}>
              <AdminAnalytics />
            </RequireRole>
          }
        />

        <Route
          path="/admin/authorities"
          element={
            <RequireRole allowedRoles={["ADMIN"]}>
              <AdminAuthorities />
            </RequireRole>
          }
        />

        <Route
          path="/admin/map"
          element={
            <RequireRole allowedRoles={["ADMIN"]}>
              <AdminHeatmap />
            </RequireRole>
          }
        />

        <Route
          path="/admin/settings"
          element={
            <RequireRole allowedRoles={["ADMIN"]}>
              <AdminSettings />
            </RequireRole>
          }
        />
      </Routes>
    </>
  );
};

export default App;
