/* eslint-disable no-nested-ternary */
import {useState, React} from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import Photo from './photo';



export default function Photos({ photos, userProfile, userLoginID }) {
  

  return (
    <div className="h-16 border-t border-gray-primary mt-12 pt-4">
      <div className="grid grid-cols-3 gap-8 mt-4 mb-12">
        {!photos
          ? new Array(12).fill(0).map((_, i) => <Skeleton key={i} width={320} height={400} />)
          : photos.length > 0
          ? photos.map((photo) => (
              <Photo photo = { photo } userProfile = {userProfile} userLoginID = {userLoginID} />
            ))
          : null}
      </div>      
      {!photos || (photos.length === 0 && <p className="text-center text-2xl">シェアした写真はプロフィールに表示されます。</p>)}
    </div>
  );
}

Photos.propTypes = {
  photos: PropTypes.array
};
