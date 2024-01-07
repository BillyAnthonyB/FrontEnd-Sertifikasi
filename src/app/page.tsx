//menandakan bahwa page ini adalah client (Next JS)
'use client'

//Import React
import * as React from 'react';

//Import MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Image from 'next/image';
import Grid  from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "@fontsource/poppins";

//Untuk ganti font
const theme = createTheme({
  typography: {
     fontFamily: 'Poppins',
  },
 });

export default function Home() {
  return (
      <>
        <ThemeProvider theme={theme}>

          {/* Navbar */}
          <AppBar sx={{mt: 1}} position="static" color='inherit' elevation={0}> 
            <Toolbar>
              <Typography variant="h5" component="div" sx={{ flexGrow: 1 , fontWeight: 600, ml: 1}}>
                LIBRARY
              </Typography>
              <Link href='/'>
                <Button sx={{mr: 2, color: 'black', fontSize: 20, fontWeight: 600}}>Home</Button>
              </Link>
              <Link href='/catalogue'>
                <Button color="inherit" sx={{mr: 2, color: 'black', fontSize: 20, fontWeight: 600}}>Catalogue</Button>
              </Link>
              <Link href='/borrow'>
                <Button color="inherit" sx={{mr: 2, color: 'black', fontSize: 20, fontWeight: 600}}>Loan List</Button>
              </Link>
            </Toolbar>
          </AppBar>

          {/* Content Body yang berisi image dan dua button (see catalogue & Borrow a book) */}
          <Grid container spacing={2} sx={{mt:15}}>
            <Grid item xs={6}>
              <Box sx={{textAlign: 'center'}}>
                <Image src="/homeimage.png" alt='homepict' width={650} height={500}></Image>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="h3" component="div" sx={{ flexGrow: 1, mt: 25, fontWeight: 600}}>
                Welcome to Our Library !
              </Typography>
              <Stack direction='row' sx={{mt:3}} spacing={3}>
                <Link href='/catalogue'>
                  <Button variant='contained' size='large' sx={{backgroundColor: '#263238', '&:hover': {backgroundColor: '#455a64'}}}>
                    See Catalogue
                  </Button>
                </Link>
                <Link href='/borrow'>
                  <Button variant='contained' size='large' sx={{backgroundColor: '#263238', '&:hover': {backgroundColor: '#455a64'}}}>
                    Borrow a Book
                  </Button>
                </Link>
              </Stack>
            </Grid>
          </Grid>
        </ThemeProvider>

      </>


  )
}
