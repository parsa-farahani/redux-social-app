import { BiDislike, BiLike, BiSolidDislike, BiSolidLike } from "react-icons/bi";


export const postReactions = {
   like: {
      normal: <BiLike />,
      active: <BiSolidLike />,
   },
   dislike: {
      normal: <BiDislike />,
      active: <BiSolidDislike />,
   }
};