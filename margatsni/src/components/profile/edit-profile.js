import { useState, React, useContext } from 'react';
import FirebaseContext from '../../context/firebase';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {Fab, Grid } from '@material-ui/core';

  export default function EditProfile({user, handleClose}) {
    const [imgPost, setImgPost] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const { firebase } = useContext(FirebaseContext);

    // Update fullname
    const [fullName, setFullName] = useState('');
    const isInvalid = fullName === '' && imageSrc === '';

    // Update avatar
    const handleUpdateUserProfile = async (event) => {
      if (fullName !== ''){
        event.preventDefault();
        await firebase
        .firestore()
        .collection('users')
        .doc(user?.docId)
        .update({
          fullName: fullName
        });
      }
      if (imageSrc !== '')
      {
        event.preventDefault();
        await firebase
        .firestore()
        .collection('users')
        .doc(user?.docId)
        .update({
          avatarImageSrc: imageSrc
        });
      }
      window.location.reload();
    };

    const onImageChange = (event) => {
      
        if (event.target.files && event.target.files[0]) {
          let reader = new FileReader();
          reader.onload = (e) => {
            setImgPost({image: e.target.result});
          };
          reader.readAsDataURL(event.target.files[0]);
        }
        const file = event.target.files[0];
        const storageRef = firebase.storage().ref();
        let urlName = Date.now() + file.name;
        const fileRef = storageRef.child(`/avatars/${urlName}`);
        fileRef.put(file).then(() => {
            fileRef.getDownloadURL().then(function (url) {
                setImageSrc(url);
           });
        })
      }

    return (
        <>
          <div className="flex flex-col bg-white p-4 rounded width-post">
            <div className="p-4 py-5">
                <Grid container justify="center" alignItems="center">
                    <input
                        accept="image/*"
                        id="contained-button-file"
                        multiple
                        type="file"
                        onChange={onImageChange}
                        hidden={true}
                    />
                    <label htmlFor="contained-button-file">
                    <Fab component="span">
                        <PhotoCamera />
                    </Fab>
                    </label>
                </Grid>
                { imgPost && <img id="target" className="padding-login" src={imgPost.image}/> }
            </div>

            <input
              type="text"
              placeholder="フールネーム"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setFullName(target.value)}
            />

            <div>
                <button className={`bg-red-medium text-white w-45 rounded h-8 font-bold ${isInvalid && 'opacity-50'}`}   
                disabled={isInvalid}  
                onClick = {handleUpdateUserProfile}> 保存
                </button>
                <a className={`pt-1`}> </a>

                <button className={` bg-blue-medium text-white w-45 rounded h-8 font-bold `}     
                onClick={handleClose}
                > キャンセル
                </button>
            </div>  
        </div>
    </>
    );
  }
