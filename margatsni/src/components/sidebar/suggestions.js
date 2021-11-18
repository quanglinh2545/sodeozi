/* eslint-disable no-nested-ternary */
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Skeleton from 'react-loading-skeleton';
import { getSuggestedProfiles } from '../../services/firebase';
import SuggestedProfile from './suggested-profile';
import { Link } from 'react-router-dom';

export default function Suggestions({ userId, following, loggedInUserDocId }) {
  const [profiles, setProfiles] = useState(null);

  const [searchUserName, setsearchUserName] = useState('');


  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(userId, following);
      setProfiles(response);
    }

    if (userId) {
      suggestedProfiles();
    }
  }, [userId]);
  
  

  return !profiles ? (
    <Skeleton count={1} height={150} className="mt-5" />
  ) : profiles.length >= 0 ? (
    <div className="rounded flex flex-col">
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-bold text-gray-base">ユーザー検査</p>
      </div>
      
      <div className="">

      <input
              aria-label="ユーザー検査"
              type="text"
              placeholder="ニックネームを入力"
              className="text-sm text-gray-base w-70 mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setsearchUserName(target.value)}
              value={searchUserName}
          />
      
      <Link to={`/p/${searchUserName}`}>
      <button className={`bg-blue-medium text-white w-25 rounded h-8 font-bold`}>
        検査
      </button>
        </Link>
      

      </div>

      

      <div className="mt-4 grid gap-5">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            profileDocId={profile.docId}
            username={profile.username}
            profileId={profile.userId}
            userId={userId}
            loggedInUserDocId={loggedInUserDocId}
            avatarImageSrc={profile.avatarImageSrc}
          />
        ))}
      </div>

    </div>
  ) : null;
}

Suggestions.propTypes = {
  userId: PropTypes.string,
  following: PropTypes.array,
  loggedInUserDocId: PropTypes.string
};
