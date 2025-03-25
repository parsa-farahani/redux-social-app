import { Avatar, Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { blue, deepOrange, green, pink, yellow } from "@mui/material/colors";
import { FaUserLarge } from "react-icons/fa6";
import { randomNum } from "../../utils/random/randomNum";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UserExcerptProps {
   user: {
      id: string;
      name: string;
   }
}


const avatarColors: { [index: number]: string } = {
   1: green[500],
   2: yellow[500],
   3: blue[500],
   4: pink[500],
   5: deepOrange[500],
};



const UserExcerpt = ({user}: UserExcerptProps) => {

   // states
   const [avatarColor, setAvatarColor] = useState<string>(pink[500]);
  
   // rrd
   const navigate = useNavigate();
   

   useEffect(() => {
      const randomIndex = randomNum(1, 5);
      const randomColor = avatarColors[randomIndex];
      setAvatarColor( randomColor );
   }, []);


   return (
      <Card>
         <CardActionArea onClick={() => navigate(`/users/${user.id}`)} >
            <CardContent>
               <Stack
                  direction="column"
                  alignItems="center"
               >
                  <Avatar
                     sx={{ marginBottom: '1rem', bgcolor: avatarColor, color: "#222" }}
                  >
                     {
                        user.name[0] || <FaUserLarge />
                     }
                  </Avatar>
                  <Typography>
                     {
                        user.name
                     }
                  </Typography>
               </Stack>
            </CardContent>
         </CardActionArea>
      </Card>
   );
}
 
export default UserExcerpt;