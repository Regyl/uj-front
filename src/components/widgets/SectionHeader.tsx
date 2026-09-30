import {Button, Stack, Typography} from '@mui/material';
import {ReactNode} from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
}

export const SectionHeader = ({ title, subtitle, actionLabel, onAction, icon }: SectionHeaderProps) => (
  <Stack
    direction="row"
    sx={{
      justifyContent: "space-between",
      alignItems: "center",
      mb: 3
    }}>
    <Stack spacing={0.5}>
      <Stack direction="row" spacing={1} sx={{
        alignItems: "center"
      }}>
        {icon}
        <Typography variant="h5">{title}</Typography>
      </Stack>
      {subtitle && (
        <Typography variant="body2" sx={{
          color: "text.secondary"
        }}>
          {subtitle}
        </Typography>
      )}
    </Stack>
    {actionLabel && (
      <Button variant="contained" color="primary" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </Stack>
);

