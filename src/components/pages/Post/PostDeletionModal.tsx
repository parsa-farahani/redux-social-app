import { Button, IconButton, Modal, Stack, Typography } from "@mui/material";
import { IoMdClose } from "react-icons/io";
import { PostDeletionModalInner } from "./PostDeletionModal.styles";



interface PostDeletionModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSubmit: () => void;
}


const PostDeletionModal = ( { isOpen, onClose, onSubmit }: PostDeletionModalProps ) => {
   return (
      <Modal
         open={isOpen}
         onClose={onClose}
         aria-labelledby="modal-modal-title"
         aria-describedby="modal-modal-description"
      >
         <PostDeletionModalInner>
            <IconButton
               onClick={onClose}
               size="small"
               sx={{
                  position: "absolute",
                  right: "1rem",
                  top: "1rem",
               }}
            >
               <IoMdClose />
            </IconButton>
            <Typography
               id="modal-modal-title"
               variant="h6"
               component="h2"
               sx={{ marginBottom: "2rem" }}
            >
               Are you sure to delete this post? 🤔
            </Typography>
            <Stack
               direction="row"
               alignItems="center"
               justifyContent="center"
               spacing={1}
            >
               <Button
                  variant="outlined"
                  onClick={onClose}
                  color="secondary"
                  sx={{ flex: 1, borderRadius: "100vw" }}
               >
                  No
               </Button>
               <Button
                  variant="outlined"
                  onClick={onSubmit}
                  color="secondary"
                  sx={{ flex: 1, borderRadius: "100vw" }}
               >
                  Yes
               </Button>
            </Stack>
         </PostDeletionModalInner>
      </Modal>
   );
}
 
export default PostDeletionModal;