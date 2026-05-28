import { Navigate, Route, Routes } from "react-router-dom";

import { SiteHeader } from "./components/site-header";
import { BlogPage } from "./pages/blog-page";
import { BlogPostPage } from "./pages/blog-post-page";
import { HomePage } from "./pages/home-page";

export function App() {
  return (
    <div className="min-h-screen bg-surface">
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogPostPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
