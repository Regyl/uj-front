import {useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Alert, Box, Card, CardContent, LinearProgress, Stack, Typography} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {AppDispatch, RootState} from '../../store';
import {clearError, fetchMemesAsync, setError, uploadMemeAsync} from '../../store/slices/memesSlice';

export const MemeUploader = () => {
  const dispatch = useDispatch<AppDispatch>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const uploading = useSelector((state: RootState) => state.memes.uploading);
  const error = useSelector((state: RootState) => state.memes.error);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      dispatch(setError('Пожалуйста, выберите изображение'));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      dispatch(setError('Размер файла не должен превышать 10MB'));
      return;
    }

    try {
      await dispatch(uploadMemeAsync(file)).unwrap();
      // Refresh memes list after successful upload
      dispatch(fetchMemesAsync());
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      <CardContent sx={{p: 3}}>
        <Stack spacing={2}>
          <Typography variant="h6">Загрузить мем</Typography>
          
          {error && (
            <Alert severity="error" onClose={() => dispatch(clearError())}>
              {error}
            </Alert>
          )}

          <Box
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleClick}
            sx={{
              border: '2px dashed',
              borderColor: dragActive ? 'primary.main' : 'rgba(255,255,255,0.2)',
              borderRadius: 3,
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              bgcolor: dragActive ? 'rgba(90, 228, 167, 0.05)' : 'transparent',
              '&:hover': {
                borderColor: 'primary.main',
                bgcolor: 'rgba(90, 228, 167, 0.05)'
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files)}
              disabled={uploading}
            />
            
            <Stack spacing={2} sx={{
              alignItems: "center"
            }}>
              {uploading ? (
                <>
                  <LinearProgress sx={{width: '100%', maxWidth: 300}} />
                  <Typography variant="body2" sx={{
                    color: "text.secondary"
                  }}>
                    Загрузка...
                  </Typography>
                </>
              ) : (
                <>
                  <CloudUploadIcon sx={{fontSize: 48, color: 'text.secondary'}} />
                  <Stack spacing={0.5}>
                    <Typography variant="body1" sx={{
                      fontWeight: 600
                    }}>
                      Перетащите файл сюда или нажмите для выбора
                    </Typography>
                    <Typography variant="caption" sx={{
                      color: "text.secondary"
                    }}>
                      Поддерживаются изображения до 10MB
                    </Typography>
                  </Stack>
                </>
              )}
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

