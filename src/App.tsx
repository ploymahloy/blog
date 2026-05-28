import { Navigate, Route, Routes } from 'react-router-dom';

import { SiteHeader } from './components/Header';
import { BlogPage } from './pages/Blog';
import { BlogPostPage } from './pages/Post';
import { HomePage } from './pages/Home';

export function App() {
	return (
		<div className='min-h-screen bg-surface'>
			<SiteHeader />
			<main>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/blog' element={<BlogPage />} />
					<Route path='/blog/:id' element={<BlogPostPage />} />
					<Route path='*' element={<Navigate to='/' replace />} />
				</Routes>
			</main>
		</div>
	);
}
