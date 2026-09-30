import {useEffect, useMemo} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Box, CircularProgress, Container, Typography} from '@mui/material';
import {AppDispatch} from '../store';
import {logout, setError, setLoading, setTokens} from '../store/slices/authSlice';
import {exchangeCodeForTokenSignIn, exchangeCodeForTokenSignUp} from '../services/authService';

export const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  // Extract params once and memoize to prevent unnecessary re-renders
  const code = useMemo(() => searchParams.get('code'), [searchParams]);
  const state = useMemo(() => searchParams.get('state'), [searchParams]);
  const error = useMemo(() => searchParams.get('error'), [searchParams]);

  // Extract auth mode from state (format: "randomState_signin" or "randomState_signup")
  const authMode = useMemo(() => {
    if (!state) return null;
    const parts = state.split('_');
    return parts[parts.length - 1] as 'signin' | 'signup' | null;
  }, [state]);

  useEffect(() => {
    const handleCallback = async () => {

      if (error) {
        dispatch(setError(`Ошибка авторизации: ${error}`));
        dispatch(setLoading(false));
        navigate('/signin');
        return;
      }

      if (!code) {
        dispatch(setError('Код авторизации не получен'));
        dispatch(setLoading(false));
        navigate('/signin');
        return;
      }

      if (!authMode || (authMode !== 'signin' && authMode !== 'signup')) {
        dispatch(setError('Неверный режим авторизации'));
        dispatch(setLoading(false));
        navigate('/signin');
        return;
      }

      try {
        dispatch(setLoading(true));
        dispatch(setError(null));

        // Exchange code for tokens using appropriate method
        const tokenResponse = authMode === 'signin' 
          ? await exchangeCodeForTokenSignIn(code, state || '')
          : await exchangeCodeForTokenSignUp(code, state || '');
        
        // Save both access and refresh tokens
        dispatch(setTokens({
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken
        }));

        dispatch(setLoading(false));
        
        // Redirect to dashboard
        navigate('/');
      } catch (error: any) {
        dispatch(setError(error.message || 'Ошибка при авторизации'));
        dispatch(setLoading(false));
        dispatch(logout());
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code, state, error, authMode]);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" sx={{
          color: "text.secondary"
        }}>
          Завершение авторизации...
        </Typography>
      </Box>
    </Container>
  );
};

