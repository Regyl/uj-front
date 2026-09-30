import {Button, Card, Stack, Typography} from '@mui/material';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const actions = [
  { label: 'SoundCloud', icon: <CloudQueueIcon />, path: '/integrations/soundcloud' },
  { label: 'Steam', icon: <SportsEsportsIcon />, path: '/integrations/steam' },
  { label: 'Яндекс.Музыка', icon: <MusicNoteIcon />, path: '/integrations/yandex' }
];

export const ProfileQuickActions = () => (
  <Card sx={{ p: 3, mt: 2 }}>
    <Typography
      variant="subtitle2"
      sx={{
        color: "text.secondary",
        mb: 1
      }}>
      API интеграции
    </Typography>
    <Stack spacing={1.5}>
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outlined"
          color="inherit"
          startIcon={action.icon}
          href={action.path}
          sx={{ justifyContent: 'space-between' }}
        >
          {action.label}
        </Button>
      ))}
    </Stack>
  </Card>
);

