import { Navigate, Route, Routes } from 'react-router-dom';

import { AdminRoute } from './components/admin/AdminRoute';
import { ContentStatus } from './components/ContentStatus';
import { SiteHeader } from './components/Header';
import { AuthProvider } from './context/AuthProvider';
import { ContentProvider } from './context/ContentProvider';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminMfaPage } from './pages/admin/AdminMfaPage';
import { AdminPostEditorPage } from './pages/admin/AdminPostEditorPage';
import { AdminPostsPage } from './pages/admin/AdminPostsPage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { BlogPage } from './pages/Blog';
import { BlogPostPage } from './pages/Post';
import { HomePage } from './pages/Home';

function PublicLayout() {
	return (
		<>
			<SiteHeader />
			<ContentStatus>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/blog' element={<BlogPage />} />
					<Route path='/blog/:id' element={<BlogPostPage />} />
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</ContentStatus>
		</>
	);
}

export function App() {
	return (
		<div className='min-h-screen bg-surface'>
			<AuthProvider>
				<ContentProvider>
					<Routes>
						<Route path='/admin/login' element={<AdminLoginPage />} />
						<Route path='/admin' element={<AdminRoute />}>
							<Route index element={<AdminDashboardPage />} />
							<Route path='projects' element={<AdminProjectsPage />} />
							<Route path='posts' element={<AdminPostsPage />} />
							<Route path='posts/:id' element={<AdminPostEditorPage />} />
							<Route path='mfa' element={<AdminMfaPage />} />
						</Route>
						<Route path='/*' element={<PublicLayout />} />
					</Routes>
				</ContentProvider>
			</AuthProvider>
		</div>
	);
}
