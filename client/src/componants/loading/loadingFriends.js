import * as React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { Box } from '@mui/material';

export default function LoadingFriends() {
  return (
    <Stack  spacing={1} className='posts'>
        <Box display="flex" alignItems="center" spacing={1} gap={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
            <Skeleton variant="text" width={120} sx={{ marginRight: 1 }} />
            <Skeleton variant="text" width={200} sx={{ marginRight: 1 }} />
            </Box>
        
    </Box>
     
     
    </Stack>
  );
}