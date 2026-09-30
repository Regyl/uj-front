import {Box, Stack} from '@mui/material';
import {ReactNode} from 'react';
import {AppHeader} from './AppHeader';
import {NavRail} from '../navigation/NavRail';
import {PersonalProfile} from '../../types';

interface AppShellProps {
  profile: PersonalProfile;
  children: ReactNode;
}

export const AppShell = ({ profile, children }: AppShellProps) => (
  <Stack
    direction="row"
    sx={{
      minHeight: "100vh",
      bgcolor: "background.default",
      width: '100%',
      overflowX: 'hidden'
    }}>
    <NavRail />
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      <AppHeader profile={profile} />
      {children}
    </Box>
  </Stack>
);

