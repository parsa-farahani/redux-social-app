import { useParams } from "react-router-dom";
import MainPageLayout from "../layouts/MainPageLayout";
import Grid from "@mui/material/Grid2";
import PostExcerpt from "../components/post/PostExcerpt";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
   fetchPosts,
   selectPostsError,
   selectPostsStatus,
   selectUserPosts,
} from "../features/posts/postsSlice";
import React, { useEffect, useState } from "react";
import {
   fetchUser,
   selectUserById,
   selectUserReactions,
} from "../features/users/usersSlice";
import { selectAuthUsername } from "../features/auth/authSlice";
import PostSkeleton from "../components/loading/skeleton/PostSkeleton";
import ErrorMsg from "../components/common/error/ErrorMsg";
import { Avatar, Box, Divider, Skeleton, Stack, Typography } from "@mui/material";
import { FaUserLarge } from "react-icons/fa6";
import { pink, red } from "@mui/material/colors";
import UserInfoSkeleton from "../components/pages/User/UserInfoSkeleton";
import UserInfo from "../components/pages/User/UserInfo";

const MemoizedPostExcerpt = React.memo(PostExcerpt);


const User = () => {
   // states
   const [userFetchStatus, setUserFetchStatus] = useState<'idle' | 'pending' | 'failed' | 'succeed'>("idle");

   // rrd
   const { userId } = useParams();

   // redux
   const dispatch = useAppDispatch();
   const userPostsIds =
      useAppSelector((state) => selectUserPosts(state, userId!)) ?? [];
   // const userRactions = useAppSelector(state => selectUserReactions(state, userId!));
   const authUsername = useAppSelector(selectAuthUsername);
   const authUserReactions = useAppSelector((state) =>
      selectUserReactions(state, authUsername!),
   );
   const { fetchPosts: postsFetchStatus } = useAppSelector(selectPostsStatus);
   const { fetchPosts: postsFetchError } = useAppSelector(selectPostsError);

   const user = useAppSelector((state) => selectUserById(state, userId!));
   const isIdleFetchUser = userFetchStatus === "idle";

   const isAuth = Boolean(authUsername);
   const userPostsTotal = userPostsIds?.length ?? 0;

   // For now i fetch all posts for the user, because i dont have a backend to request user-posts, but it should be fixed when we have a backend to handle it (it is a bug now)
   useEffect(() => {
      if (postsFetchStatus !== "idle") return;
      let ignore = false;

      if (!ignore) {
         dispatch(fetchPosts());
      }

      return () => {
         ignore = true;
      };
   }, [dispatch, postsFetchStatus]);

   // Fetching user-data
   useEffect(() => {
      if (!isIdleFetchUser) return;
      let ignore = false;

      const fetchUserInEffect = async () => {
         setUserFetchStatus("pending");
         try {
            await dispatch(
               fetchUser(userId!)
            ).unwrap();
            setUserFetchStatus("succeed");
         } catch (error) {
            setUserFetchStatus("failed");
         }
      };

      if (!ignore) {
         fetchUserInEffect();
      }

      return () => {
         ignore = true;
      };
   }, [dispatch, isIdleFetchUser, userId]);



   // + User content
   let userContent;
   if (userFetchStatus === 'pending') {
      userContent = (
         <UserInfoSkeleton />
      )
   } else if (userFetchStatus === 'succeed') {
      userContent = (
         <UserInfo user={user} userPostsTotal={userPostsTotal} />
      )
   } else if (userFetchStatus === 'failed') {
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
   if (postsFetchStatus === "pending") {
      postsContent = ["1", "2", "3", "4"].map((e, i) => (
         <Grid key={e} size={{ xs: 12, md: 6 }}>
            <PostSkeleton />
         </Grid>
      ));
   } else if (postsFetchStatus === "succeed") {
      postsContent = userPostsIds.map((postId) => (
         <Grid key={postId} size={{ xs: 12, md: 6 }}>
            <MemoizedPostExcerpt
               key={postId}
               type="user"
               postId={postId}
               authUsername={authUsername}
               authUserReaction={
                  isAuth ? (authUserReactions[postId] ?? null) : null
               }
            />
         </Grid>
      ));
   } else if (postsFetchStatus === "failed") {
      postsContent = <ErrorMsg text={postsFetchError ?? "Unknown Error"} />;
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
