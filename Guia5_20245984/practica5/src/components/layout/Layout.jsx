import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useUIStore } from '../../store/uiStore';


export default function Layout() {
    const { theme } = useUIStore();

    return (
        <div className={theme === 'dark' ? 'dark' : ''}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

                <Navbar />
                <main>
                    {/* Outlet: aquí se renderizan las rutas hijas (Dashboard, TaskDetails, etc.)*/}
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
