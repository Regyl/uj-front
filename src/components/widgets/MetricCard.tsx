import {Box, Card, LinearProgress, Stack, Typography} from '@mui/material';

interface MetricCardProps {
  label: string;
  value: string | number;
  helper?: string;
  progress?: number;
  accent?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const MetricCard = ({ label, value, helper, progress, accent = 'primary' }: MetricCardProps) => {
  // Split label if it contains a space (e.g., "Свободный cashflow")
  const labelParts = label.split(' ');
  const hasTwoLines = labelParts.length > 1;

  return (
    <Card
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.paper',
        border: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <Stack spacing={1.5} sx={{ flex: 1 }}>
        <Box>
          {hasTwoLines ? (
            <Stack spacing={0.25}>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.2
                }}>
                {labelParts[0]}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "text.secondary",
                  lineHeight: 1.2
                }}>
                {labelParts.slice(1).join(' ')}
              </Typography>
            </Stack>
          ) : (
            <Typography variant="body2" sx={{
              color: "text.secondary"
            }}>
              {label}
            </Typography>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
          {value}
        </Typography>
        {helper && (
          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              mt: -0.5
            }}>
            {helper}
          </Typography>
        )}
        {typeof progress === 'number' && (
          <LinearProgress
            variant="determinate"
            value={Math.min(100, Math.max(0, progress))}
            color={accent}
            sx={{
              height: 6,
              borderRadius: 999,
              mt: 'auto',
              bgcolor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 999
              }
            }}
          />
        )}
      </Stack>
    </Card>
  );
};

