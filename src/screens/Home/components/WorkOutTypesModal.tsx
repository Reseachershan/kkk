import React, {FC, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity, Image} from 'react-native';
import Modal from 'react-native-modal';
import WorkTypeInfoModal from '../../../components/WorkTypeInfoModal';

type Props = {
  isWorkOutTypesModalVisible: boolean;
  workOutType: string;
  setWorkOutType: any;
  setIsWorkOutTypesModalVisible: any;
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 663,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
    // paddingBottom: 100
  },
  modalTitle: {
    marginTop: 32,
    fontFamily: 'Montserrat-Regular',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 23.28,
    color: '#056135',
  },
  button: {
    width: 173,
    height: 267,
    borderRadius: 10,
  },
  buttonTitle: {
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 17.46,
    color: '#FFFFFF',
  },
  buttonDescription: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 10,
    lineHeight: 12.8,
    color: '#FFFFFF',
  },
});

const WorkOutTypesModal: FC<Props> = ({
  isWorkOutTypesModalVisible = false,
  workOutType = 'single',
  setWorkOutType,
  setIsWorkOutTypesModalVisible,
}) => {
  const [showWorkTypeInfo, setShowWorkTypeInfo] = useState(false);
  const handleWorkOutType = (value: string) => {
    if (value === 'double') {
      return setShowWorkTypeInfo(true);
    } else {
      setWorkOutType(value);
    }

    setIsWorkOutTypesModalVisible(false);
  };

  return (
    <>
      <Modal
        isVisible={isWorkOutTypesModalVisible}
        onSwipeComplete={() =>
          !showWorkTypeInfo && setIsWorkOutTypesModalVisible(false)
        }
        swipeDirection={!showWorkTypeInfo ? ['up', 'down'] : []}
        style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.container}>
          <Text allowFontScaling={false} style={styles.modalTitle}>WORKOUT TYPES</Text>
          <View style={{marginTop: 30}}>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => handleWorkOutType('single')}
                style={{
                  ...styles.button,
                  marginRight: 13,
                  justifyContent: 'center',
                  backgroundColor:
                    workOutType === 'single' ? '#094728' : '#0F6D3D',
                }}
                activeOpacity={0.6}>
                <View style={{marginBottom: 57}}>
                  <Text allowFontScaling={false}
                    style={{
                      ...styles.buttonTitle,
                      marginBottom: 20,
                      marginLeft: 20,
                    }}>
                    SINGLE
                  </Text>

                  <View style={{width: 133, alignSelf: 'center'}}>
                    <Text allowFontScaling={false} style={{...styles.buttonDescription}}>
                      The classic Klimb. Start at the bottom, finish when you
                      reach the top!
                    </Text>
                  </View>
                </View>

                <Image
                  source={require('../../../assets/home/single-option-icon.png')}
                  style={{marginTop: 10, width: 100, height: 80, resizeMode: 'contain', alignSelf: 'center'}}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleWorkOutType('double')}
                style={{
                  ...styles.button,
                  justifyContent: 'center',
                  backgroundColor:
                    workOutType === 'double' ? '#094728' : '#0F6D3D',
                }}
                activeOpacity={0.6}>
                <View style={{marginBottom: 20}}>
                  <Text allowFontScaling={false}
                    style={{
                      ...styles.buttonTitle,
                      marginBottom: 20,
                      marginLeft: 16,
                    }}>
                    DOUBLE
                  </Text>

                  <View style={{width: 139, alignSelf: 'center'}}>
                    <Text allowFontScaling={false} style={{...styles.buttonDescription}}>
                      A challenge that doubles your steps! Once you reach the
                      top, recover on your way down and race back up again!
                      Counts as 2 Klimbs in your Klimb level
                    </Text>
                  </View>
                </View>

                <Image
                  source={require('../../../assets/home/double-option-icon.png')}
                  style={{marginTop: 10,  width: 130, height: 80, resizeMode: 'contain', alignSelf: 'center'}}
                />
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 14, flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => handleWorkOutType('TRIPLE')}
                style={{
                  ...styles.button,
                  marginRight: 13,
                  backgroundColor:
                    workOutType === 'TRIPLE' ? '#094728' : '#0F6D3D',
                }}
                activeOpacity={0.6}
                disabled>
                <Text allowFontScaling={false}
                  style={{
                    ...styles.buttonTitle,
                    position: 'absolute',
                    marginTop: 33,
                    marginLeft: 20,
                  }}>
                  TRIPLE
                </Text>

                <View
                  style={{
                    justifyContent: 'center',
                    height: 267,
                    borderRadius: 10,
                    backgroundColor: '#00000090',
                  }}>
                  <Text allowFontScaling={false}
                    style={{
                      // ...styles.buttonDescription,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'Montserrat-Bold',
                      fontWeight: '500',
                      fontSize: 16
                    }}>
                    COMING SOON
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleWorkOutType('SPRINT')}
                style={{
                  ...styles.button,
                  backgroundColor:
                    workOutType === 'SPRINT' ? '#094728' : '#0F6D3D',
                }}
                activeOpacity={0.6}
                disabled>
                <Text allowFontScaling={false}
                  style={{
                    ...styles.buttonTitle,
                    position: 'absolute',
                    marginTop: 33,
                    marginLeft: 20,
                  }}>
                  SPRINT
                </Text>

                <View
                  style={{
                    justifyContent: 'center',
                    height: 267,
                    borderRadius: 10,
                    backgroundColor: '#00000090',
                  }}>
                  <Text allowFontScaling={false}
                    style={{
                      // ...styles.buttonDescription,
                      color: '#fff',
                      textAlign: 'center',
                      fontFamily: 'Montserrat-Bold',
                      fontWeight: '500',
                      fontSize: 16
                    }}>
                    COMING SOON
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <WorkTypeInfoModal
          isOpen={showWorkTypeInfo}
          onClose={() => setShowWorkTypeInfo(false)}
          onSelected={() => {
            setShowWorkTypeInfo(false);
            setWorkOutType('double');
            setIsWorkOutTypesModalVisible(false);
          }}
          type="double"
          isModal
        />
      </Modal>
    </>
  );
};

export default WorkOutTypesModal;
