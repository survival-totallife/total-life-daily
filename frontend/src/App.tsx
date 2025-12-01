import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import BlogPostPage from '@/pages/BlogPostPage';
import CategoryPage from '@/pages/CategoryPage';
import TestArticlesPage from '@/pages/TestArticlesPage';
import TestChatPage from '@/pages/TestChatPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <div className="antialiased bg-white">
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/test-articles" element={<TestArticlesPage />} />
          <Route path="/test-chat" element={<TestChatPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
