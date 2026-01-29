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
import AuthoritySupport from "./pages/authority/Support";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminIssues from "./pages/admin/AdminIssues";
import AuthorityManagement from "./pages/admin/AuthorityManagement";
import AdminAnalytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import AdminSupportTickets from "./pages/admin/AdminSupportTickets";

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
        <Route path="/citizen/report" element={<CitizenReportIssue />} />
        <Route
          path="/citizen/report/location"
          element={<CitizenReportLocation />}
        />
        <Route path="/citizen/report/review" element={<CitizenReviewIssue />} />
        <Route path="/citizen/my-issues" element={<CitizenMyIssues />} />

        {/* 🏛️ AUTHORITY ROUTES */}
        <Route path="/authority/dashboard" element={<AuthDashboard />} />
        <Route
          path="/authority/assigned-issues"
          element={<AuthAssignedIssues />}
        />
        <Route path="/authority/issues/:id" element={<AuthIssueDetails />} />
        <Route path="/authority/map" element={<AuthMapView />} />
        <Route path="/authority/settings" element={<AuthSettings />} />
        <Route path="/authority/support" element={<AuthoritySupport />} />

        {/* 🛠️ ADMIN ROUTES (STATIC SIDEBAR) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="issues" element={<AdminIssues />} />
          <Route path="authorities" element={<AuthorityManagement />} />
          <Route path="support" element={<AdminSupportTickets />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
