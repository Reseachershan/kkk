import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {FC, useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {workOut} from '../contexts/workOutContext';
import {getTimeFormat} from '../hooks/useTracker';
import useUser from '../hooks/useUser';
import {observerWorkoutsByUserId} from '../services/workout';
import NavigationBottomBar from './NavigationBottomBar';

type Props = {isOpen: boolean; onClose: () => void};
const KlimbLogsModal: FC<Props> = ({isOpen, onClose}) => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const {user} = useUser();
  const [klimbLogs, setKlimbLogs] = useState<workOut[]>([]);

  const [isF, setIsF] = useState(isFocused);
  const [preNavigate, setPreNavigate] = useState(false);
  useEffect(() => {
    if (isFocused) {
      setIsF(true);
      return;
    }
    const off = setTimeout(() => {
      setPreNavigate(false);
      setIsF(false);
    }, 300);
    return () => {
      clearTimeout(off);
    };
  }, [isFocused]);
  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const off = observerWorkoutsByUserId(user?.uid, logs => {
     const data = logs.sort(function(a: any, b: any) {
        return b.date - a.date;
      });

      setKlimbLogs(data);
    });

    return () => {
      off?.();
    };
  }, [user?.uid]);

  return (
    <Modal
      isVisible={isOpen && isFocused}
      onDismiss={() => {
        isFocused && onClose?.();
      }}
      animationIn={isF ? 'slideInUp' : 'slideInLeft'}
      animationOut={preNavigate ? 'slideOutLeft' : 'slideOutDown'}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        flex: 1,
        backgroundColor: 'transparent',
        paddingTop: 110,
      }}
      backdropOpacity={0}>
      <View style={styles.body}>
        <Text allowFontScaling={false} style={styles.logsText}>Klimb Logs</Text>
        <FlatList
          style={{
            flex: 1,
            marginTop: 12,
            alignContent: 'center',
          }}
          data={klimbLogs}
          keyExtractor={klimbLog => `${klimbLog.workoutId}`}
          ItemSeparatorComponent={() => <View style={{height: 18}} />}
          ListFooterComponent={<View style={{height: 120}} />}
          renderItem={({item: klimbLog}) => (
            <KlimbItem
              key={klimbLog.workoutId}
              klimbLog={klimbLog}
              onPress={() => {
                setPreNavigate(true);
                setTimeout(() => {
                  navigation.navigate('KlimbFinished', {
                    isLogs: true,
                    canChangePhoto: false,
                    workOutId: klimbLog.workoutId,
                  });
                }, 1);
              }}
            />
          )}
        />
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          position: 'absolute',
          bottom: 65,
          width: '100%',
          //shadow
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}>
        <TouchableOpacity
          onPress={onClose}
          style={{
            marginTop: 10,
            marginBottom: 20,
            marginHorizontal: 21,
            backgroundColor: '#056135',
            justifyContent: 'center',
            height: 56,
            borderRadius: 100,
          }}
          activeOpacity={0.6}>
          <LinearGradient
            colors={['#23744D', '#23744D']}
            angle={156.12}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              borderRadius: 100,
              flexDirection: 'row',
              padding: 10,
            }}>
            <Text
            allowFontScaling={false}
              style={{
                color: '#FFFFFF',
                fontFamily: 'Montserrat-Bold',
                fontSize: 16,
                fontWeight: '500',
              }}>
              BACK TO STATS
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <NavigationBottomBar index={0} onPress={onClose} />
    </Modal>
  );
};

export default KlimbLogsModal;

const styles = StyleSheet.create({
  logsText: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 18,
    color: '#000000',
    paddingTop: 12,
    paddingBottom: 22,
  },
  bodyKlimbLogs: {
    height: 66,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
  },
  logMonth: {
    marginTop: 4,
    fontFamily: 'Montserrat-Regular',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 13.97,
    color: '#FFFFFF',
  },
  logDay: {
    marginTop: 5,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '500',
    fontSize: 22,
    lineHeight: 25.61,
    color: '#FFFFFF',
  },
  logTitle: {
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 16.3,
    color: '#000000',
    textTransform: 'capitalize',
  },
  logWorkOutType: {
    fontFamily: 'Montserrat-Regular',
    fontWeight: '300',
    fontSize: 14,
    lineHeight: 16.3,
    color: '#828181',
  },
  logTime: {
    marginTop: 21,
    textAlign: 'center',
    fontFamily: 'Montserrat-Bold',
    fontWeight: '700',
    fontSize: 26,
    lineHeight: 30,
    color: '#056135',
    marginRight: 5
  },
  body: {
    marginTop: 12,
    flex: 1,
    width: '100%',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    backgroundColor: '#F8FAF9',
    paddingTop: 20,
    paddingHorizontal: 21,
  },
});
type KlimbItemProps = {klimbLog: workOut; onPress: () => void};
const KlimbItem: FC<KlimbItemProps> = ({klimbLog, onPress}) => {
  const time = useMemo(() => {
    return getTimeFormat(klimbLog.elapsedTime || 0, 0);
  }, [klimbLog.elapsedTime]);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.bodyKlimbLogs}
      activeOpacity={0.6}>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <LinearGradient
          colors={['#056135', '#23744D']}
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: 52,
            height: 66,
            borderRadius: 10,
          }}>
          <Text allowFontScaling={false} style={styles.logMonth}>
            {moment(klimbLog.date).format('MMM').toUpperCase()}
          </Text>

          <Text allowFontScaling={false} style={styles.logDay}>
            {moment(klimbLog.date).format('DD')}
          </Text>
        </LinearGradient>

        <View
          style={{
            flex: 1,
            marginLeft: 11,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingVertical: 12,
          }}>
          <Text allowFontScaling={false} style={styles.logTitle} numberOfLines={1} lineBreakMode="clip">
            {klimbLog.workOutType} workout
          </Text>

          <Text allowFontScaling={false} style={styles.logWorkOutType}>{klimbLog.note}</Text>
        </View>

        <View style={{height: '100%', alignItems: 'flex-end'}}>
          <Text allowFontScaling={false} style={styles.logTime}>{time}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
