import {Card, Chip, Stack, Typography} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import {PersonalProfile} from '../../types';

interface SecurityPanelProps {
  profile: PersonalProfile;
}

const severityColor: Record<string, 'default' | 'primary' | 'warning' | 'error' | 'success'> = {
  low: 'primary',
  medium: 'warning',
  high: 'error'
};

export const SecurityPanel = ({ profile }: SecurityPanelProps) => (
  <Card sx={{ p: 3, height: '100%' }}>
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{
        alignItems: "center"
      }}>
        <SecurityIcon color="primary" />
        <Typography variant="h6">Security Pulse</Typography>
      </Stack>
      {profile.security.map((signal) => (
        <Stack
          key={signal.id}
          spacing={0.5}
          sx={{
            borderRadius: 2,
            p: 1.5,
            bgcolor: 'rgba(255,255,255,0.03)'
          }}
        >
          <Stack
            direction="row"
            sx={{
              justifyContent: "space-between",
              alignItems: "center"
            }}>
            <Typography variant="subtitle2">{signal.title}</Typography>
            <Chip
              icon={<WarningAmberIcon />}
              label={signal.severity}
              size="small"
              color={severityColor[signal.severity]}
              variant="outlined"
            />
          </Stack>
          <Typography variant="body2" sx={{
            color: "text.secondary"
          }}>
            {signal.description}
          </Typography>
          <Typography variant="caption" sx={{
            color: "text.secondary"
          }}>
            Проверено {new Date(signal.lastChecked).toLocaleString('ru-RU', { day: 'numeric', month: 'short' })}
          </Typography>
        </Stack>
      ))}
    </Stack>
  </Card>
);

