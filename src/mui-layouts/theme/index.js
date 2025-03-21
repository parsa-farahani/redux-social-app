import { createTheme } from "@mui/material";


const sharedStyles = {
   direction: 'ltr',
   // typography: {
   //    fontFamily: 'byekan, roboto',
   //    button: {
   //       textTransform: 'none',
   //    }
   // },
   // components: {
   //    MuiAvatar: {
   //       variants: [
   //          {
   //             props: {variant: 'rounded'},
   //             style: {
   //                borderRadius: 10,
   //             }
   //          }
   //       ]
   //    },
   //    MuiButtonBase: {
   //       styleOverrides: {
   //          root: {
   //             textTransform: 'none'
   //          }
   //       }
   //    },
   //    MuiButton: {
   //       styleOverrides: {
   //          root: {
   //             textTransform: 'none'
   //          }
   //       }
   //    }
   // }
}

export const lightTheme = createTheme({
   ...sharedStyles,
   palette: {
      mode: 'light',
      primary: {
         main: '#1976d2',
      },
      secondary: {
         main: '#a05709',
      },
      pink: {
         main: '#860bbf',
      },
      red: {
         main: '#DF739E'
      },
      background: {
         paper: '#ddd',
         default: '#ddd'
      },
      text: {
         primary: '#111',
         secondary: '#202020',
         dispbled: '202020a1',
      },
   },
})

export const darkTheme = createTheme({
   ...sharedStyles,
   palette: {
      mode: 'dark',
      primary: {
         main: '#0CCDD1',
      },
      secondary: {
         main: '#E4B781',
      },
      pink: {
         main: '#C672EC',
      },
      red: {
         main: '#DF739E'
      },
      background: {
         paper: '#111',
         default: '#111'
      },
      text: {
         primary: '#eee',
         secondary: '#ddd',
         disabled: '#bbbbbba1',
      },
   },
})