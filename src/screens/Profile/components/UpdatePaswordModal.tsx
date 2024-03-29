import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {HelperText} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import ScreenLoader from '../../../components/Loaders/ScreenLoader';
import {updatePassword} from '../../../services/auth';

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
  formInput: {
    paddingHorizontal: 18,
    height: 56,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '500',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8ECF4',
    backgroundColor: '#F7F8F9',
    color: '#8391A1',
  },
  formDatePicker: {
    justifyContent: 'center',
    marginBottom: 22,
    paddingHorizontal: 17,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8ECF4',
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
    marginBottom: 22,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#E8ECF4',
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
});

const UpdatePaswordModal: FC<Props> = ({isOpen = false, onClose}) => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const checkStatus = useCallback(
    (password: string, confirmPassword: string) => {
      if (password.length < 6) {
        return 'Password must be at least 6 characters';
      }
      if (password !== confirmPassword) {
        return "Passwords don't match";
      }
      return null;
    },
    [],
  );

  const hasInvalidConfirmPassword = useMemo(() => {
    if (!userType) {
      return null;
    }
    return checkStatus(password, confirmPassword);
  }, [userType, checkStatus, password, confirmPassword]);

  const handleSaveChanges = async () => {
    setUserType(true);
    if (checkStatus(password, confirmPassword)) {
      return;
    }
    try {
      setIsLoading(true);
      const email = auth().currentUser?.email;
      if (!oldPassword) {
        throw new Error('Old password is required');
      }
      if (!email) {
        throw new Error('User email is required');
      }
      const result = await updatePassword(oldPassword, email, password);
      if (result?.error) {
        throw new Error(result.error);
      }
      onClose();
      setPassword('');
      setOldPassword('');
      setConfirmPassword('');
      setUserType(false);
    } catch (error: any) {
      setGeneralError(error.message);
      console.log('error', error.message);
    }
    setIsLoading(false);
  };
  const inputs = useRef<any>({});
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setGeneralError('');
    setUserType(false);
    setPassword('');
    setOldPassword('');
    setConfirmPassword('');
    const off = setTimeout(() => {
      inputs.current?.password?.focus();
    }, 500);
    return () => {
      clearTimeout(off);
    };
  }, [isOpen]);

  return (
    <>
      <Modal
        isVisible={isOpen}
        animationIn="fadeIn"
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View>
          <View style={styles.container}>
            <View>
              <TextInput
                style={{...styles.formInput, marginBottom: 18}}
                value={oldPassword}
                placeholder="Old Password"
                secureTextEntry
                onChangeText={text => setOldPassword(text)}
                ref={input => {
                  inputs.current.password = input;
                }}
                placeholderTextColor="#00000060"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              <TextInput
                style={{...styles.formInput, marginBottom: 18}}
                value={password}
                placeholder="Password"
                secureTextEntry
                onChangeText={text => {
                  setUserType(true);
                  setPassword(text);
                }}
                ref={input => {
                  inputs.current.password = input;
                }}
                placeholderTextColor="#00000060"
                returnKeyType="next"
                blurOnSubmit={false}
              />
              <TextInput
                style={{...styles.formInput, marginBottom: 18}}
                value={confirmPassword}
                placeholder="Confirm password"
                secureTextEntry
                onChangeText={text => {
                  setUserType(true);
                  setConfirmPassword(text);
                }}
                placeholderTextColor="#00000060"
                blurOnSubmit={false}
              />
              {hasInvalidConfirmPassword ? (
                <HelperText type="error" visible={true} style={{top: -18}}>
                  {hasInvalidConfirmPassword}
                </HelperText>
              ) : null}
              {generalError ? (
                <HelperText type="error" visible={true} style={{top: -18}}>
                  {generalError}
                </HelperText>
              ) : null}
            </View>

            <View style={{flexDirection: 'row', marginBottom: 10}}>
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
                onPress={onClose}
                activeOpacity={0.6}>
                <Text allowFontScaling={false}
                  style={{color: '#000', fontFamily: 'Montserrat-SemiBold'}}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <View style={{width: 14}} />
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
                onPress={handleSaveChanges}
                activeOpacity={0.6}>
                <Text allowFontScaling={false} style={styles.buttonLabel}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScreenLoader show={isLoading} />
        </View>
      </Modal>
    </>
  );
};

export default UpdatePaswordModal;
