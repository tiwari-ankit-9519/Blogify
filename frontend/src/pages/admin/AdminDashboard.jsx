import React from "react";
import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./DashboardLayout";

// Page Components
import DashboardOverview from "./DashboardOverview";
import UsersManagement from "./UsersManagement";
import BlogsManagement from "./BlogsManagement";
import CategoriesManagement from "./CategoriesManagement";
import CommentsManagement from "./CommentsManagement";
import AnalyticsComponent from "./AnalyticsComponent";

const AdminDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<DashboardOverview />} />
        <Route path="/users" element={<UsersManagement />} />
        <Route path="/blogs" element={<BlogsManagement />} />
        <Route path="/categories" element={<CategoriesManagement />} />
        <Route path="/comments" element={<CommentsManagement />} />
        <Route path="/analytics" element={<AnalyticsComponent />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;
