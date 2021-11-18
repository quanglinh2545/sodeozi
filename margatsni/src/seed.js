export function seedDatabase(firebase) {
    const users = [
      {
        userId: '0',
        username: 'margatsni',
        fullName: 'Margatsni',
        emailAddress: 'admin@gmail.com',
        avatarImageSrc: '',
        following: [],
        followers: [],
        dateCreated: Date.now()
      }
    ];
  
    for (let k = 0; k < users.length; k++) {
      firebase.firestore().collection('users').add(users[k]);
    }
  
    firebase
        .firestore()
        .collection('photos')
        .add({
          photoId: 0,
          userId: '0',
          imageSrc: '',
          caption: 'Welcome to Margatsni !',
          likes: [],
          comments: [],
          userLatitude: '40.7128°',
          userLongitude: '74.0060°',
          dateCreated: Date.now()
    });
  }
  