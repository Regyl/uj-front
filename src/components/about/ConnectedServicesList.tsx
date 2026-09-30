import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {Box, Card, CardContent, Chip, Grid, Stack, Typography} from '@mui/material';
import {RootState} from '../../store';
import {fetchServices} from '../../services/connectedSourcesService';
import {ConnectedService} from '../../types/connectedServices';
import {SectionHeader} from '../widgets/SectionHeader';
import ExtensionIcon from '@mui/icons-material/Extension';
import {format} from 'date-fns';
import DefaultSkeleton from "../DefaultSkeleton";
import DefaultErrorLoading from "../DefaultErrorLoading";

interface ConnectedServicesListProps {
    catalog: string;
}

export const ConnectedServicesList = ({catalog}: ConnectedServicesListProps) => {
    const accessToken = useSelector((state: RootState) => state.auth.accessToken);
    const [services, setServices] = useState<ConnectedService[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadServices = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchServices(catalog, accessToken);
                setServices(data);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message || 'Ошибка при загрузке сервисов');
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, [catalog, accessToken]);

    if (loading) return <DefaultSkeleton/>
    if (error) return <DefaultErrorLoading/>

    if (services.length === 0) {
        return (
            <Stack spacing={3}>
                <SectionHeader
                    title="Подключенные сервисы"
                    subtitle="список активных интеграций"
                    icon={<ExtensionIcon color="primary"/>}
                />
                <Card>
                    <CardContent sx={{p: 4, textAlign: 'center'}}>
                        <Stack spacing={2} sx={{
                            alignItems: "center"
                        }}>
                            <ExtensionIcon sx={{fontSize: 64, color: 'text.secondary', opacity: 0.5}}/>
                            <Typography variant="h6" sx={{
                                color: "text.secondary"
                            }}>
                                Нет подключенных сервисов
                            </Typography>
                            <Typography variant="body2" sx={{
                                color: "text.secondary"
                            }}>
                                Подключите сервисы для начала работы
                            </Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        );
    }

    return (
        <Stack spacing={3}>
            <SectionHeader
                title="Подключенные сервисы"
                subtitle={`${services.length} ${services.length === 1 ? 'сервис' : services.length < 5 ? 'сервиса' : 'сервисов'}`}
                icon={<ExtensionIcon color="primary"/>}
            />

            <Grid container spacing={2}>
                {services.map((service) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4
                                }
                            }}
                        >
                            <CardContent sx={{p: 2.5}}>
                                <Stack spacing={2}>
                                    <Stack direction="row" spacing={1.5} sx={{
                                        alignItems: "center"
                                    }}>
                                        {service.url && (
                                            <Box
                                                component="img"
                                                src={service.url}
                                                alt={service.value}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: 1.5,
                                                    objectFit: 'contain'
                                                }}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        )}
                                        <Stack spacing={0.5} sx={{flex: 1, minWidth: 0}}>
                                            <Typography variant="subtitle1" sx={{wordBreak: 'break-word'}}>
                                                {service.value}
                                            </Typography>
                                            {service.since && (
                                                <Chip
                                                    label={`since ${format(new Date(service.since), 'dd.MM.yyyy')}`}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{width: 'fit-content'}}
                                                />
                                            )}
                                        </Stack>
                                    </Stack>

                                    {service.description && (
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "text.secondary",
                                                mt: 1
                                            }}>
                                            {service.description}
                                        </Typography>
                                    )}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Stack>
    );
};

