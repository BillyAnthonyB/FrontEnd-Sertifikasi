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
import Autocomplete from '@mui/material/Autocomplete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import "@fontsource/poppins";


//import dari dayjs untuk mengubah timezone ke indo
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc'

//import dayjs
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

//set data type untuk data katalog
interface katalogType {
    id: number;
    judul: string;
    pengarang: string;
    penerbit: string;
    tahunTerbit: number;
    stok: number;
}

//function alert
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

//Untuk ganti font
const theme = createTheme({
  typography: {
     fontFamily: 'Poppins',
  },
});

function Borrow() {

    //untuk mengubah timezone ke indo
    dayjs.extend(timezone);
    dayjs.extend(utc)

    //Define variable yang digunakan
    const [data, setData] = useState<any[]>([]);
    const [dataKatalog, setDataKatalog] = useState<katalogType[]>([])
    const [tanggalPinjam, setTanggalPinjam] = React.useState<Dayjs | null>(dayjs().utc().tz('Asia/Jakarta'));
    const [tanggalKembali, setTanggalKembali] = React.useState<Dayjs | null>(dayjs().utc().tz('Asia/Jakarta').add(7, 'day'))
    const [id, setId] = useState<number | string >('');
    const [namaPeminjam, setNamaPeminjam] = useState<string>('');
    const [namaBuku, setNamaBuku] = React.useState<katalogType | null>(null);
    const [status, setStatus] = useState<string>('loan')
    const [openDialog, setOpenDialog] = React.useState(false);
    const [existingIds, setExistingIds] = useState<number[]>([]);
    const [errorId, setErrorId] = useState<string | null>(null);
    const [openAlert, setOpenAlert] = React.useState(false);


    //get data peminjam + katalog(buat combobox saat add) -> pakai useEffect biar waktu page nya reload langsung get
    useEffect(() => {
        axios.get('http://localhost:8085/peminjam/list')
        .then(res => {
            const existingIds = res.data.map((book: any) => book.id);
            setExistingIds(existingIds);
            setData(res.data)
            
        })
        .catch(err => {
            console.log(err)
        })

        axios.get('http://localhost:8085/katalog/list')
        .then(res => {
            setDataKatalog(res.data.filter((book: any) => book.stok ===1))
            setNamaBuku(res.data[0])
        })
        .catch(err => {
            console.log(err)
        }) 
    }, [])

    //Function submit data / add data ke database
    const handleSubmit = async () => {

        //validasi
        //validasi field tidak boleh kosong
        if(id === '' || namaBuku === null || namaPeminjam === ''){
            setOpenAlert(true) // kalo kosong keluar alert
            return;
        }
        //validasi id tidak bisa sama
        const parsedId = Number(id);
        if (isNaN(parsedId) || existingIds.includes(parsedId)) {
          setErrorId('ID sudah ada di dalam database.');
          return;
        }

        //Add Data ke Database apabila lolos dari validasi
        if(namaBuku != null) {
            axios.post('http://localhost:8085/peminjam/add', {
                id: Number(id), 
                namaPeminjam: namaPeminjam,
                tanggalPinjam: JSON.stringify(tanggalPinjam).slice(1,11),
                tanggalKembali: JSON.stringify(tanggalKembali).slice(1,11),
                idBuku: Number(namaBuku.id),
                status: status,
            })
            .then(res => {
                console.log(res)

            })
            .catch(err => {
                console.log(err)
            })

            axios.put(`http://localhost:8085/katalog/update/${namaBuku.id}/0`)
            .then(res => {
                console.log(res)

            })
            .catch(err => {
                console.log(err)
            })
            window.location.reload();
        }
    }

    //delete data berdasarkan id
    const handleDelete = async (id: number) => {
        axios.delete(`http://localhost:8085/peminjam/delete/${id}`)
        .then(res => {
            console.log(res)
            window.location.reload();
        })
        .catch(err => {
            console.log(err)
        })
    };

    //update stok berdasarkan id buku / id katalog
    const handleUpdateStok =  (idBuku: Number) => {
        if(namaBuku !== null) {
            axios.put(`http://localhost:8085/katalog/update/${idBuku}/1`)
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.log(err)
            })
        }
    }

    //update status menjadi done apabila sudah dikembalikan
    const handleUpdateStatus = async (id: number) => {
        axios.put(`http://localhost:8085/peminjam/update/${id}/done`)
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


    return(
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
                    <Typography variant='h4' sx={{fontWeight: 600}}>Loan List</Typography>
                    <Button variant='contained' onClick={handleClickOpen} size='large' sx={{backgroundColor: '#263238', '&:hover': {backgroundColor: '#455a64'}}}>Borrow a book</Button>
                </Grid>
    
    
                {/* menampilkan table */}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                        <TableRow>
                            <TableCell align='left'>No</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Loan Date</TableCell>
                            <TableCell align="left">Return Date</TableCell>
                            <TableCell align="left">Status</TableCell>
                            <TableCell align="left">Return Status</TableCell>
                            <TableCell align="left">Delete</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {data.map((row, index) => (
                            <TableRow
                            key={index + 1}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                            <TableCell component="th" scope="row">
                                {index+1}
                            </TableCell>
                            <TableCell align="left">{row.namaPeminjam}</TableCell>
                            <TableCell align="left">{row.tanggalPinjam.slice(0,10)}</TableCell>
                            <TableCell align="left">{row.tanggalKembali.slice(0,10)}</TableCell>
                            <TableCell align="left">{row.status}</TableCell>
                            {row.status === 'loan' ? 
                            <>
                            <TableCell align="left">
                                <Button onClick={() => {handleUpdateStok(row.idBuku); handleUpdateStatus(row.id); }}>Done Loan</Button>
                            </TableCell>
                            <TableCell align="left">
                                <IconButton onClick={() => {handleUpdateStok(row.idBuku); handleDelete(row.id); }}>
                                    <DeleteIcon/>
                                </IconButton>
                            </TableCell>
                            </>                           

                            :    
                            <>
                            <TableCell align="left">
                                {''}
                            </TableCell>
                            <TableCell align="left">
                                {''}
                            </TableCell>
                            </>                        
                            }
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
                        <Stack direction='row' spacing={2} sx={{mt:2}}>
                            <Stack direction='column' spacing={1}>
                                <TextField size='small' type='number' label="Loan Id" value={id} onChange={(e) => setId(e.target.value)}></TextField>
                                {errorId && (
                                <Typography variant="caption" color="error">
                                    {errorId}
                                </Typography>
                                )}
                            </Stack>
                            <Autocomplete
                                onChange={(event: any, newValue: katalogType | null) => {
                                    setNamaBuku(newValue);
                                }}
                                options={dataKatalog}
                                sx={{ width: 300 }}
                                getOptionLabel={(option) => option.judul}
                                value={namaBuku}
                                size='small'
                                renderInput={(params) => <TextField  {...params} label="Nama Buku" />}
                            />
                            <TextField size='small' label="Nama Peminjam" value={namaPeminjam} onChange={(e) => setNamaPeminjam(e.target.value)}></TextField>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker slotProps={{ textField: { size: 'small' } }} format="YYYY-MM-DD" label="Tanggal Peminjaman" value={tanggalPinjam} 
                                    onChange={(newValue) => {
                                        setTanggalPinjam(newValue)     
                                        if(newValue != null) {
                                            setTanggalKembali(newValue.add(7, 'day'))
                                        }
                                    }}/>
                                    <DatePicker slotProps={{ textField: { size: 'small' } }} format="YYYY-MM-DD" label="Tanggal Pengembalian" value={tanggalKembali} onChange={(newValue) => setTanggalKembali(newValue)} />
                            </LocalizationProvider>
                            <TextField size='small'disabled label="status" value={status}></TextField>
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
export default Borrow;