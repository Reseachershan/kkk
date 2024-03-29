import auth from '@react-native-firebase/auth';
import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import moment from 'moment';
import {getCollection, getDocument} from './firestore';

const colectionRef = getCollection('users');
export const getUser = async (userId: string) => {
  return await colectionRef.doc(userId).get();
};

export const logOut = async () => {
  try {
    const user = auth().currentUser;
    if (user) {
      await auth().signOut();
    }
  } catch (error) {
    console.log('Error on logout', error);
  }
};

export const obServeUser = (
  userId: string,
  callback: (arg0: {
    user: FirebaseFirestoreTypes.DocumentData | null;
    uid: string;
  }) => void,
) => {
  return colectionRef.doc(userId).onSnapshot(user => {
    callback({
      user: user.data() || null,
      uid: user.id,
    });
  });
};

export const createUser = async (email: string, password: string) => {
  try {
    const user = await auth().createUserWithEmailAndPassword(email, password);
    const token = await user.user.getIdToken();
    return {error: false, user: user.user, token};
  } catch (error: any) {
    console.log(error);
    return {error: error.message, user: null, token: null};
  }
};

export const loginService = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      return {
        error: 'Please Enter a Valid Password!',
        user: null,
        uid: '',
        token: null,
      };
    }
    const user = await auth().signInWithEmailAndPassword(email, password);
    const token = await user.user.getIdToken();
    return {error: false, user: user.user, uid: user.user.uid, token};
  } catch (error: any) {
    console.log(error);
    return {error: error.message, user: null, uid: '', token: null};
  }
};
export const uploadImage = async (
  uri: string,
  userId?: string,
  uploadPath?: string,
) => {
  if (!userId || !uri || !uploadPath) {
    return;
  }
  let reference = storage().ref(uploadPath);

  await reference.putFile(uri);
  const url = await storage().ref(uploadPath).getDownloadURL();
  return url;
};
export const uploadProfileImage = async (uri: string, userId?: string) => {
  if (!userId || !uri) {
    return;
  }
  try {
    const time = moment().format('DD-MM-YYYY ss');
    const url = await uploadImage(
      uri,
      userId,
      `userProfile/${userId}/${time}.jpg`,
    );
    await getDocument(`users/${userId}`).update({
      profileImage: url,
      profileImage_125x125: '',
      profileImage_250x250: '',
      profileImage_500x500: '',
    });
    return url;
  } catch (err) {
    console.log(err);
  }
};

export const updatePassword = async (
  oldPassword: string,
  email?: string,
  password?: string,
) => {
  if (!email || !password) {
    return {error: 'Please Enter all fields!'};
  }
  try {
    const user = await auth().signInWithEmailAndPassword(email, oldPassword);
    return await user.user.updatePassword(password);
  } catch (error: any) {
    return {error: error.message};
  }
};

export const updateEmail = async (
  oldEmail: string,
  email: string,
  password: string,
) => {
  try {
    const user = await auth().signInWithEmailAndPassword(oldEmail, password);
    return await user.user.updateEmail(email);
  } catch (error: any) {
    return {error: error.message};
  }
};
