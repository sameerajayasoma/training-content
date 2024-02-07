import React, { useContext, useState } from "react";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { useReserveRoom } from "../../hooks/reservations";
import { useLocation, useNavigate } from "react-router-dom";
import { Room } from "../../types/generated";
import { Location } from "history";
import { UserContext } from "../../contexts/user";
import {toast} from "react-toastify";

interface RoomState {
  room: Room;
}

const ReservationForm = () => {
  const { reservation, loading, error, reserveRoom } = useReserveRoom();

  const user = useContext(UserContext);

  const {
    state: { room },
  } = useLocation() as Location<RoomState>;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    emailAddress: "",
    checkinDate: "",
    checkoutDate: "",
  });

  const handleTextChange = (name: string) => (e: any) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (name: string) => (e: any) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: new Date(value).toISOString(),
    }));
  };

  const handleReserve = async () => {
    const {
      firstName,
      lastName,
      mobileNumber,
      emailAddress,
      checkinDate,
      checkoutDate,
    } = formData;
    console.log("formData", formData);

    await reserveRoom({
      checkinDate,
      checkoutDate,
      rate: 100,
      roomType: room.type.name,
      user: {
        email: emailAddress,
        id: user.id,
        mobileNumber,
        name: `${firstName} ${lastName}`,
      },
    });

    if (error) {
      return;
    }
    toast.success("Reservation placed!");
    navigate("/reservations", { state: { reservation } });
  };

  return (
    <Box
      style={{ background: "white" }}
      display="flex"
      flexDirection="column"
      py={4}
      px={8}
    >
      <Typography variant="h4" gutterBottom>
        Reserve a room
      </Typography>
      <Typography variant="body1" gutterBottom>
        Enter your details and click "Reserve". You can pay at the check-in.
      </Typography>
      <Box
        mt={3}
        mb={2}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box width="48%">
          <TextField
            onChange={handleTextChange("firstName")}
            fullWidth
            label="First Name"
            variant="outlined"
          />
        </Box>
        <Box width="48%">
          <TextField
            onChange={handleTextChange("lastName")}
            fullWidth
            label="Last Name"
            variant="outlined"
          />
        </Box>
      </Box>
      <Box mb={2}>
        <TextField
          onChange={handleTextChange("mobileNumber")}
          fullWidth
          label="Mobile Number"
          variant="outlined"
        />
      </Box>
      <Box mb={2}>
        <TextField
          onChange={handleTextChange("emailAddress")}
          fullWidth
          label="Email Address"
          variant="outlined"
        />
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box width="48%">
          <TextField
            onChange={handleDateChange("checkinDate")}
            fullWidth
            label="Check In Date"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
        <Box width="48%">
          <TextField
            onChange={handleDateChange("checkoutDate")}
            fullWidth
            label="Check Out Date"
            variant="outlined"
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </Box>

      {/* Action buttons */}
      <Box display="flex" justifyContent="flex-end">
        <Button
          style={{ textTransform: "none" }}
          onClick={() => navigate("/rooms")}
          color="secondary"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "8px", textTransform: "none" }}
          onClick={handleReserve}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="primary" /> : "Reserve"}
        </Button>
      </Box>
    </Box>
  );
};

export default ReservationForm;
