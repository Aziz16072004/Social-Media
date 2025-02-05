import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';

export default function LoadingPost() {
  return (
    <Stack  spacing={1} className='posts'>
        <Box display="flex" alignItems="center" spacing={1} gap={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
            <Skeleton variant="text" width={120} sx={{ marginRight: 1 }} />
            <Skeleton variant="text" width={200} sx={{ marginRight: 1 }} />
            </Box>
        
    </Box>
      <Skeleton variant="rectangular" width="100%"  height="400px" />
      <Box display="flex" alignItems="center"  justifyContent="space-between"  spacing={1}>
        <Box display="flex"spacing={1}>
            <Skeleton variant="rounded" width={40} height={40} sx={{ marginRight: 1 }} />
            <Skeleton variant="rounded" width={40} height={40} sx={{ marginRight: 1 }} />
            <Skeleton variant="rounded" width={40} height={40} sx={{ marginRight: 1 }} />
        </Box>
        <Skeleton variant="rounded" width={40} height={40} sx={{ marginRight: 1 }} />

    </Box>
      <Skeleton variant="rectangular" width="40%"  />
      <Skeleton variant="rectangular" width="25%"  />
      <Skeleton variant="rounded" width="100%" height="40px"  />
    </Stack>
  );
}