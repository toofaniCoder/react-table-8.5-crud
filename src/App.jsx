import './App.css';
import { useState, useEffect, useMemo, useCallback } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { Box, Grid, IconButton, TextField } from '@mui/material';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { Container } from '@mui/system';
import axios from 'axios';
import Home from './components/home';
import Sidebar from './components/sidebar';
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useForm, FormProvider, Controller } from 'react-hook-form';

axios.defaults.baseURL = 'http://localhost:1337/api';

const boxStyle = {
  height: '100vh',
  width: '100vw',
  bgcolor: 'primary.extraLight',
};

const columnHelper = createColumnHelper();

// const columns =

function App() {
  const [data, setData] = useState([]);
  const defaultData = useMemo(() => [], []);
  const [editSelectedIndex, setEditSelectedIndex] = useState(null);
  const methods = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      pincode: '',
      standard: '',
      currentStudent: {
        fullName: 'aaa',
        email: 'ss',
        phone: 'ssa',
        state: 'a',
        city: 'z',
        pincode: 'dd',
        standard: 'w',
      },
    },
  });
  const EditableCell = useMemo(
    () =>
      ({ getValue, row: { index }, column: { id } }) => {
        const initialValue = getValue();
        // We need to keep and update the state of the cell normally
        const [value, setValue] = useState(initialValue);
        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
          // table.options.meta?.updateData(index, id, value);
        };

        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);

        if (index == editSelectedIndex) {
          return (
            <Controller
              name={`currentStudent.${id}`}
              control={methods.control}
              render={({ field }) => (
                <TextField {...field} placeholder={`Enter Your ${id}`} />
              )}
            />
          );
        } else {
          return initialValue;
        }
      },
    [editSelectedIndex]
  );

  const defaultColumn = {
    cell: (props) => {
      return <EditableCell {...props} />;
    },
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor(({ attributes }) => attributes.fullName, {
        id: 'fullName',
        header: 'Full Name',
      }),
      columnHelper.accessor(({ attributes }) => attributes.email, {
        id: 'email',
        header: 'E-mail Address',
      }),
      columnHelper.accessor(({ attributes }) => attributes.phone, {
        id: 'phone',
        header: 'Phone Number',
      }),
      columnHelper.accessor(({ attributes }) => attributes.standard, {
        id: 'standard',
        header: 'Class',
      }),
      columnHelper.group({
        header: 'Full Address',
        columns: [
          columnHelper.accessor(({ attributes }) => attributes.state, {
            id: 'state',
            header: 'State',
          }),
          columnHelper.accessor(({ attributes }) => attributes.city, {
            id: 'city',
            header: 'City',
          }),
          columnHelper.accessor(({ attributes }) => attributes.pincode, {
            id: 'pincode',
            header: 'Pincode',
          }),
        ],
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row, table }) => {
          return (
            <>
              {editSelectedIndex == row.index ? (
                <>
                  <IconButton
                    onClick={methods.handleSubmit((data) => {
                      onSubmit({ id: row.original.id, ...data.currentStudent });
                      setEditSelectedIndex(null);
                    })}
                  >
                    <CheckIcon color="success" />
                  </IconButton>
                  <IconButton onClick={() => setEditSelectedIndex(null)}>
                    <ClearIcon color="error" />
                  </IconButton>
                </>
              ) : (
                <>
                  <IconButton
                    onClick={() => {
                      methods.reset({
                        currentStudent: row.original.attributes,
                      });
                      setEditSelectedIndex(row.index);
                    }}
                  >
                    <EditTwoToneIcon color="primary" />
                  </IconButton>
                  <IconButton
                    onClick={() =>
                      table.options.meta.deleteStudent(row.original.id)
                    }
                  >
                    <DeleteTwoToneIcon color="error" />
                  </IconButton>
                </>
              )}
            </>
          );
        },
      }),
    ],
    [editSelectedIndex]
  );

  useEffect(() => {
    const loadData = async () => {
      const { data } = await axios.get('/students');
      setData(data.data);
    };
    loadData();
  }, []);

  const table = useReactTable({
    data: data ?? defaultData,
    defaultColumn,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: {
      addStudent: async (student) => {
        const { data } = await axios.post('/students', student);
        setData((prevState) => [data.data, ...prevState]);
      },
      updateStudent: async ({ id, ...student }) => {
        const { data } = await axios.put(`/students/${id}`, student);
        setData((prevState) =>
          prevState.map((item) => (item.id == id ? data.data : item))
        );
      },
      deleteStudent: async (studentId) => {
        await axios.delete(`/students/${studentId}`);
        setData((prevState) =>
          prevState.filter((item) => item.id != studentId)
        );
      },
    },
  });

  const onSubmit = ({ id, ...data }) =>
    table.options.meta.updateStudent({ id, data });
  return (
    <>
      <ThemeProvider theme={theme}>
        <FormProvider {...methods}>
          <CssBaseline />
          <Box sx={boxStyle}>
            <Container maxWidth="xl" sx={{ py: 2 }}>
              <Grid columnSpacing={4} container>
                <Grid item md={12}>
                  <Sidebar table={table} />
                </Grid>
                <Grid item md={12}>
                  <Home table={table} />
                </Grid>
              </Grid>
            </Container>
          </Box>
        </FormProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
