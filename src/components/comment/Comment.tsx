import { Avatar, Card, CardActionArea, CardContent, CardHeader, Typography } from "@mui/material";
import { purple } from "@mui/material/colors";
import { FaUserLarge } from "react-icons/fa6";

const Comment = () => {
   return (
      <Card
         variant="elevation"
         elevation={1}
         sx={{
            border: "1px solid transparent",
            borderColor: "text.disabled",
         }}
      >
         <CardActionArea>
            <CardHeader
               avatar={
                  <Avatar sx={{ bgcolor: purple[400], color: "#222" }}>
                     <FaUserLarge />
                  </Avatar>
               }
               title={"user name"}
               subheader={new Date().toLocaleString()}
            />
         </CardActionArea>
         <CardContent>
            <Typography>
               Lorem ipsum dolor sit amet consectetur adipisicing elit. Est,
               consequuntur.
            </Typography>
         </CardContent>
      </Card>
   );
};

export default Comment;
