import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import PhotoModal from './components/PhotoModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getTimeFormat } from '../../hooks/useTracker';
import useUser from '../../hooks/useUser';
import { workOut } from '../../contexts/workOutContext';
import { observerWorkoutById, uploadWorkoutImage } from '../../services/workout';
import ScreenLoader from '../../components/Loaders/ScreenLoader';
import { getDocument } from '../../services/firestore';
import LinearGradient from 'react-native-linear-gradient';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ActionPopup from '../../components/Modals/ActionPopup';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialIcons';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  screenTitle: {
    textAlign: 'center',
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '900',
    fontSize: 30,
    lineHeight: 24,
    color: '#056135',
    paddingTop: 30
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 34,
    marginLeft: 41,
    marginRight: 42,
    height: 202,
    borderStyle: 'dashed',
    borderColor: '#0E6036',
    borderRadius: 8,
    width: '50%',
    alignSelf: 'center', 
    justifyContent:'center', 
  },
  selectPhotoText: {
    marginTop: 26,
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 23,
    lineHeight: 28,
    color: '#0E6036',
  },
  summaryTitle: {
    marginTop: 14,
    textAlign: 'center',
    fontFamily: 'Montserrat',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 28,
    color: '#000000',
  },
  summaryContentTitle: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 20,
    color: '#000000',
  },
  summaryContentValue: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 20,
    lineHeight: 24,
    color: '#000000',
  },
  notesInput: {
    paddingHorizontal: 13,
    textAlignVertical: 'top',
    marginTop: 25,
    marginLeft: 1,
    height: 90,
    borderRadius: 5,
    backgroundColor: '#E9E9E9',
  },
  notesText: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 13,
    lineHeight: 16,
    color: '#000000',
  },
  button: {
    // justifyContent: 'center',
    // alignItems: 'center',
    height: 53,
    marginLeft: 41,
    marginRight: 42,
    borderRadius: 25,
    backgroundColor: '#056135',
  },
  buttonLabel: {
    fontFamily: 'GoodTimesBk-Regular',
    fontWeight: '300',
    fontSize: 13,
    lineHeight: 17,
    color: '#FFFFFF',
  },
  greyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    height: 53,
    marginLeft: 41,
    marginRight: 42,
    borderRadius: 25,
  },
});

export const KlimbFinished = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { isLogs, canChangePhoto, workOutId } = route.params;
  const [averageTemp] = useState(69);
  const [notes, setNotes] = useState('');
  const [isPhotoModalVisible, setIsPhotoModalVisible] = useState(false);
  const [image, setImage] = useState<any>(null);
  const { user } = useUser();
  const [workout, setWorkout] = useState<workOut | null>(null);
  const { workOutType, date, elapsedTime, startTime, endTime } = workout || {};
  const [loadImage, setLoadImage] = useState(false);
  const [isWithOutImage, SetIsWithOutImage] = useState(false)
  const [isDone, setIsDone] = useState(false)
  
  useEffect(() => {
    if (!workOutId) {
      return;
    }
    const off = observerWorkoutById(workOutId, workout => {
      setWorkout(workout);
      setImage(workout?.image || '');
      setNotes(workout?.note || '');
    });
    return () => off?.();
  }, [workOutId]);

  const time = useMemo(() => {
    return getTimeFormat(elapsedTime || 0, 0);
  }, [elapsedTime]);
  const handleSelection = useCallback(async (data: any) => {
    if (data?.assets) {
      setIsPhotoModalVisible(false);
      setImage(data.assets[0].uri);
    }
  }, []);

  const handleFinish = async () => {
    if (isLogs) {
      navigation.goBack();
      return;
    }
    if (image) {
      try {
        setLoadImage(true);
        await uploadWorkoutImage(image, workOutId, user?.uid || '');
      } catch (error) {
      } finally {
        setLoadImage(false);
      }
    }
    if (workout?.workoutId) {
      getDocument(`workouts/${workout?.workoutId}`).update({
        note: notes || '',
      });
    }
    navigation.navigate('KlimbSummaryPicker', { customImage: image, workout: workout });
  }

  return (
    <KeyboardAwareScrollView>
      <PhotoModal
        isOpen={isPhotoModalVisible}
        onClose={() => setIsPhotoModalVisible(false)}
        onSelect={handleSelection}
      />

      <SafeAreaView style={styles.container}>
        <Text allowFontScaling={false} style={styles.screenTitle}>KLIMB FINISHED</Text>

        <ScrollView style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setIsPhotoModalVisible(true)}
            style={{
              ...styles.imageContainer,
              borderWidth: image ? 0 : 3,
            }}
            activeOpacity={1}
            disabled={isLogs || !canChangePhoto || loadImage}>
            {!image ? (
              <>
                {canChangePhoto && <MaterialCommunityIcons name="photo-camera-back" size={40} color="#0E6036" style={{ marginTop: 65 }} />}
                <Text allowFontScaling={false} style={styles.selectPhotoText}>Select Photo</Text>
              </>
            ) : (
              <Image
                resizeMode="cover"
                resizeMethod="scale"
                source={{ uri: image }}
                style={{ width: '99%', height: 202, borderRadius: 10 }}
              />
            )}
          </TouchableOpacity>

          <Text allowFontScaling={false} style={styles.summaryTitle}>SUMMARY</Text>

          <View
            style={{
              flexDirection: 'column',
              marginTop: 15,
              marginLeft: 41,
              marginRight: 37,
            }}>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text allowFontScaling={false} style={styles.summaryContentTitle}>Date:</Text>
              <Text allowFontScaling={false} style={styles.summaryContentValue}>
                {moment(date).format('ll')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Text allowFontScaling={false} style={styles.summaryContentTitle}>Workout Type:</Text>
              <Text allowFontScaling={false}
                style={{
                  ...styles.summaryContentValue,
                  textTransform: 'capitalize',
                }}>
                {workOutType}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Text allowFontScaling={false} style={styles.summaryContentTitle}>Elapsed Time:</Text>
              <Text allowFontScaling={false} style={styles.summaryContentValue}>{time}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Text allowFontScaling={false} style={styles.summaryContentTitle}>Start Time:</Text>
              <Text allowFontScaling={false} style={styles.summaryContentValue}>
                {moment(startTime).format('h:mm:ss A')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Text allowFontScaling={false} style={styles.summaryContentTitle}>End Time:</Text>
              <Text allowFontScaling={false} style={styles.summaryContentValue}>
                {moment(endTime).format('h:mm:ss A')}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 15,
              }}>
              <Text allowFontScaling={false} style={styles.summaryContentTitle}>Average Temp:</Text>
              <Text allowFontScaling={false} style={styles.summaryContentValue}>
                {averageTemp}°{user?.temperatureUnit}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'column',
              marginTop: 15,
              marginLeft: 40,
              marginRight: 42,
              marginBottom: 20,
              justifyContent:'center',
            }}>
            <Text allowFontScaling={false} style={styles.summaryContentTitle}>Workout Notes:</Text>
            {isDone && <TouchableOpacity onPress={() => { }} style={{ ...styles.button, width: 90, marginLeft: "76%", justifyContent: 'center', alignItems: 'center', height: 30, marginTop: -35 }}>
              <Text allowFontScaling={false} style={{ ...styles.summaryContentTitle, color: '#fff' }}>Done</Text>
            </TouchableOpacity>
            }
            <TextInput
              style={styles.notesInput}
              value={notes}
              placeholder="Type notes here..."
              onChangeText={text => setNotes(text)}
              multiline={true}
              numberOfLines={5}
              underlineColorAndroid="transparent"
              editable={true}
              onFocus={() => setIsDone(true)}
              onBlur={() => setIsDone(false)}
            />
          </View>
        </ScrollView>

        <ActionPopup
          isOpen={isWithOutImage}
          onClose={async () => {
            if (isLogs) {
              navigation.goBack();
              return;
            }
            if (image) {
              try {
                setLoadImage(true);
                await uploadWorkoutImage(image, workOutId, user?.uid || '');
              } catch (error) {
              } finally {
                setLoadImage(false);
              }
            }
            if (workout?.workoutId) {
              getDocument(`workouts/${workout?.workoutId}`).update({
                note: notes || '',
              });
            }
            SetIsWithOutImage(false)
            navigation.navigate('KlimbSummaryPicker', { customImage: image, workout: workout });
          }}
          text='Are you sure you want to finish without a photo'
          cancelText='YES'
          continueText='NO' 
          onAccept={() => {
            SetIsWithOutImage(false)
          }}
        />

        {canChangePhoto ? <TouchableOpacity
          onPress={async () => {
            if (image) {
              handleFinish()
            } else {
              SetIsWithOutImage(true)
            }
          }}
          disabled={loadImage}
          style={image ? styles.button : styles.greyButton}
          activeOpacity={0.6}>
          {
            !image ? <Text allowFontScaling={false} style={{
              ...styles.buttonLabel, color: '#000000',
              fontFamily: 'Montserrat-Bold',
              fontSize: 16,
              fontWeight: '500',
            }}>
              FINISH WITHOUT PHOTO
            </Text> :
              <LinearGradient
                colors={['#056135', '#056135']}
                angle={156.12}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  borderRadius: 100,
                  flexDirection: 'row',
                  padding: 10,
                }}>
                <Text allowFontScaling={false}
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 16,
                    fontWeight: '500',
                  }}>
                  {isLogs ? 'BACK TO LOG' : image ? 'FINISH' : 'FINISH WITHOUT PHOTO'}
                </Text>
              </LinearGradient>
          }
        </TouchableOpacity> :

          <TouchableOpacity
            onPress={async () => {
              navigation.navigate("Stats")
            }}
            disabled={loadImage}
            style={styles.button}
            activeOpacity={0.6}>
            {
              <LinearGradient
                colors={['#056135', '#056135']}
                angle={156.12}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: 1,
                  borderRadius: 100,
                  flexDirection: 'row',
                  padding: 10,
                }}>
                <Text allowFontScaling={false}
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Montserrat-Bold',
                    fontSize: 16,
                    fontWeight: '500',
                  }}>
                  BACK TO LOG
                </Text>
              </LinearGradient>
            }
          </TouchableOpacity>
        } 
    

 
        
      </SafeAreaView>
      <ScreenLoader show={loadImage} />
    </KeyboardAwareScrollView>
  );
};
