import { useContext, useState } from 'react';
import User from './user';
import Suggestions from './suggestions';
import LoggedInUserContext from '../../context/logged-in-user';


import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import { withStyles } from '@material-ui/core/styles';
import useUser from '../../hooks/use-user';
import NewPost from './new-post';


const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

export default function Sidebar() {
  const { user: { docId = '', fullName, username, userId, following, avatarImageSrc, loggedInUser } = {} } = useContext(
    LoggedInUserContext
  );
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="p-4">
      <User username={username} fullName={fullName} avatarImageSrc={avatarImageSrc}/>

      <div className="padding-toukou">
      <button className={`bg-red-medium text-white w-full rounded h-8 font-bold`} onClick={handleClickOpen}>
        投稿
      </button>

      <Dialog open={open}>
             <DialogActions>
             <NewPost userId={userId} handleClose={handleClose}/>
            </DialogActions>
           </Dialog>
      </div>

      <Suggestions userId={userId} following={following} loggedInUserDocId={docId}  />
    </div>
  );
}
