import { useParams } from "react-router-dom";
import MainPageLayout from "../layouts/MainPageLayout";
import Grid from "@mui/material/Grid2";
import PostExcerpt from "../components/post/PostExcerpt";


const fakeUserPosts = [
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

const User = () => {

   // rrd
   const { userId } = useParams();

   return (
      <MainPageLayout title="User">
         <Grid container spacing={2}>
            {fakeUserPosts.map((post) => (
               <Grid key={post.id} size={{ xs: 12, md: 6 }}>
                  <PostExcerpt type="user" post={post} />
               </Grid>
            ))}
         </Grid>
      </MainPageLayout>
   );
}
 
export default User;