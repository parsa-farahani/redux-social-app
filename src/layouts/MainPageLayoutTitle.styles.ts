import { Box, type BoxProps, styled } from "@mui/material";
import { blue, indigo, pink, teal } from "@mui/material/colors";


interface MainPageLayoutTitleContProps extends BoxProps {
   component?: React.ElementType,
}

export const MainPageLayoutTitleCont = styled(Box)<MainPageLayoutTitleContProps>(({ theme }) => ({
   position: "absolute",
   zIndex: 99,
   left: "50%",
   transform: "translateX(-50%)",
   top: `calc(${theme.mixins.toolbar.minHeight}px + 10px)`,
   padding: ".5rem 1.5rem",
   borderRadius: ".5rem",
   borderTopLeftRadius: "0",
   borderTopRightRadius: "0",
   overflow: "visible",
   "&::before": {
      content: '""',
      position: "absolute",
      zIndex: -1,
      inset: "-2px",
      borderRadius: "inherit",
      background: `
         linear-gradient(
            -10deg,
            ${pink[700]},
            15%,
            ${blue[500]},
            40%,
            transparent 50%,
            transparent
         ),
         radial-gradient(
            30px circle at 0% 70%,
            ${teal[300]},
            ${indigo[300]},
            transparent
         )
      `,
   },
   "&::after": {
      content: '""',
      position: "absolute",
      zIndex: -1,
      inset: 0,
      borderRadius: "inherit",
      background: theme.palette.background.default,
   },
}));


interface MainPageLayoutTitleCornerProps extends BoxProps {
   component?: React.ElementType,
}

export const MainPageLayoutTitleLeftCorner = styled(Box)<MainPageLayoutTitleCornerProps>(({ theme }) => ({
   position: "absolute",
   right: "100%",
   width: "60px",
   height: "60px",
   borderRadius: ".5rem",

   "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background: `
         linear-gradient(
         -150deg,
            ${blue[800]},
            10%,
            transparent 20%,
            transparent
         )
      `,
   },
   "&::after": {
      content: '""',
      position: "absolute",
      inset: "1px",
      borderRadius: "inherit",
      background: theme.palette.background.default,
   },
}));

export const MainPageLayoutTitleRightCorner = styled(Box)<MainPageLayoutTitleCornerProps>(({ theme }) => ({
   position: "absolute",
   left: "100%",
   width: "60px",
   height: "60px",
   borderRadius: ".5rem",

   "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "inherit",
      background: `
         linear-gradient(
            150deg,
            ${blue[800]},
            10%,
            transparent 20%,
            transparent
         )
      `,
   },
   "&::after": {
      content: '""',
      position: "absolute",
      inset: "1px",
      borderRadius: "inherit",
      background: theme.palette.background.default,
   },
}));
