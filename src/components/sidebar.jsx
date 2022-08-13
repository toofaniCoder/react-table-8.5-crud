import { Box, Button, Grid, InputBase, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddCircleTwoToneIcon from '@mui/icons-material/AddCircleTwoTone';
import { useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import DoneTwoToneIcon from '@mui/icons-material/DoneTwoTone';
const CustomInput = styled(InputBase)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.dark,
  fontWeight: 600,
  textAlign: 'center',
  padding: theme.spacing(1.5, 4),
  borderRadius: 5,
  display: 'block',
  '&:focus': {
    display: 'none',
  },
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2),
  },
}));

const PrimaryButton = styled(Button)(({ theme }) => ({
  background: theme.palette.primary.dark,
  padding: theme.spacing(2, 4),
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.dark,
  },
}));

const Sidebar = ({ table }) => {
  const { control, handleSubmit, reset, getValues } = useFormContext({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      pincode: '',
      standard: '',
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const id = getValues('id');

  useEffect(() => {
    if (id) setIsEditing(true);
    else setIsEditing(false);
  }, [id]);
  const onSubmit = (data) => {
    if (isEditing) {
      table.options.meta.updateStudent({ id, data });
    } else {
      table.options.meta.addStudent({ data });
    }
    reset({
      fullName: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      pincode: '',
      standard: '',
    });
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        background: '#F6BD60',
        p: 4,
        borderRadius: 5,
      }}
    >
      <Stack spacing={4}>
        <Typography variant="h4" align="center" color="primary.dark">
          स्टुडेंट{' '}
          <Typography variant="inherit" fontWeight="700" display="inline">
            CRUD
          </Typography>
        </Typography>
        <Box>
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} placeholder="enter your fullname" />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} placeholder="enter your e-mail address" />
            )}
          />
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} placeholder="enter your phone number" />
            )}
          />
          <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} placeholder="enter your state" />
            )}
          />
          <Controller
            name="city"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} placeholder="enter your city" />
            )}
          />
          <Controller
            name="pincode"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} placeholder="enter your pincode" />
            )}
          />
          <Controller
            name="standard"
            control={control}
            render={({ field }) => (
              <CustomInput {...field} placeholder="enter your class" />
            )}
          />
        </Box>
        <PrimaryButton
          type="submit"
          startIcon={isEditing ? <DoneTwoToneIcon /> : <AddCircleTwoToneIcon />}
        >
          {isEditing ? 'update student' : 'create new student'}
        </PrimaryButton>
      </Stack>
    </Box>
  );
};

export default Sidebar;
