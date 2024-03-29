import React, {FC} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  text: string;
  onAccept: () => void;
  cancelText: string
  continueText: string
};
const ActionPopup: FC<Props> = props => {
  const {isOpen, onClose, text, onAccept, cancelText, continueText} = props;
  return (
    <Modal
      isVisible={isOpen}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection={['up', 'down']}>
      <View style={styles.aboutLevelsContainer}>
        <Text allowFontScaling={false} style={styles.modalDescription}>{text}?</Text>
        <View style={{marginTop: 20}} />
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#D9D9D9',
              flex: 1,
              alignSelf: 'center',
              paddingVertical: 18,
              borderRadius: 25,
            }}
            onPress={onClose}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={{color: '#000', fontFamily: 'Montserrat-SemiBold'}}>
              {cancelText}
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
              borderRadius: 25,
            }}
            onPress={onAccept}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={{color: 'white', fontFamily: 'Montserrat-SemiBold'}}>
              {continueText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ActionPopup;

const styles = StyleSheet.create({
  aboutLevelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  modalDescription: {
    fontFamily: 'Montserrat-SemiBold',
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
});
