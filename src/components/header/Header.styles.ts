import { Button, styled } from "@mui/material";



export const HeaderNavLink = styled(Button)(( { theme } ) => ({
   padding: 0,
   borderRadius: 0,
   color: theme.palette.text.secondary,
   fontSize: '1.2rem',
   '&:has(a.active)': {
      color: theme.palette.primary.light,
      borderBottom: `1px solid ${theme.palette.primary.light}`,
   },
   '& a:any-link': {
      paddingBlock: '.25rem',
      paddingInline: '.75rem',
   }
}))

export const HeaderOffset = styled('div')(({theme}) => theme.mixins.toolbar);