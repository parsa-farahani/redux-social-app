import { Box, CssBaseline, Divider, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PostExcerpt from "../components/post/PostExcerpt";
import MainPageLayout from "../layouts/MainPageLayout";
import Spinner from "../components/loading/spinner/Spinner";
import PostSkeleton from "../components/loading/skeleton/PostSkeleton";

const fakePosts = [
   {
      id: "1",
      title: "Post 1",
      content: "post 1 content lkdlan alsdlak",
      userId: "2",
      date: new Date().toISOString(),
      reactions: {
         like: 0,
         dislike: 0,
      },
   },
   {
      id: "2",
      title: "Post 2",
      content: "post 2 content lkdlan alsdlak",
      userId: "1",
      date: new Date().toISOString(),
      reactions: {
         like: 0,
         dislike: 0,
      },
   },
   {
      id: "3",
      title: "Post 3",
      content: "post 3 content lkdlan alsdlak",
      userId: "3",
      date: new Date().toISOString(),
      reactions: {
         like: 0,
         dislike: 0,
      },
   },
];

const Posts = () => {
   return (
      <MainPageLayout title="All Posts">
         <Grid container spacing={2}>
            {
               ['1', '2', '3', '4'].map((e, i) => (
                  <Grid key={e} size={{ xs: 12, md: 6 }} >
                     <PostSkeleton />
                  </Grid>
               ))
            }
            {fakePosts.map((post) => (
               <Grid key={post.id} size={{ xs: 12, md: 6 }}>
                  <PostExcerpt post={post} type="posts" />
               </Grid>
            ))}
         </Grid>
      </MainPageLayout>
   );
};

export default Posts;
