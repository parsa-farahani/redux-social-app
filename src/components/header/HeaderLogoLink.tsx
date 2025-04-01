import { Box } from "@mui/material";
import { Link } from "react-router-dom";
import asteroidImg from "../../assets/images/asteroid/asteroid-icon.svg";



interface HeaderLogoLinkProps {
   isMdUp: boolean;
}


const HeaderLogoLink = ({ isMdUp }: HeaderLogoLinkProps) => {
   return (
      <Box
         sx={{
            position: isMdUp ? 'relative' : 'absolute',
            left: !isMdUp ? '50%' : '',
            top: !isMdUp ? '50%' : '',
            transform: !isMdUp ? 'translate(-50%, -50%)' : '',
            marginInlineEnd: ".75rem",
         }}
      >
         <Link to="/">
            <img
               src={asteroidImg}
               alt="asteroid home"
               style={{
                  display: "inline-block",
                  width: "40px",
                  height: "40px",
               }}
            />
         </Link>
      </Box>
   );
}
 
export default HeaderLogoLink;