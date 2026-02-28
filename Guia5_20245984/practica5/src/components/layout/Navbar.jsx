import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { logoutUser } from '../../services/authService';
import { useUIStore } from '../../store/uiStore';


export default function Navbar() {
    const { user, clearUser } = useAuthStore();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useUIStore();
    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            clearUser(); // Limpiar estado de Zustand
            navigate('/login');
        }
    };
    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo y título */}
                    <div className="flex items-center">
                        <Link to="/dashboard" className="text-2xl font-bold text-blue-600">
                            Task Manager Pro
                        </Link>
                    </div>
                    {/* Usuario y botón de logout */}
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700 dark:text-gray-300">
                            {user?.displayName || user?.email}
                        </span>
                        <button
                            onClick={toggleTheme}
                            className="btn-secondary"
                        >
                            Tema: {theme === 'dark' ? 'Claro' : 'Oscuro'}
                        </button>
                        <button
                            onClick={handleLogout}
                            className="btn-secondary"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

