//menandakan bahwa page ini adalah client (Next JS)
'use client'

//import React
import * as React from 'react';
import { useState, useEffect } from 'react';

//import Axios buat CRUD
import axios from 'axios';

//import MUI
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import  Grid  from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Link from 'next/link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "@fontsource/poppins";

//Untuk ganti font
const theme = createTheme({
  typography: {
     fontFamily: 'Poppins',
  },
 });
 
//function alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


function Catalogue() {

    //Define variable yang digunakan
    const [data, setData] = useState<any[]>([]);
    const [id, setId] = useState<number | string >('');
    const [judul, setJudul] = useState<string>('');
    const [pengarang, setPengarang] = useState<string>('');
    const [penerbit, setPenerbit] = useState<string>('');
    const [tahunTerbit, setTahunTerbit] = useState<number | string>('');
    const [jumlahStok, setJumlahStok] = useState<number | string>('');
    const [errorId, setErrorId] = useState<string | null>(null);
    const [errorTitle, setErrorTitle] = useState<string | null>(null);
    const [errorStok, setErrorStok] = useState<string | null>(null);
    const [existingBooks, setExistingBooks] = useState<string[]>([]);
    const [existingIds, setExistingIds] = useState<number[]>([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openAlert, setOpenAlert] = React.useState(false);


    //get data katalog -> pakai useEffect biar waktu page nya reload langsung get
    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await axios.get('http://localhost:8085/katalog/list')
                const existingTitles = response.data.map((book: any) => book.judul);
                const existingIds = response.data.map((book: any) => book.id);
                setData(response.data);
                setExistingBooks(existingTitles);
                setExistingIds(existingIds);
            } catch (error) {
                console.error('error fetch data', error)
            }
        }
        fetchData();
    }, []);

    //Function submit data / add data ke database
    const handleSubmit = async () => {

        //Validasi
        //validasi field tidak boleh kosong
        if (id === '' || judul === '' || pengarang === '' || penerbit === '' || tahunTerbit === '' || jumlahStok === '') {
            setOpenAlert(true) // kalo kosong keluar alert
            return;
        } 
        //validasi jumlah stok hanya boleh 1 atau 0
        if (jumlahStok !== '0' && jumlahStok !== '1') {
            setErrorStok('Jumlah stok harus 0 atau 1.');
            return;
        }
        //validasi tidak bisa pinjam buku yg sama karena pakai sistem stok 0 dan 1
        if (existingBooks.includes(judul)) {
            setErrorTitle('Judul buku sudah ada di database.');
            return;
        }
        //validasi id tidak bisa sama
        const parsedId = Number(id);
        if (isNaN(parsedId) || existingIds.includes(parsedId)) {
          setErrorId('ID sudah ada di dalam database.');
          return;
        }


        //Add Data ke Database apabila lolos dari validasi
        axios.post('http://localhost:8085/katalog/add', {
            id: Number(id), 
            judul: judul,
            pengarang: pengarang,
            penerbit: penerbit,
            tahunTerbit: Number(tahunTerbit),
            stok: Number(jumlahStok),
        })
        .then(res => {
            console.log(res)
            window.location.reload();
        })
        .catch(err => {
            console.log(err)
        })
    }

    //delete data berdasarkan id
    const handleDelete = async (id: number) => {
        axios.delete(`http://localhost:8085/katalog/delete/${id}`)
        .then(res => {
            console.log(res)
            window.location.reload();
        })
        .catch(err => {
            console.log(err)
        })
    };

    //open dialog saat add data
    const handleClickOpen = () => {
        setOpenDialog(true);
      };
    
    //close dialog
    const handleClose = () => {
        setOpenDialog(false);
    };


    //close alert
    const handleCloseAlert = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenAlert(false);
    };

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

            {/* Content Body */}
            <Box sx={{ml:8, mr: 8, mt: 10}}>
                <Grid container direction='row' justifyContent="space-between" alignItems='center' sx={{mb:8}}>
                    <Typography variant='h4' sx={{fontWeight: 600}}>Catalogue List</Typography>
                    <Button variant='contained'  onClick={handleClickOpen} size='large' sx={{backgroundColor: '#263238', '&:hover': {backgroundColor: '#455a64'}}}>Add Data</Button>
                </Grid>

                {/* menampilkan table */}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align='left'>No</TableCell>
                            <TableCell align="left">Book Title</TableCell>
                            <TableCell align="left">Author</TableCell>
                            <TableCell align="left">Publisher</TableCell>
                            <TableCell align="left">Year</TableCell>
                            <TableCell align="left">Stock</TableCell>
                            <TableCell align="left">Delete</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {data.map((row, index) => (
                            <TableRow
                            key={index+1}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {index+1}
                            </TableCell>
                            <TableCell align="left">{row.judul}</TableCell>
                            <TableCell align="left">{row.pengarang}</TableCell>
                            <TableCell align="left">{row.penerbit}</TableCell>
                            <TableCell align="left">{row.tahunTerbit}</TableCell>
                            <TableCell align="left">{row.stok}</TableCell>
                            <TableCell align="left">
                                <IconButton onClick={() => handleDelete(row.id)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* menampilkan dialog */}
                <Dialog maxWidth='xl' open={openDialog} onClose={handleClose}>
                    <DialogTitle sx={{fontWeight: 600, mt: 1, fontSize: 30}}>Add Data</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Fill this form to add new book into database
                        </DialogContentText>
                        <Stack direction='row' spacing={2} sx={{mt:5}}>
                            <Stack direction='column' spacing={1}>
                                <TextField size='small' type='number' label="Id" value={id} onChange={(e) => setId(e.target.value)}></TextField>
                                {errorId && (
                                    <Typography variant="caption" color="error">
                                        {errorId}
                                    </Typography>
                                )}
                            </Stack>
                            <Stack direction='column' spacing={1}>
                                <TextField size='small' label="Judul Buku" value={judul} onChange={(e) => setJudul(e.target.value)}></TextField>
                                {errorTitle && (
                                    <Typography variant="caption" color="error">
                                        {errorTitle}
                                    </Typography>
                                )}
                            </Stack>            
                            <TextField size='small' label="Pengarang" value={pengarang} onChange={(e) => setPengarang(e.target.value)}></TextField>
                            <TextField size='small' label="Penerbit" value={penerbit} onChange={(e) => setPenerbit(e.target.value)}></TextField>
                            <TextField size='small' type='number' label="Tahun Terbit" value={tahunTerbit} onChange={(e) => setTahunTerbit(e.target.value)}></TextField>
                            <Stack direction='column' spacing={1}>
                                <TextField size='small' type='number' label="Stok" value={jumlahStok} onChange={(e) => setJumlahStok(e.target.value)}></TextField>
                                {errorStok && (
                                    <Typography variant="caption" color="error">
                                        {errorStok}
                                    </Typography>
                                )}
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{mb: 3}}>
                        <Button variant='contained' onClick={handleClose} sx={{backgroundColor: '#c62828', '&:hover': {backgroundColor: '#e53935'}}}>Cancel</Button>
                        <Button variant='contained' onClick={handleSubmit} sx={{mr: 2, backgroundColor: '#2e7d32', '&:hover': {backgroundColor: '#43a047'}}}>Input Data</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            {/* menampilkan alert */}
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                <Alert onClose={handleCloseAlert} severity="error" sx={{ width: '100%' }}>
                    There is still empty data            
                </Alert>
            </Snackbar>
        </ThemeProvider>


        </>
    )
}

export default Catalogue;