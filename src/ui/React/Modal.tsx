import React from "react";
import { Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import createStyles from "@mui/styles/createStyles";
import M from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: "2px solid " + theme.palette.primary.main,
      boxShadow: theme.shadows[5],
      padding: 2,
      maxWidth: "80%",
      maxHeight: "80%",
      overflow: "auto",
      "&::-webkit-scrollbar": {
        // webkit
        display: "none",
      },
      scrollbarWidth: "none", // firefox
    },
  }),
);

interface IProps {
  open: boolean;
  onClose: () => void;
  children: JSX.Element[] | JSX.Element | React.ReactElement[] | React.ReactElement;
}

export const Modal = (props: IProps): React.ReactElement => {
  const classes = useStyles();
  return (
    <M
      open={props.open}
      onClose={props.onClose}
      closeAfterTransition
      className={classes.modal}
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 100,
      }}
    >
      <Fade in={props.open}>
        <div className={classes.paper}>{props.children}</div>
      </Fade>
    </M>
  );
};
