import { useState, useContext, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import FirebaseContext from '../context/firebase';
import * as ROUTES from '../constants/routes';
import { doesUsernameExist } from '../services/firebase';

export default function SignUp() {
  const history = useHistory();
  const { firebase } = useContext(FirebaseContext);

  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const isInvalid = password === '' || emailAddress === '';

  const handleSignUp = async (event) => {
    event.preventDefault();

    const usernameExists = await doesUsernameExist(username);
    if (!usernameExists) {
      try {
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(emailAddress, password);

        await createdUserResult.user.updateProfile({
          displayName: username
        });

        await firebase
          .firestore()
          .collection('users')
          .add({
            userId: createdUserResult.user.uid,
            username: username.toLowerCase(),
            following: ['0'],
            followers: [],
            avatarImageSrc: 'https://firebasestorage.googleapis.com/v0/b/margatsni-itss.appspot.com/o/default%2Favatar-magatsni.png?alt=media&token=5882edfa-edab-4105-a5e9-4cb3bb3e0648',
            fullName,
            emailAddress: emailAddress.toLowerCase(),
            dateCreated: Date.now()
          });

        history.push(ROUTES.DASHBOARD);
      } catch (error) {
        setFullName('');
        setEmailAddress('');
        setPassword('');
        setError(error.message);
      }
    } else {
      setUsername('');
      setError('そのユーザー名はすでに使用されています。別のユーザー名をお試しください。');
    }
  };

  useEffect(() => {
    document.title = 'サインアップ';
  }, []);

  return (
    <div className="mx-auto max-w-screen-md">
     
      <div className="mx-auto w-3/5">

      <div>
        <img src="/images/login-back.png"　alt=""/>
      </div>
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">


          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

          <form onSubmit={handleSignUp} method="POST">
            <input
              type="text"
              placeholder="ユーザーネーム"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <input
              type="text"
              placeholder="フールネーム"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setFullName(target.value)}
              value={fullName}
            />
            <input
              type="text"
              placeholder="Eメール"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmailAddress(target.value)}
              value={emailAddress}
            />
            <input
              type="password"
              placeholder="パスワード"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-red-medium text-white w-full rounded h-8 font-bold
            ${isInvalid && 'opacity-50'}`}
            >
              サインアップ
            </button>
          </form>

          <div className="padding-login">
          <p className="text-sm">
            {` `}
            <Link to={ROUTES.LOGIN} className="font-bold text-red-primary">
            　　アカウントを持ってる？
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
