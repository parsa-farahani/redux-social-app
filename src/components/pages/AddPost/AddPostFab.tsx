import React from "react"
import { Fab } from "@mui/material"
import { MdLibraryAdd } from "react-icons/md"
import { Link } from "react-router-dom"

let AddPostFab = React.memo(
   () => {

      return (
         <Fab size="large" color="primary" aria-label="add" sx={{ bgcolor: "primary.dark", fontSize: '1.2rem', position: 'absolute', zIndex: 99, right: '1rem', bottom: '3rem', width: '70px', height: '70px' }}>
            <Link to='/add-post' style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: '1.8rem' }} >
               <MdLibraryAdd />
            </Link>
         </Fab>
      )
   }
)

export default AddPostFab