import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, Box, Card, CardMedia, Grid, Stack, Typography} from '@mui/material';
import {AppDispatch, RootState} from '../../store';
import {clearError, fetchMemesAsync} from '../../store/slices/memesSlice';
import {SectionHeader} from '../widgets/SectionHeader';
import ImageIcon from '@mui/icons-material/Image';
import DefaultSkeleton from "../DefaultSkeleton";
import DefaultErrorLoading from "../DefaultErrorLoading";

export const MemeGallery = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {memes, loading, error} = useSelector((state: RootState) => state.memes);

  useEffect(() => {
    dispatch(fetchMemesAsync());
  }, [dispatch]);

    if (loading) return <DefaultSkeleton/>
    if (error) return <DefaultErrorLoading/>

  if (memes.length === 0) {
    return (
      <Stack spacing={3}>
        <SectionHeader
          title="Реестр мемов"
          subtitle="Коллекция сохраненных мемов"
          icon={<ImageIcon color="primary" />}
        />
        <Card sx={{p: 4, textAlign: 'center'}}>
          <Stack spacing={2} sx={{
            alignItems: "center"
          }}>
            <ImageIcon sx={{fontSize: 64, color: 'text.secondary', opacity: 0.5}} />
            <Typography variant="h6" sx={{
              color: "text.secondary"
            }}>
              Пока нет мемов
            </Typography>
            <Typography variant="body2" sx={{
              color: "text.secondary"
            }}>
              Загрузите первый мем, чтобы начать коллекцию
            </Typography>
          </Stack>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <SectionHeader
        title="Реестр мемов"
        subtitle={`${memes.length} ${memes.length === 1 ? 'мем' : memes.length < 5 ? 'мема' : 'мемов'}`}
        icon={<ImageIcon color="primary" />}
      />

      {error && (
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {memes.map((meme) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={meme.id}>
            <Card
              sx={{
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                }
              }}
            >
              <CardMedia
                component="img"
                image={meme.presignedUri}
                alt={meme.fileName}
                sx={{
                  width: '100%',
                    height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer'
                }}
                onClick={() => window.open(meme.presignedUri, '_blank')}
              />
              <Box sx={{p: 1.5}}>
                <Typography
                  variant="caption"
                  title={meme.fileName}
                  sx={{
                    color: "text.secondary",
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                  {meme.fileName}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
};

