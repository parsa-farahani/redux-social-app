import { Box, Skeleton, Stack } from "@mui/material";

const PostSkeleton = () => {
   return (
      <Stack direction="column" spacing={1} sx={{ height: '240px', position: 'relative', zIndex: 0 }} >
         <Stack direction="row" spacing={1} >
            <Skeleton variant="circular" width={40} height={40} />
            <Skeleton variant="rounded" height={40} sx={{ flexGrow: '1' }} />
         </Stack>
         <Skeleton variant="rounded" sx={{ flexGrow: 1, minHeight: '80px' }} />
      </Stack>
   );
}
 
export default PostSkeleton;