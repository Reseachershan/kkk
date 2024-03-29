import React, {FC, useRef} from 'react';
import {View, StyleSheet, TouchableOpacity, Image, Text} from 'react-native';
import Modal from 'react-native-modal';
import Icon from '../../../components/Icon/Icon';
import * as ImagePicker from 'react-native-image-picker';

interface Action {
  title: string;
  type: 'capture' | 'library';
  options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
  id: string;
  image: any;
}

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: ImagePicker.Callback | undefined;
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  optionTitle: {
    marginLeft: 14,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
});

const PhotoModal: FC<Props> = ({isOpen = false, onClose, onSelect}) => {
  const actions: Action[] = [
    {
      title: 'Camera',
      id: 'capture',
      image: require('../../../assets/klimb-summary/camera-icon.png'),
      type: 'capture',
      options: {
        saveToPhotos: false,
        mediaType: 'photo',
        includeBase64: false,
        includeExtra: true,
      },
    },
    {
      title: 'Photo Library',
      id: 'library',
      image: require('../../../assets/klimb-summary/klimb-gallery-icon.png'),
      type: 'library',
      options: {
        mediaType: 'photo',
        includeBase64: false,
        includeExtra: true,
      },
    },
  ];
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onButtonPress = React.useCallback(
    (
      type: string,
      options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions,
    ) => {
      if (type === 'capture') {
        return ImagePicker.launchCamera(options, onSelectRef.current);
      }
      ImagePicker.launchImageLibrary(options, onSelectRef.current);
    },
    [],
  );

  return (
    <>
      <Modal
        isVisible={isOpen}
        onSwipeComplete={onClose}
        swipeDirection={['up', 'down']}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <TouchableOpacity style={{width: '100%', flex: 1}} onPress={onClose} />
        <View style={styles.container}>
          <View
            style={{
              flexDirection: 'column',
              justifyContent: 'center',
              paddingVertical: 24,
            }}>
            {actions.map(action => {
              return (
                <TouchableOpacity
                  key={action.id}
                  onPress={() => onButtonPress(action.type, action.options)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 16,
                  }}
                  activeOpacity={1}>
                  <View
                    style={{justifyContent: 'center',
                    alignItems: 'center',
                    width: 60,
                    height: 60,
                    borderRadius: 10,
                    backgroundColor: ((action.id=='library')? '#07361F':'#0E6036'),
                    left: 15, marginRight: 15}}
                    >
                    <Icon name={(action.id=='capture')?"camera-alt":"photo"} type='material' size={30} color="#fff" />
                  </View> 
                  {/* <Image source={action.image} style={{marginLeft: 24}} /> */}
                  <Text allowFontScaling={false} style={styles.optionTitle}>{action.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default PhotoModal;
