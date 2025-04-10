import { Skeleton, Stack } from "@mui/material";

const UserInfoSkeleton = () => {
   return (
      <Stack direction="row" justifyContent="flex-start" spacing={1} sx={{ marginBlock: '1.5rem' }} >
         <Skeleton variant="circular" sx={{ height: '60px', width: '60px' }} />
         <Skeleton variant="rounded" sx={{ height: '60px', width: '140px' }} />
      </Stack>
   );
}
 
export default UserInfoSkeleton;