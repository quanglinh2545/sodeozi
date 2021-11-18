import { useState, React, useContext } from 'react';
import FirebaseContext from '../../context/firebase';
import {Fab, Grid} from '@material-ui/core';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

export default function NewPost({userId, handleClose}) {
    const [content, setContent] = useState('');
    const [imgPost, setImgPost] = useState('');
    const [imageSrc, setImageSrc] = useState('');
    const { firebase } = useContext(FirebaseContext);

    const isInvalid = content === '' || imageSrc === '';

    const handlePostImage = async (event) => {
        event.preventDefault();
        await firebase
        .firestore()
        .collection('photos')
        .add({
          userId: userId,
          imageSrc: imageSrc,
          caption: content,
          likes: [],
          comments: [],
          userLatitude: '40.7128°',
          userLongitude: '74.0060°',
          dateCreated: Date.now()

    });
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
        const fileRef = storageRef.child(`/posts/${file.name}`);
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
                placeholder="コンテンツ"
                className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
                onChange={({ target }) => setContent(target.value)}
                />

            <div>
                <button className={`bg-red-medium text-white w-45 rounded h-8 font-bold ${isInvalid && 'opacity-50'}`}    
                disabled={isInvalid} 
                onClick = {handlePostImage}> 保存
                </button>
                <a className={`pt-1`}> </a>

                <button className={` bg-blue-medium text-white w-45 rounded h-8 font-bold`}     
                onClick={handleClose}
                > キャンセル
                </button>
            </div>   
        </div>
    </>
    );
  }
