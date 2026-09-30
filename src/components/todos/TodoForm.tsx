import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {AppDispatch, RootState} from '../../store';
import {clearError, createTodoAsync, setError} from '../../store/slices/todosSlice';
import {TodoPriority} from '../../types/todos';

export const TodoForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {creating, error} = useSelector((state: RootState) => state.todos);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TodoPriority>(TodoPriority.MEDIUM);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            dispatch(setError('Название задачи обязательно'));
            return;
        }

        if (title.length > 200) {
            dispatch(setError('Название задачи не должно превышать 200 символов'));
            return;
        }

        if (description.length > 1000) {
            dispatch(setError('Описание не должно превышать 1000 символов'));
            return;
        }

        try {
            await dispatch(createTodoAsync({
                title: title.trim(),
                description: description.trim(),
                priority
            })).unwrap();

            // Reset form
            setTitle('');
            setDescription('');
            setPriority(TodoPriority.MEDIUM);
        } catch (err) {
            // Error is handled by the slice
        }
    };

    return (
        <Card>
            <CardContent sx={{p: 3}}>
                <Stack spacing={3}>
                    <Typography variant="h6">Создать новую задачу</Typography>

                    {error && (
                        <Alert severity="error" onClose={() => dispatch(clearError())}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={2}>
                            <TextField
                                label="Название задачи"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                fullWidth
                                disabled={creating}
                                helperText={`${title.length}/200`}
                                slotProps={{
                                    htmlInput: {maxLength: 200}
                                }}
                            />

                            <TextField
                                label="Описание"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                multiline
                                rows={4}
                                disabled={creating}
                                helperText={`${description.length}/1000`}
                                slotProps={{
                                    htmlInput: {maxLength: 1000}
                                }}
                            />

                            <FormControl fullWidth>
                                <InputLabel>Приоритет</InputLabel>
                                <Select
                                    value={priority}
                                    label="Приоритет"
                                    onChange={(e) => setPriority(e.target.value as TodoPriority)}
                                    disabled={creating}
                                >
                                    <MenuItem value={TodoPriority.LOW}>Низкий</MenuItem>
                                    <MenuItem value={TodoPriority.MEDIUM}>Средний</MenuItem>
                                    <MenuItem value={TodoPriority.HIGH}>Высокий</MenuItem>
                                    <MenuItem value={TodoPriority.CRITICAL}>Критичный</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon/>}
                                disabled={creating || !title.trim()}
                                fullWidth
                                sx={{mt: 1}}
                            >
                                {creating ? 'Создание...' : 'Создать задачу'}
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

