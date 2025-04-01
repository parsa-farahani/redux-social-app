import { createAsyncThunk, createEntityAdapter, createSlice, type PayloadAction, type EntityState, isRejected, createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import { addCommentServer, deleteCommentServer, getCommentsServer, updateCommentServer } from "../../services/commentsServices";


export interface Comment {
   id: string;
   content: string;
   userId: string;
   postId: string;
   date: string;
}

const commentsAdapter = createEntityAdapter<Comment>({
   sortComparer: (a, b) => b.date.localeCompare(a.date),
})



type Status = 'idle' | 'pending' | 'succeed' | 'failed';
interface CommentsStatus {
   [index: string]: Status;
   fetchComments: Status;
   addComment: Status;
   editComment: Status;
   deleteComment: Status;
}


type OpError = string | null;
interface CommentsError {
   [index: string]: OpError;
   fetchComments: OpError;
   addComment: OpError;
   editComment: OpError;
   deleteComment: OpError;
}
interface CommentsState extends EntityState<Comment, string> {
   status: CommentsStatus;
   error: CommentsError;
}


const initialState: CommentsState = commentsAdapter.getInitialState({
   status: {
      fetchComments: 'idle',
      addComment: 'idle',
      editComment: 'idle',
      deleteComment: 'idle',
   },
   error: {
      fetchComments: null,
      addComment: null,
      editComment: null,
      deleteComment: null,
   }
})


const commentsSlice = createSlice({
   name: 'comments',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
      .addCase(fetchComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
         commentsAdapter.setAll(state, action.payload);
         state.status.fetchComments = 'succeed';
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
         commentsAdapter.addOne(state, action.payload);
         state.status.addComment = 'succeed';
      })
      .addMatcher(
         (action) => {
            return (
               ['fetchComments', 'editComment', 'addComment', 'deleteComment'].includes(action.type.slice(0, action.type.indexOf('/'))) &&
               action.type.slice(action.type.indexOf('/') + 1) === 'pending'
            )
         },
         (state, action) => {
            const op = action.type.slice(0, action.type.indexOf('/'));
            state.status[op] = 'pending';
         } 
      )
      .addMatcher(
         isRejected(fetchComments, editComment, addComment, deleteComment),
         (state, action) => {
           const op = action.type.split('/')[0];
           state.status[op] = 'failed';
           state.error[op] = (
             action.payload as { message: string } || 
             action.error as { message: string } || 
             { message: 'Unknown Error' }
           ).message;
         }
      )
   }
});



// Thunks
export const fetchComments = createAsyncThunk('fetchComments', async () => {
   const response = await getCommentsServer();
   return response.data;
});

export const addComment = createAsyncThunk('addComment', async (comment: Comment) => {
   const response = await addCommentServer(comment);
   return response.data;
});

export const editComment = createAsyncThunk('editComment', async (comment: Comment) => {
   const response = await updateCommentServer(comment, comment.id);
   return response.data;
});

export const deleteComment = createAsyncThunk('deleteComment', async (commentId: string) => {
   const response = await deleteCommentServer(commentId);
   return response.data;
});


// Listeners

// Selectors
export const {
   selectAll: selectAllComments,
   selectById: selectCommentById,
   selectIds: selectCommentsIds,
} = commentsAdapter.getSelectors((state: RootState) => state.comments);

export const selectPostCommentsByPostId = createSelector(  // args: state, postId
   selectAllComments,
   (state: RootState, postId: string) => postId,
   (allComments, postId) => allComments.filter(comment => comment.postId === postId)
)

export const selectCommentsStatus = (state: RootState) => state.comments.status;
export const selectCommentsError = (state: RootState) => state.comments.error;


// Actions


export default commentsSlice;