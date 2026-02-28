import { create } from 'zustand';
export const useTaskStore = create((set) => ({
    // Estado
    tasks: [],
    loading: false,
    error: null,
    // Filtros activos
    currentFilter: 'all', // all completed" pending"
    currentCategory: 'all', // all work | personel | shopping | Tether
    searchQuery: '', 

    //Reemplazar todas las tareas(usado cuando llegan de Firestore)
    setTasks: (tasks) => set({ tasks, loading: false }),

    //Agregar una nueva tarea al array existente
    addTask: (task) => set((state) => ({
        tasks: [...state.tasks, task]
    })),
    
    // Actualizar una tarea por ID
    updateTask: (taskId, updatedTask) => set((state) => ({
        tasks: state.tasks.map((task) => task.id === taskId ? { ...task, ...updatedTask } : task)
    })),
    
    // Eliminar una tarea por 10
    deleteTask: (taskId) => set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== taskId)
    })),
    
    // Cambiar filtro activo
    setFilter: (filter) => set({ currentFilter: filter }),
    
    // Cambiar categoria activa
    setCategory: (category) => set({ currentCategory: category }),

    setSearchQuery: (query) => set({ searchQuery: query }),
    
    // Estados de carga y error
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error, loading: false })
}));