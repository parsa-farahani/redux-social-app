import { Box, Skeleton, Stack } from "@mui/material";

const UserSkeleton = () => {
   return (
      <Stack direction="column" alignItems="center" spacing={1} >
         <Skeleton variant="circular" width={40} height={40} />
         <Skeleton variant="rounded" height={40} sx={{ width: '100%' }} />
      </Stack>
   );
}
 
export default UserSkeleton;