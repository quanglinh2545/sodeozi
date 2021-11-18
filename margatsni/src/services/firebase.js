import { firebase, FieldValue, storage } from '../lib/firebase';

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.length > 0;
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', username)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));
}

// export async function getUserAvatarByUserId(userId) {
//   const result = await firebase
//     .firestore()
//     .collection('users')
//     .where('userId', '==', userId)
//     .get();

//   const photos = result.docs.map((photo) => ({
//     ...photo.data(),
//     docId: photo.id
//   }));
//   return photos;
// }


export async function getUserByUserId(userId) {
  const result = await firebase.firestore().collection('users').where('userId', '==', userId).get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return user;
}

export async function getPhotoByPhotoId(photoId) {
  const result = await firebase.firestore().collection('photos').where('photoId', '==', photoId).get();
  const photo = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return photo;
}


export async function getSuggestedProfiles(userId, following) {
  let query = firebase.firestore().collection('users');

  if (following.length > 0) {
    query = query.where('userId', 'not-in', [...following, userId]);
  } else {
    query = query.where('userId', '!=', userId);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id
  }));

  return profiles;
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId, 
  profileId, 
  isFollowingProfile 
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId)
    });
}

export async function updateFollowedUserFollowers(
  profileDocId, 
  loggedInUserDocId, 
  isFollowingProfile 
) {
  return firebase
    .firestore()
    .collection('users')
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId)
    });
}

export async function getPhotos(userId, following) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username, avatarImageSrc } = user[0];
      // alert(avatarImageSrc);
      return { username, avatarImageSrc, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getPhotosUpdate(userId, following) {
  following.push(userId);
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', 'in', following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username, avatarImageSrc } = user[0];
      // alert(avatarImageSrc);
      return { username, avatarImageSrc, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function getUserPhotosByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection('photos')
    .where('userId', '==', userId)
    .get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id
  }));
  return photos;
}

export async function isUserFollowingProfile(loggedInUserUsername, profileUserId) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('username', '==', loggedInUserUsername) 
    .where('following', 'array-contains', profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id
  }));

  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  await updateLoggedInUserFollowing(activeUserDocId, profileUserId, isFollowingProfile);
  await updateFollowedUserFollowers(profileDocId, followingUserId, isFollowingProfile);
}


// export async function updateUserProfile(
//   docId,
//   newUsername,
//   newFullName
//   ){
//     firebase
//     .firestore()
//     .collection('users')
//     .doc(docId)
//     .update({
//       username: newUsername,
//       fullName: newFullName
//     })
//     .then(function(){
//       console.log('User update with ID', docId);
//     })
//     .catch(function(error){
//       console.error("Error updating user", error);
//     });

// }
export async function updateUserProfile(
  docId,
  newFullName
  ){
    firebase
    .firestore()
    .collection('users')
    .doc(docId)
    .update({
      fullName: newFullName
    })
    .then(function(){
      window.location.reload();
      console.log('User update with ID', docId);
    })
    .catch(function(error){
      console.error("Error updating user", error);
    });

}
export async function updatePost(
  docId,
  newCaption
  ){
    firebase
    .firestore()
    .collection('photos')
    .doc(docId)
    .update({
      caption: newCaption
    })
    .then(function(){
      window.location.reload();
      console.log('Photo update with ID', docId);
    })
    .catch(function(error){
      console.error("Error updating photo", error);
    });

}

export async function deletePost(
  docId
  ){
    firebase
    .firestore()
    .collection('photos')
    .doc(docId)
    .delete()
    .then(function(){
      window.location.reload();
      console.log('Photo delete with ID', docId);
    })
    .catch(function(error){
      console.error("Error deleting photo", error);
    });

}

export async function updateAvatar(
  avatar, docId
  ){
    console.log('avatar func', avatar);
    // let urlName = Date.now() + avatar?.name;
    // let newUrlAvatar = '';

      const uploadTask = storage
      .ref(`/avatars/${avatar?.name}`).put(avatar);
      
      uploadTask.on(
        "state_changed",
        snapShot => {},
        error =>{
          console.error("Error updating user", error);
      },
      () =>{
        storage
    .ref()
        .child(`/avatars/${avatar?.name}`)
        .getDownloadURL()
        .then(url =>{
          console.log('url', url);
          // newUrlAvatar = url;
          // console.log('newUrlAvatar', newUrlAvatar);

          firebase
          .firestore()
          .collection('users')
          .doc(docId)
          .update({
            avatarImageSrc: url
          })
          .then(function(){
            //window.location.reload()
            console.log('User update avatar with ID', docId);
          })
          .catch(function(error){
            console.error("Error updating user", error);
          });

        });
      }
      );
//return newUrlAvatar;
    

};
