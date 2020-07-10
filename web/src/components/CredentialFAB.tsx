import React from "react";
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import CredentialDialog from './PostDialog'
import { useMediaQuery } from '@material-ui/core';
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({

    fab: {
      position: 'fixed',
      bottom: theme.spacing(3),
      right: theme.spacing(2),
    },
  }),
);

interface Props {
  subject?: string
}

function CredentialFAB(props: Props) {
  const classes = useStyles();
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  

  return (
    <div>
      <Fab color="primary" aria-label="New" className={classes.fab} onClick={handleOpenModal}>
        <AddIcon />
      </Fab>
      <CredentialDialog
        fullScreen={fullScreen}
        open={openModal}
        onClose={handleCloseModal}
        subject={props.subject}
      />
    </div>
  );

}

export default CredentialFAB;