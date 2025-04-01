import * as Yup from 'yup';

export const addCommentSchema = Yup.object().shape({
   content: Yup.string().required("Please write something..."),
});