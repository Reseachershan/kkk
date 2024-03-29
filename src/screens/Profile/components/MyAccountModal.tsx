import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import auth from '@react-native-firebase/auth';

import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';

import Modal from 'react-native-modal';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { HelperText } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import PhotoModal from '../../KlimbFinished/components/PhotoModal';
import ProfileIcon from '../../../components/aplicationIcons/ProfileIcon';
import useUser from '../../../hooks/useUser';
import { getDocument, runTransaction } from '../../../services/firestore';
import ScreenLoader from '../../../components/Loaders/ScreenLoader';
import { updateEmail, uploadProfileImage } from '../../../services/auth';
import FastImage from 'react-native-fast-image';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
const ProfileIconLogo = require('../../../assets/profile/myAccount-icon.png');

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  infoText: {
    paddingHorizontal: 10,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    lineHeight: 14,
    fontSize: 10,
    color: '#000000',
    opacity: 0.6,
    top: -14,
  },
  formInput: {
    height: 40,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    color: '#8391A1',
  },
  formDatePicker: {
    justifyContent: 'center',
    // marginBottom: 22,
    // paddingHorizontal: 17,
    height: 40,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: '#E8ECF4',
    backgroundColor: '#F7F8F9',
  },
  formattedBirthDate: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    color: '#8391A1',
  },
  formDropdown: {
    justifyContent: 'center',
    // marginBottom: 22,
    height: 40,
    // borderWidth: 1,
    // borderRadius: 8,
    // borderColor: '#E8ECF4',
    marginHorizontal: -15,
    backgroundColor: '#F7F8F9',
    width: '100%',
  },
  formDropdownText: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    color: '#8391A1',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 8,
    backgroundColor: '#056135',
  },
  buttonLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18.29,
    color: '#FFFFFF',
  },
  editLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18.29,
    color: '#056135',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    height: 90,
    width: '100%',
    borderColor: '#808080',
    // borderRadius: 70,
    overflow: 'hidden',
  },
  selectPhotoText: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 23,
    lineHeight: 28,
    color: '#000000',
    opacity: 0.7,
  },
  inputView: {
    borderWidth: 1,
    borderColor: '#E8ECF4',
    backgroundColor: '#F7F8F9',
    borderRadius: 8,
    paddingHorizontal: 18,
  }
});

const sexOptionsArray = ['Male', 'Female'];

const MyAccountModal: FC<Props> = ({ isOpen = false, onClose }) => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [gender, setGender] = useState('');
  const [newUserName, setUserName] = useState('');
  const [userNameError, setUserNameError] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [openBirthDateModal, setOpenBirthDateModal] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalEmail, setOriginalEmail] = useState('');
  const [originalUserName, setOriginalUserName] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [generalError, setGeneralError] = useState('');
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<any>({});
  useEffect(() => {
    setOriginalEmail(auth().currentUser?.email || '');
    if (!isOpen) {
      setIsLoading(false);
      return;
    }
    setOldPassword('');
    setEmail(auth().currentUser?.email || '');
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setBirthDate(user?.birthDate ? new Date(user?.birthDate) : new Date());
    setFormattedDate(moment(user?.birthDate).format('MM-DD-YYYY') || '');
    setUserName(user?.userName || '');
    setOriginalUserName(user?.userName || '');
    setGender(user?.gender || '');
    setOriginalImage(user?.profileImage || null);

    const off = setTimeout(() => {
      inputs.current?.password?.focus();
    }, 500);
    return () => {
      clearTimeout(off);
    };
  }, [
    isOpen,
    user?.birthDate,
    user?.firstName,
    user?.gender,
    user?.profileImage,
    user?.lastName,
    user?.userName,
  ]);

  const validateEmail = (value: string) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

  const handleChangeUserName = (value: string) => {
    setUserName(value);
    setUserNameError(value.length < 3 ? 'This is not a valid username!' : '');
  };
  const handleChangeEmail = (value: string) => {
    setEmail(value);

    const hasEmailError = !validateEmail(email) ? true : false;
    setEmailError(hasEmailError);
  };

  const handleSaveChanges = async () => {
    if (userNameError || emailError) {
      return;
    }
    if (newUserName?.length < 3) {
      setUserNameError('This is not a valid username!');
      return;
    }
    let createNewUser = false;
    setIsLoading(true);
    const userNameRef = getDocument(`singleUsersInfo/${newUserName}`);

    try {
      if (originalUserName !== newUserName) {
        const userNameRef = getDocument(`singleUsersInfo/${newUserName}`);

        try {
          await runTransaction(async transaction => {
            console.log(newUserName);
            const existSanp = await transaction.get(userNameRef);
            if (existSanp.exists) {
              setIsLoading(false);
              throw new Error('UserName already exists.');
            }
            await transaction.set(userNameRef, {
              userName: newUserName,
              lastUpdate: Date.now(),
              userId: auth().currentUser?.uid,
            });
            createNewUser = true;
          });
        } catch (error) {
          console.log(error);
          setIsLoading(false);
          if (createNewUser) {
            userNameRef.delete();
          }
          return setUserNameError('UserName already exists.');
        }
      }
      if (originalEmail !== email) {
        try {
          const originalEmail = auth().currentUser?.email;
          if (!oldPassword) {
            throw new Error('Old password is required');
          }
          if (!originalEmail || !email) {
            throw new Error('User email is required');
          }
          const result = await updateEmail(originalEmail, email, oldPassword);
          if (result?.error) {
            throw new Error(result.error);
          }
        } catch (error: any) {
          setGeneralError(error.message);
          console.log('error', error.message);
          throw new Error(error.message || 'Something went wrong');
        }
      }
      await getDocument(`users/${user?.uid}`).update({
        firstName: firstName || '',
        lastName: lastName || '',
        userName: newUserName,
        gender: gender || 'Male',
      });
      if (image) {
        await uploadProfileImage(image, auth().currentUser?.uid);
      }
      if (createNewUser) {
        try {
          await getDocument(`singleUsersInfo/${originalUserName}`).delete();
        } catch (error) { }
      }
      onClose();
    } catch (error) {
      setIsLoading(false);
      if (createNewUser) {
        userNameRef.delete();
      }
    }
    setIsLoading(false);
  };

  const handleSelection = useCallback((data: any) => {
    if (data?.assets) {
      setIsPhotoModalVisible(false);
      setImage(data.assets[0].uri);
    }
  }, []);
  const hasEmailChanges = originalEmail !== email;
  useEffect(() => {
    if (!hasEmailChanges) {
      return;
    }
    setOldPassword('');
  }, [hasEmailChanges]);

  return (
    <Modal
      isVisible={isOpen}
      animationIn="fadeIn"
      backdropOpacity={1}
      backdropColor='white'
      style={{ justifyContent: 'flex-end', marginTop: 40, margin: 0, }}>
      <KeyboardAwareScrollView >
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => setIsPhotoModalVisible(true)}
            style={{
              ...styles.imageContainer,
              marginBottom: 20,
            }}
            activeOpacity={1}>
            {originalImage || image ? (
              <FastImage
                resizeMode={FastImage.resizeMode.cover}
                source={{ uri: (originalImage || image) as string }}
                style={{ width: 65, height: 65, borderRadius: 65 }}
              />
            ) : (
              <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: 80, width: '100%' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 16, height: 50, width: 50 }}>
                  <Image source={require('../../../assets/profile/placeholder.png')} style={{ width: '100%', height: '100%' }} />
                </View>
                <Text allowFontScaling={false} style={styles.editLabel}>Edit profile picture</Text>
              </View>
            )}
          </TouchableOpacity>

          <View>
            <View style={[styles.inputView, {
              marginBottom: 22,
            }]}>
              <Text allowFontScaling={false} style={{ marginTop: 10, fontSize: 12 }}>Username</Text>
              <TextInput
                style={styles.formInput}
                value={newUserName}
                placeholder="Username"
                returnKeyType='done'
                placeholderTextColor="#00000060"
                onChangeText={text => handleChangeUserName(text)}
                ref={input => {
                  inputs.current.userName = input;
                }}
              />
              {userNameError ? (
                <HelperText type="error" visible={true} style={{ top: 2 }}>
                  {userNameError}
                </HelperText>
              ) : null}
            </View>
            {Boolean(originalEmail) && (
              <View style={[styles.inputView, {
                marginBottom: 22,
              }]}>
                <Text allowFontScaling={false} style={{ marginTop: 10, fontSize: 12 }}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={email}
                  placeholder="Email"
                  returnKeyType='done'
                  placeholderTextColor="#00000060"
                  onChangeText={text => handleChangeEmail(text)}
                  keyboardType="email-address"
                />
                {emailError ? (
                  <HelperText type="error" visible={true} style={{ top: 2 }}>
                    This is not a valid email!
                  </HelperText>
                ) : null}
              </View>
            )}
            {Boolean(hasEmailChanges) && (
              <>
                <TextInput
                  style={{ ...styles.formInput, marginBottom: 18 }}
                  value={oldPassword}
                  placeholder="Password"
                  secureTextEntry
                  onChangeText={text => setOldPassword(text)}
                  placeholderTextColor="#00000060"
                  returnKeyType='done'
                  blurOnSubmit={false}
                />
                {generalError ? (
                  <HelperText type="error" visible={true} style={{ top: -18 }}>
                    {generalError}
                  </HelperText>
                ) : (
                  <Text allowFontScaling={false} style={styles.infoText}>
                    Password is required to change email
                  </Text>
                )}
              </>
            )}
            <View style={[styles.inputView, {
              marginBottom: 22,
            }]}>
              <Text allowFontScaling={false} style={{ marginTop: 10, fontSize: 12 }}>First Name</Text>
              <TextInput
                style={{ ...styles.formInput }}
                value={firstName}
                placeholder="First Name"
                returnKeyType='done'
                placeholderTextColor="#00000060"
                onChangeText={text => setFirstName(text)}
              />
            </View>
            <View style={[styles.inputView, {
              marginBottom: 22,
            }]}>
              <Text allowFontScaling={false} style={{ marginTop: 10, fontSize: 12 }}>Last Name</Text>
              <TextInput
                style={{ ...styles.formInput }}
                value={lastName}
                placeholder="Last Name"
                returnKeyType='done'
                placeholderTextColor="#00000060"
                onChangeText={text => setLastName(text)}
              />
            </View>
            <View style={[styles.inputView, {
              marginBottom: 22,
            }]}>
              <Text allowFontScaling={false} style={{ marginTop: 10, fontSize: 12 }}>Date of Birth</Text>
            <TouchableOpacity
              onPress={() => setOpenBirthDateModal(true)}
              disabled
              style={styles.formDatePicker}
              activeOpacity={1}>
              <Text allowFontScaling={false} style={styles.formattedBirthDate}>
                {formattedDate || 'Date of Birth'}
              </Text>
            </TouchableOpacity>
            </View>
            <View style={[styles.inputView, {
              marginBottom: 22,
            }]}>
              <Text allowFontScaling={false} style={{ marginTop: 10, fontSize: 12 }}>Sex</Text>
            <SelectDropdown
              data={sexOptionsArray}
              defaultButtonText="Sex"
              defaultValue={gender}
              disabled
              buttonStyle={styles.formDropdown}
              buttonTextStyle={{ ...styles.formDropdownText, textAlign: 'left' }}
              renderDropdownIcon={(isOpened: boolean) => {
                return (
                  <Icon
                    name={isOpened ? 'chevron-down' : 'chevron-up'}
                    color={'transparent'}
                    size={12}
                    style={{ marginRight: 8 }}
                  />
                );
              }}
              dropdownIconPosition="right"
              rowTextStyle={styles.formDropdownText}
              onSelect={(selectedItem: string) => {
                setGender(selectedItem);
              }}
              buttonTextAfterSelection={(selectedItem: string) => {
                return selectedItem;
              }}
              rowTextForSelection={(item: string) => {
                return item;
              }}
            />
            </View>
          </View>

        </View>
        <ScreenLoader show={isLoading} />
      </KeyboardAwareScrollView >
      <View style={{ flexDirection: 'row', marginBottom:0, backgroundColor: 'white', height: 100, padding: 10, paddingBottom:30}}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#D9D9D9',
            flex: 1,
            alignSelf: 'center',
            paddingVertical: 18,
            borderRadius: 10,
          }}
          disabled={isLoading}
          onPress={onClose}
          activeOpacity={0.6}>
          <Text allowFontScaling={false} style={{ color: '#000', fontFamily: 'Montserrat-SemiBold' }}>
            Cancel
          </Text>
        </TouchableOpacity>
        <View style={{ width: 14 }} />
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#056135',
            flex: 1,
            alignSelf: 'center',
            paddingVertical: 18,
            borderRadius: 10,
          }}
          disabled={isLoading}
          onPress={handleSaveChanges}
          activeOpacity={0.6}>
          <Text allowFontScaling={false} style={styles.buttonLabel}>Save Changes</Text>
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        mode="date"
        title="Select Birth Date"
        open={openBirthDateModal}
        date={birthDate}
        maximumDate={new Date()}
        onConfirm={(date: Date) => {
          setOpenBirthDateModal(false);
          setBirthDate(date);
          setFormattedDate(moment(date).format('MM-DD-YYYY'));
        }}
        onCancel={() => {
          setOpenBirthDateModal(false);
        }}
      />
      <PhotoModal
        isOpen={isPhotoModalVisible}
        onClose={() => setIsPhotoModalVisible(false)}
        onSelect={handleSelection}
      />
    </Modal>
  );
};

export default MyAccountModal;
