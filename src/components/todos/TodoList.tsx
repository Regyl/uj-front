import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, Box, Card, CardContent, Checkbox, Chip, IconButton, Stack, Tooltip, Typography} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {AppDispatch, RootState} from '../../store';
import {clearError, deleteTodoAsync, fetchTodosAsync, updateTodoAsync} from '../../store/slices/todosSlice';
import {SectionHeader} from '../widgets/SectionHeader';
import {Todo, TodoPriority} from '../../types/todos';
import DefaultSkeleton from '../DefaultSkeleton';
import DefaultErrorLoading from '../DefaultErrorLoading';
import TaskIcon from '@mui/icons-material/Task';

const getPriorityColor = (priority: TodoPriority): 'default' | 'primary' | 'warning' | 'error' => {
    switch (priority) {
        case TodoPriority.CRITICAL:
            return 'error';
        case TodoPriority.HIGH:
            return 'warning';
        case TodoPriority.MEDIUM:
            return 'primary';
        case TodoPriority.LOW:
        default:
            return 'default';
    }
};

const getPriorityLabel = (priority: TodoPriority): string => {
    switch (priority) {
        case TodoPriority.CRITICAL:
            return 'КРИТИЧНО';
        case TodoPriority.HIGH:
            return 'ВЫСОКИЙ';
        case TodoPriority.MEDIUM:
            return 'СРЕДНИЙ';
        case TodoPriority.LOW:
            return 'НИЗКИЙ';
        default:
            return priority;
    }
};

interface TodoItemProps {
    todo: Todo;
    onToggleComplete: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
}

const TodoItem = ({todo, onToggleComplete, onDelete}: TodoItemProps) => {
    const handleToggleComplete = () => {
        onToggleComplete(todo.id, !todo.completed);
    };

    const handleDelete = () => {
        if (window.confirm('Вы уверены, что хотите удалить эту задачу?')) {
            onDelete(todo.id);
        }
    };

    return (
        <Card
            sx={{
                opacity: todo.completed ? 0.7 : 1,
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: 3
                }
            }}
        >
            <CardContent>
                <Stack direction="row" spacing={2} sx={{
                    alignItems: "flex-start"
                }}>
                    <Checkbox
                        checked={todo.completed}
                        onChange={handleToggleComplete}
                        icon={<RadioButtonUncheckedIcon/>}
                        checkedIcon={<CheckCircleIcon/>}
                        sx={{mt: -1}}
                    />

                    <Box sx={{flex: 1, minWidth: 0}}>
                        <Stack spacing={1}>
                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                }}>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                        color: todo.completed ? 'text.secondary' : 'text.primary',
                                        flex: 1,
                                        minWidth: 0
                                    }}
                                >
                                    {todo.title}
                                </Typography>
                                <Chip
                                    label={getPriorityLabel(todo.priority)}
                                    color={getPriorityColor(todo.priority)}
                                    size="small"
                                    sx={{fontWeight: 600}}
                                />
                            </Stack>

                            {todo.description && (
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: "text.secondary",
                                        textDecoration: todo.completed ? 'line-through' : 'none',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word'
                                    }}>
                                    {todo.description}
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    <Tooltip title="Удалить задачу">
                        <IconButton
                            onClick={handleDelete}
                            color="error"
                            size="small"
                            sx={{mt: -0.5}}
                        >
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </Stack>
            </CardContent>
        </Card>
    );
};

export const TodoList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {todos, loading, error, updating, deleting} = useSelector((state: RootState) => state.todos);

    useEffect(() => {
        dispatch(fetchTodosAsync());
    }, [dispatch]);

    const handleToggleComplete = async (id: string, completed: boolean) => {
        try {
            await dispatch(updateTodoAsync({id, updates: {completed}})).unwrap();
        } catch (err) {
            // Error is handled by the slice
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteTodoAsync(id)).unwrap();
        } catch (err) {
            // Error is handled by the slice
        }
    };

    if (loading) return <DefaultSkeleton/>;
    if (error && todos.length === 0) return <DefaultErrorLoading/>;

    const completedCount = todos.filter(t => t.completed).length;
    const activeCount = todos.length - completedCount;

    if (todos.length === 0) {
        return (
            <Stack spacing={3}>
                <SectionHeader
                    title="Реестр задач"
                    subtitle="Управление вашими задачами"
                    icon={<TaskIcon color="primary"/>}
                />
                <Card sx={{p: 4, textAlign: 'center'}}>
                    <Stack spacing={2} sx={{
                        alignItems: "center"
                    }}>
                        <TaskIcon sx={{fontSize: 64, color: 'text.secondary', opacity: 0.5}}/>
                        <Typography variant="h6" sx={{
                            color: "text.secondary"
                        }}>
                            Пока нет задач
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: "text.secondary"
                        }}>
                            Создайте первую задачу, чтобы начать работу
                        </Typography>
                    </Stack>
                </Card>
            </Stack>
        );
    }

    // Sort todos: incomplete first, then by priority, then by creation order
    const sortedTodos = [...todos].sort((a, b) => {
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1;
        }
        const priorityOrder = {
            [TodoPriority.CRITICAL]: 4,
            [TodoPriority.HIGH]: 3,
            [TodoPriority.MEDIUM]: 2,
            [TodoPriority.LOW]: 1
        };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    return (
        <Stack spacing={3}>
            <SectionHeader
                title="Реестр задач"
                subtitle={`Всего: ${todos.length} | Активных: ${activeCount} | Выполнено: ${completedCount}`}
                icon={<TaskIcon color="primary"/>}
            />

            {error && (
                <Alert severity="error" onClose={() => dispatch(clearError())}>
                    {error}
                </Alert>
            )}

            <Stack spacing={2}>
                {sortedTodos.map((todo) => (
                    <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggleComplete={handleToggleComplete}
                        onDelete={handleDelete}
                    />
                ))}
            </Stack>

            {(updating || deleting) && (
                <Box sx={{position: 'fixed', bottom: 16, right: 16}}>
                    <Alert severity="info">Обработка...</Alert>
                </Box>
            )}
        </Stack>
    );
};

