import { useParams } from "react-router-dom";
import MainPageLayout from "../layouts/MainPageLayout";
import Grid from "@mui/material/Grid2";
import PostExcerpt from "../components/post/PostExcerpt";
import { useAppSelector } from "../app/hooks";
import {
   selectUserPostsIds,
} from "../features/posts/postsSlice";
import { selectAuthUsername } from "../features/auth/authSlice";
import PostSkeleton from "../components/loading/skeleton/PostSkeleton";
import ErrorMsg from "../components/common/error/ErrorMsg";
import { Divider } from "@mui/material";
import UserInfoSkeleton from "../components/pages/User/UserInfoSkeleton";
import UserInfo from "../components/pages/User/UserInfo";
import { useGetUserQuery } from "../api/apiSlice";
import { useGetPostsQuery } from "../features/posts/postsSlice";
import React from "react";
import { skipToken } from "@reduxjs/toolkit/query";


const MemoizedPostExcerpt = React.memo(PostExcerpt);



const User = () => {

   // rrd
   const { userId } = useParams();

   // redux
 const authUsername = useAppSelector(selectAuthUsername);  // stirng | null
   const {
      data: authUser,
   } = useGetUserQuery(authUsername ?? skipToken, {
      skip: !authUsername,
   });

   const userPostsIds = useAppSelector(state => selectUserPostsIds(state, userId!)) ?? [];
   
   
   const {
      data: user,
      isFetching: isPendingFetchUser,
      isSuccess: isSuccessFetchUser,
      isError: isErrorFetchUser,
   } = useGetUserQuery(userId!);

   const {
      // data: userPosts,  //
      isFetching: isPendingFetchPosts,
      isSuccess: isSuccessFetchPosts,
      isError: isErrorFetchPosts,
      error: postsFetchError,
   } = useGetPostsQuery();

   
   const userPostsTotal = userPostsIds?.length ?? 0;
   // const isAuth = Boolean(authUsername);


   // + User content
   let userContent;
   if (isPendingFetchUser) {
      userContent = (
         <UserInfoSkeleton />
      )
   } else if (isSuccessFetchUser) {
      userContent = (
         <UserInfo user={user!} userPostsTotal={userPostsTotal} />
      )
   } else if (isErrorFetchUser) {
      userContent = (
         <ErrorMsg text="Failed to load the user." />
      )
   } else {
      userContent = (
         <ErrorMsg text="404 - Not Found the user" />
      )
   }


   // + User-Posts content
   let postsContent;
   if (isPendingFetchPosts) {
      postsContent = ["1", "2", "3", "4"].map((e, i) => (
         <Grid key={e} size={{ xs: 12, md: 6 }}>
            <PostSkeleton />
         </Grid>
      ));
   } else if (isSuccessFetchPosts) {
      postsContent = userPostsIds.map((postId) => (
         <Grid key={postId} size={{ xs: 12, md: 6 }}>
            <MemoizedPostExcerpt
               key={postId}
               type="user"
               postId={postId}
               authUser={authUser}
               // authUsername={authUsername}
               // authUserReaction={
               //    isAuth ? (authUserReactions[postId] ?? null) : null
               // }
            />
         </Grid>
      ));
   } else if (isErrorFetchPosts) {
      postsContent = <ErrorMsg text={postsFetchError.toString() ?? "Failed to load Posts"} />;
   }


   return (
      <MainPageLayout title="My Posts">
         {
            userContent
         }
         <Divider/>
         <Grid container spacing={2}>
            {postsContent}
         </Grid>
      </MainPageLayout>
   );
};

export default User;
