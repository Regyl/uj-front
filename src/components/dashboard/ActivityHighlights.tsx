import {Card, Chip, Stack, Typography} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import {PersonalProfile} from '../../types';

interface ActivityHighlightsProps {
  profile: PersonalProfile;
}

export const ActivityHighlights = ({ profile }: ActivityHighlightsProps) => (
  <Card sx={{ p: 3 }}>
    <Stack spacing={2}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <Typography variant="h6">Активность</Typography>
        <Chip icon={<LocalFireDepartmentIcon />} label="живой поток" color="secondary" />
      </Stack>
      {profile.activities.map((activity) => (
        <Stack
          key={activity.id}
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.02)'
          }}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">{activity.summary}</Typography>
            <Typography variant="caption" sx={{
              color: "text.secondary"
            }}>
              {new Date(activity.timestamp).toLocaleString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                day: 'numeric',
                month: 'short'
              })}
            </Typography>
          </Stack>
        </Stack>
      ))}
    </Stack>
  </Card>
);

