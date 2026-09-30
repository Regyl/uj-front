import {MouseEvent, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Stack, Typography} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import TuneIcon from '@mui/icons-material/Tune';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import {PersonalProfile} from '../../types';
import {logout} from '../../store/slices/authSlice';
import {RootState} from '../../store';

interface AppHeaderProps {
  profile: PersonalProfile;
}

export const AppHeader = ({ profile }: AppHeaderProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/signin');
  };

  const displayName = authUser?.name || authUser?.email || authUser?.login || profile.identity.fullName;
  const displayAvatar = authUser?.avatar_url || profile.identity.avatar;

  return (
    <Box
      sx={{
        px: 3,
        py: 2,
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <Stack
        direction="row"
        spacing={3}
        sx={{
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <Stack spacing={0.5}>
          <Typography variant="overline" sx={{
            color: "text.secondary"
          }}>
            unfriendly jarvis
          </Typography>
          <Typography variant="h4">Personal OS</Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <NotificationsNoneIcon />
          </IconButton>
          <IconButton color="inherit">
            <TuneIcon />
          </IconButton>
          <IconButton
            onClick={handleClick}
            sx={{ p: 0 }}
            aria-controls={open ? 'user-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar src={displayAvatar} alt={displayName} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            id="user-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1.5,
                  minWidth: 200,
                  bgcolor: 'background.paper'
                }
              }
            }}
          >
            <MenuItem disabled>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">{displayName}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Выйти
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

