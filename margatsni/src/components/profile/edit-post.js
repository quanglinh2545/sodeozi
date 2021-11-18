import {Button , Grid, Typography} from '@material-ui/core';
import { useState, React } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Image from '../post/image';
import { updatePost, deletePost } from '../../services/firebase';
import Alert from '@material-ui/lab/Alert';


export default function EditPost({photo, handleClose}) {

    const [newCaption, setNewCaption] = useState('');
    const isInvalid = newCaption === '';

    const handleUpdatePhoto = async () =>{
        updatePost(photo.docId, newCaption);
    }
    const handleDeletePhoto = async () =>{
        deletePost(photo.docId);
    }

    return (
        <>
        <div className="flex flex-col bg-white p-4 rounded width-post">
           
           <Image src={photo.imageSrc} caption={photo.caption} />
            <input
              type="text"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 rounded-no border border-gray-primary  mb-2"
              onChange={({ target }) => setNewCaption(target.value)}
              defaultValue={photo.caption}
            />

            <div>
                <button className={`bg-red-medium text-white w-32 rounded h-8 font-bold ${isInvalid && 'opacity-50'}`}  
                onClick={handleUpdatePhoto}  
                disabled={isInvalid}  
                > 保存
                </button>

                <a className={`pt-1`}> </a>

                <button className={`bg-green-medium text-white w-32 rounded h-8 font-bold `}
                onClick={handleDeletePhoto}
                > 
                削除
                </button>

                <a className={`pt-1`}> </a>

                <button className={` bg-blue-medium text-white w-32 rounded h-8 font-bold`}     
                onClick={handleClose}
                > キャンセル
                </button>

            </div>   

        </div>
        </>
    );
}
