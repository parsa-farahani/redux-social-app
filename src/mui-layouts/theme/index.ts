import {
   type Components,
   createTheme,
   type Palette,
   PaletteOptions,
   type ThemeOptions,
} from "@mui/material";
import Lato from "/src/assets/fonts/Lato/Lato-Regular.ttf";


const sharedStyles: ThemeOptions = {
   direction: "ltr",
   typography: {
      fontFamily: "Lato, serif", // I put 'serif' here, to check if the font 'Lato' is applied or not, I should pick this from here later...
      h1: {         
         fontWeight: 'bold',
      },
      h2: {         
         fontWeight: 'bold',
      },
      h3: {         
         fontWeight: 'bold',
      },
      h4: {         
         fontWeight: 'bold',
      },
      h5: {         
         fontWeight: 'bold',
      },
      h6: {         
         fontWeight: 'bold',
      },
      body1: {
         // fontSize: '1rem',
      },
      button: {
         textTransform: "none" as const,
      },
   },
   components: {
      MuiModal: {
         defaultProps: {
            disableScrollLock: true,
         }
      },
      MuiCssBaseLine: {
         styleOverrides: {
            "@font-face": {
               fontFamily: "Lato",
               src: `url(${Lato}) format('truetype')`,
            },
         },
      },
      MuiButtonBase: {
         variants: [],
         styleOverrides: {
            root: {
               textTransform: "none" as const,
            },
         },
      },
      MuiButton: {
         variants: [],
         styleOverrides: {
            root: {
               textTransform: "none" as const,
               // '&[disabled]': {
               //    // opacity: .5,
               // }
            },
         },
      },
      MuiDivider: {
         styleOverrides: {
            root: {
               marginTop: '1rem',
               marginBottom: '1rem',
            }
         }
      }
   } as Components,
};

export const lightTheme = createTheme({
   ...sharedStyles,
   palette: {
      mode: "light",
      primary: {
         main: "#FF1744",
      },
      secondary: {
         main: "#018786",
      },
      background: {
         paper: "#eee",
         default: "#eee",
      },
      text: {
         primary: "#111",
         secondary: "#202020",
         disabled: "#202020a1",
      },
      divider: "#202020",
      action: {
         disabledBackground: "#55555550",
         disabledOpacity: 0.5,
         hoverOpacity: 0.1,
         selectedOpacity: 0.12,
         disabled: "#11111150",
      },
   },
});

export const darkTheme = createTheme({
   ...sharedStyles,
   palette: {
      mode: "dark",
      primary: {
         main: "#FF1744",
      },
      secondary: {
         main: "#03dac6",
      },
      background: {
         paper: "#111",
         default: "#111",
      },
      text: {
         primary: "#eee",
         secondary: "#ddd",
         disabled: "#bbbbbba1",
      },
      divider: "#55555570",
      action: {
         disabledBackground: "#55555550",
         disabledOpacity: 0.5,
         hoverOpacity: 0.1,
         selectedOpacity: 0.12,
         // disabled: "#ffffff",
      },
   },
});
