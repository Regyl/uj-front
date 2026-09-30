import {Card, CardContent, Stack, Typography} from '@mui/material';
import {SectionHeader} from '../widgets/SectionHeader';
import InfoIcon from '@mui/icons-material/Info';

export const AboutInfo = () => {
    return (
        <Stack spacing={3}>
            <SectionHeader
                title="О сервисе"
                subtitle="информация о Unfriendly Jarvis"
                icon={<InfoIcon color="primary"/>}
            />

            <Card>
                <CardContent sx={{p: 3}}>
                    <Stack spacing={2}>
                        <Typography variant="h6">Unfriendly Jarvis</Typography>
                        <Typography variant="body2" sx={{
                            color: "text.secondary"
                        }}>
                            Personal OS — интеллектуальная платформа для управления вашими данными,
                            интеграциями и активностями. Сервис объединяет информацию из различных источников,
                            предоставляя единую точку доступа к вашим цифровым активам.
                        </Typography>
                        <Typography variant="body2" sx={{
                            color: "text.secondary"
                        }}>
                            Платформа автоматически собирает и анализирует данные из подключенных сервисов,
                            создавая персональный профиль и предоставляя рекомендации на основе вашей активности.
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Stack>
    );
};

