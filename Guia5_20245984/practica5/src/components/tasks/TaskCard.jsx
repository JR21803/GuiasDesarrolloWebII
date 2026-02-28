import { Link, useNavigate } from 'react-router-dom';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';

export default function TaskCard({ task }) {

    const navigate = useNavigate();
    const category = CATEGORIES.find(c => c.id === task.category);

    const isTaskOverdue = isOverdue(task.dueDate, task.completed);

    const handleToggleComplete = async (e) => {
        e.preventDefault(); // Evitar que el Link navegue
        // TODO: Implementar toggle de completado

        const result = await updateTask(task.id, { completed: !task.completed });

        if (!result.success) { console.error('Error al actualizar tarea', result.error); }
    };

    const handleDelete = async (e) => {
        e.preventDefault();

        if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
            const result = await deleteTask(task.id);
            if (result.success) {
                console.log('Tarea eliminada con éxito');
                navigate('/dashboard');
            } else {
                console.error('Error al eliminar la tarea:', result.error);
            }
        }



    };


    return (
        <Link to={`/tasks/${task.id}`} className="block">
            <div className={`card hover:shadow-lg transition-shadow
            ${task.completed ? 'opacity-50' : ''}
            ${isTaskOverdue ? 'border border-red-500' : ''}
            `}>

                <div className="flex justify-between items-center mb-2" >
                    <h3 className="text-xl font-bold text-gray-800" >{task.title}</h3>

                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {task.completed ? 'Completada' : 'Pendiente'}
                    </span>
                </div>

                {task.description && (
                    <p className="text-gray-600 text-sm">{task.description}</p>
                )}

                <div className='flex justify-between items-center mt-2'>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${category.color}-100 text-${category.color}-800`}>
                        {category.label}
                    </span>

                    {task.dueDate && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${isTaskOverdue ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                            {getDueDateLabel(task.dueDate)}
                        </span>

                    )}

                    <div className='flex gap-2'>

                        <button onClick={handleToggleComplete} className='text-sm rounded bg-blue-100'>
                            {task.completed ? 'Pendiente' : 'Completada'}
                        </button>
                        <button onClick={handleDelete} className='text-sm rounded bg-red-100'>
                            Eliminar
                        </button>
                    </div>
                </div>

            </div>
        </Link >
    );
}