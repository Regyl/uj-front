import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Container,
    Divider,
    FormControlLabel,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {useDispatch, useSelector} from 'react-redux';
import {AppDispatch, RootState} from '../store';
import {setError, setLoading, setTokens, setUser} from '../store/slices/authSlice';
import {getGitHubAuthUrl, signIn, signUp} from '../services/authService';
import {SignInCredentials, SignUpCredentials} from "../types/auth";

type AuthMode = 'signin' | 'signup';

export const SignInPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const authError = useSelector((state: RootState) => state.auth.error);
  const isLoading = useSelector((state: RootState) => state.auth.loading);

  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuthModeChange = (_: React.MouseEvent<HTMLElement>, newMode: AuthMode | null) => {
    if (newMode !== null) {
      setAuthMode(newMode);
      dispatch(setError(null));
      // Clear form when switching modes
      setEmail('');
      setPassword('');
    }
  };

  const handleGitHubSignIn = () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      window.location.href = getGitHubAuthUrl(authMode);
    } catch (error: any) {
      dispatch(setError(error.message || 'Ошибка при инициализации авторизации'));
      dispatch(setLoading(false));
    }
  };

  const handleBasicAuth = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      let response;
      if (authMode === 'signin') {
        const credentials: SignInCredentials = {email, password};
        response = await signIn(credentials);
      } else {
        const credentials: SignUpCredentials = {email, password, confirmPassword: password, name: email.split('@')[0]};
        response = await signUp(credentials);
      }

      // Save both access and refresh tokens
      dispatch(setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      }));
      dispatch(setUser({
        id: response.user.id,
        login: response.user.email,
        email: response.user.email,
        avatar_url: response.user.avatar_url || null,
        name: response.user.name
      }));

      dispatch(setLoading(false));
      navigate('/');
    } catch (error: any) {
      dispatch(setError(error.message || 'Ошибка при авторизации'));
      dispatch(setLoading(false));
    }
  };

  const validateForm = (): boolean => {
    if (!email || !password) {
      dispatch(setError('Заполните все обязательные поля'));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      dispatch(setError('Введите корректный email адрес'));
      return false;
    }

    if (password.length < 6) {
      dispatch(setError('Пароль должен содержать минимум 6 символов'));
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      handleBasicAuth();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Card sx={{width: '100%', maxWidth: 480}}>
          <CardContent sx={{p: 4}}>
            <Stack spacing={3}>
              {/* Auth Mode Toggle */}
              <ToggleButtonGroup
                value={authMode}
                exclusive
                onChange={handleAuthModeChange}
                aria-label="auth mode"
                fullWidth
                sx={{
                  '& .MuiToggleButton-root': {
                    py: 1.5,
                    fontWeight: 600,
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'primary.contrastText',
                      '&:hover': {
                        bgcolor: 'primary.dark'
                      }
                    }
                  }
                }}
              >
                <ToggleButton value="signin" aria-label="sign in">
                  Вход
                </ToggleButton>
                <ToggleButton value="signup" aria-label="sign up">
                  Регистрация
                </ToggleButton>
              </ToggleButtonGroup>

              {authError && (
                <Alert severity="error" sx={{width: '100%'}}>
                  {authError}
                </Alert>
              )}

              {authMode === 'signin' ? (
                // LOGIN FORM
                <Stack spacing={3}>
                  {/* Basic Auth Form */}
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Email address"
                        placeholder="Enter your email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        variant="outlined"
                      />
                      
                      <Box>
                        <TextField
                          fullWidth
                          label="Password"
                          placeholder="Enter your password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          variant="outlined"
                          slotProps={{
                            input: {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                    size="small"
                                  >
                                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                  </IconButton>
                                </InputAdornment>
                              )
                            }
                          }}
                        />
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1}}>
                          <Typography
                            component={Link}
                            to="/forgot-password"
                            variant="caption"
                            sx={{
                              color: 'primary.main',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline'
                              }
                            }}
                          >
                            Forgot password?
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          bgcolor: 'text.primary',
                          color: 'background.default',
                          '&:hover': {
                            bgcolor: 'text.secondary'
                          }
                        }}
                      >
                        {isLoading ? 'Загрузка...' : 'Log In'}
                      </Button>
                    </Stack>
                  </Box>

                  {/* Divider */}
                  <Divider sx={{position: 'relative'}}>
                    <Typography variant="caption" sx={{px: 2, bgcolor: 'background.paper'}}>
                      OR
                    </Typography>
                  </Divider>

                  {/* OAuth Buttons */}
                  <Stack spacing={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<GitHubIcon />}
                      onClick={handleGitHubSignIn}
                      disabled={isLoading}
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.3)',
                          bgcolor: 'rgba(255,255,255,0.05)'
                        }
                      }}
                    >
                      Continue with GitHub
                    </Button>
                  </Stack>

                  {/* Footer Link */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      textAlign: "center"
                    }}>
                    Don't have an account yet?{' '}
                    <Typography
                      component="button"
                      variant="body2"
                      onClick={() => setAuthMode('signup')}
                      sx={{
                        color: 'primary.main',
                        bgcolor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Sign up
                    </Typography>
                  </Typography>
                </Stack>
              ) : (
                // SIGN UP FORM
                <Stack spacing={3}>
                  {/* OAuth Buttons */}
                  <Stack spacing={1.5}>
                    <Button
                      fullWidth
                      variant="outlined"
                      size="large"
                      startIcon={<GitHubIcon />}
                      onClick={handleGitHubSignIn}
                      disabled={isLoading}
                      sx={{
                        py: 1.5,
                        fontSize: '1rem',
                        fontWeight: 600,
                        borderColor: 'rgba(255,255,255,0.2)',
                        color: 'text.primary',
                        '&:hover': {
                          borderColor: 'rgba(255,255,255,0.3)',
                          bgcolor: 'rgba(255,255,255,0.05)'
                        }
                      }}
                    >
                      Continue with GitHub
                    </Button>
                  </Stack>

                  {/* Divider */}
                  <Divider sx={{position: 'relative'}}>
                    <Typography variant="caption" sx={{px: 2, bgcolor: 'background.paper'}}>
                      OR
                    </Typography>
                  </Divider>

                  {/* Basic Auth Form */}
                  <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                      <TextField
                        fullWidth
                        label="Email address"
                        placeholder="Enter your email address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        variant="outlined"
                      />
                      
                      <TextField
                        fullWidth
                        label="Password"
                        placeholder="Enter your password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        variant="outlined"
                        slotProps={{
                          input: {
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  onClick={() => setShowPassword(!showPassword)}
                                  edge="end"
                                  size="small"
                                >
                                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                </IconButton>
                              </InputAdornment>
                            )
                          }
                        }}
                      />

                      <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        size="large"
                        disabled={isLoading}
                        sx={{
                          py: 1.5,
                          fontSize: '1rem',
                          fontWeight: 600,
                          bgcolor: 'text.primary',
                          color: 'background.default',
                          '&:hover': {
                            bgcolor: 'text.secondary'
                          }
                        }}
                      >
                        {isLoading ? 'Загрузка...' : 'Create an account'}
                      </Button>
                    </Stack>
                  </Box>

                  {/* Email Updates Checkbox */}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={emailUpdates}
                        onChange={(e) => setEmailUpdates(e.target.checked)}
                        sx={{
                          color: 'text.secondary',
                          '&.Mui-checked': {
                            color: 'primary.main'
                          }
                        }}
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{
                        color: "text.secondary"
                      }}>
                        Please keep me updated by email with the latest news, research findings, reward programs, event updates.
                      </Typography>
                    }
                  />

                  {/* Footer Link */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      textAlign: "center"
                    }}>
                    Already have an account?{' '}
                    <Typography
                      component="button"
                      variant="body2"
                      onClick={() => setAuthMode('signin')}
                      sx={{
                        color: 'primary.main',
                        bgcolor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Login
                    </Typography>
                  </Typography>
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
