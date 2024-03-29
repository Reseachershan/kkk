import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';

import LinearGradient from 'react-native-linear-gradient';
import Animated from 'react-native-reanimated';
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome5';
import TabLabels from '../../components/TabLabels';
import useUser from '../../hooks/useUser';
import styles from './styles/Leaderboard';
import ActionPopup from '../../components/Modals/ActionPopup';
import { getLevelImage } from '../../utils/klimb';
import {
  ageRangeType,
  agrupationType,
  getAllObserverLeaderboards,
  observerLeaderboards,
} from '../../services/leaderBoards';
import { getTimeFormat } from '../../hooks/useTracker';

type player = {
  position: number;
  userName: string;
  profileImage: any;
  level: any;
  bestTime: number;
  isTop: boolean;
  dummy?: boolean;
  leaderBoardId: string;
  klimbLevel?: string
  userId?: string
};
const H_MAX_HEIGHT = 245;
const H_MIN_HEIGHT = 66;
const H_SCROLL_DISTANCE = H_MAX_HEIGHT - H_MIN_HEIGHT;
const leaderBoardArray: player[] = [
  {
    position: 1,
    userName: 'Mark',
    profileImage: require('../../assets/home/top-1.png'),
    level: 'elite',
    bestTime: 60000,
    isTop: false,
    dummy: true,
    leaderBoardId: '1',
  },
  {
    position: 2,
    userName: 'Jenna',
    profileImage: require('../../assets/home/top-2.png'),
    level: 'elite',
    bestTime: 60600,
    isTop: false,
    dummy: true,
    leaderBoardId: '2',
  },
  {
    position: 3,
    userName: 'Devin',
    profileImage: require('../../assets/home/top-3.png'),
    level: 'elite',
    bestTime: 61800,
    isTop: false,
    dummy: true,
    leaderBoardId: '3',
  },
  {
    position: 4,
    userName: 'Abby',
    profileImage: require('../../assets/home/user-2.png'),
    level: 'elite',
    bestTime: 66000,
    isTop: false,
    dummy: true,
    leaderBoardId: '4',
  },
  {
    position: 5,
    userName: 'Kacie',
    profileImage: require('../../assets/home/user-3.png'),
    level: 'explorer',
    bestTime: 66600,
    isTop: false,
    dummy: true,
    leaderBoardId: '5',
  },
  {
    position: 6,
    userName: 'Brandon',
    profileImage: require('../../assets/home/user-4.png'),
    level: 'elite',
    bestTime: 72000,
    isTop: false,
    dummy: true,
    leaderBoardId: '6',
  },
  {
    position: 7,
    userName: 'Kaimana',
    profileImage: require('../../assets/home/user-5.png'),
    level: 'elite',
    bestTime: 75000,
    isTop: false,
    dummy: true,
    leaderBoardId: '7',
  },
  {
    position: 8,
    userName: 'Sandra',
    profileImage: require('../../assets/home/user-6.png'),
    level: 'master',
    bestTime: 82000,
    isTop: false,
    dummy: true,
    leaderBoardId: '8',
  },
  {
    position: 16,
    userName: 'Jake',
    profileImage: require('../../assets/home/user-1.png'),
    level: 'explorer',
    bestTime: 120000,
    isTop: true,
    dummy: true,
    leaderBoardId: '9',
  },
];
const Times = [
  {
    id: 'day',
    name: 'Today',
  },
  {
    id: 'week',
    name: 'Week',
  },
  {
    id: 'month',
    name: 'Month',
  },
  {
    id: 'year',
    name: 'Year',
  },
];
const Leaderboard = () => {
  const [headerTopLeaderboard, setHeaderTopLeaderboard] =
    useState<agrupationType>('day');
  const [workOutType, setWorkOutType] = useState('Single');
  const [sexFilter, setSexFilter] = useState<'male' | 'female' | 'All'>('All');
  const [ageFilter, setAgeFilter] = useState<ageRangeType>('All');
  const { toggleProfileVisiblity, user } = useUser();
  const { hideProfile } = user || {};
  const workOutTypesArray = ['Double', 'Single'];

  const sexFilterArray = ['All', 'Male', 'Female'];
  const scrollOffsetY = useRef(new Animated.Value(0)).current;
  const [leaderBoards, setLeaderBoards] = useState<any[]>([]);
  const [allLeaderBoards, setAllLeaderBoards] = useState<any[]>([]);
  const hideTop = hideProfile || !leaderBoards.length;
  const headerScrollHeight = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [hideTop ? H_MIN_HEIGHT : H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  const headerScrollHeight2 = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [hideTop ? H_MIN_HEIGHT : H_MAX_HEIGHT, H_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  const ageFilterArray: ageRangeType[] = [
    'All',
    'Under 20',
    '20-29',
    '30-39',
    '40-49',
    '50-59',
    '60-69',
    'Over 70',
  ];
  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const off = observerLeaderboards(
      Date.now(),
      workOutType === 'Single' ? 'single' : 'double',
      headerTopLeaderboard,
      sexFilter,
      ageFilter,
      leaderboards =>
        setLeaderBoards(
          leaderboards.map((item, index) => ({
            ...item,
            position: index + 1,
            leaderBoardId: item.leaderBoardId + 1,
          })),
        ),
    );

    return () => {
      off?.();
    };
  }, [ageFilter, headerTopLeaderboard, sexFilter, user?.uid, workOutType]);

  useEffect(() => {
    if (!user?.uid) {
      return;
    }
    const off = getAllObserverLeaderboards(
      Date.now(),
      workOutType === 'Single' ? 'single' : 'double',
      headerTopLeaderboard,
      sexFilter,
      ageFilter,
      leaderboards =>
        setAllLeaderBoards(
          leaderboards.map((item, index) => ({
            ...item,
            position: index + 1,
            leaderBoardId: item.leaderBoardId + 1,
          })),
        ),
    );

    return () => {
      off?.();
    };
  }, [ageFilter, headerTopLeaderboard, sexFilter, user?.uid, workOutType]);

  const { topPlayers, restPlayers } = useMemo(() => {
    const topPlayers: player[] = [];
    const restPlayers: player[] = [];
    (hideProfile ? leaderBoardArray : leaderBoards)
      .sort((a, b) => {
        if (a.isTop && !b.isTop) {
          return -1;
        }
        if (!a.isTop && b.isTop) {
          return 1;
        }
        return a.position - b.position;
      })
      .forEach(item => {
        if (item.position <= 3) {
          topPlayers.push(item);
        } else if (item.position <= 50 || item.isTop) {
          restPlayers.push(item);
        }
      });
      
    return { topPlayers: topPlayers, restPlayers };
  }, [hideProfile, leaderBoards]);

  useEffect(() => {
    let data = allLeaderBoards.find((userData) => userData.userId === user?.uid);
    if (data && !restPlayers.some((item) => item.userId === data.userId) ) {
      restPlayers.push(data)
    } 
  }, [hideProfile, allLeaderBoards, user, restPlayers])

  const handleHeaderTopLeaderboard = (option: string) => {
    const value = headerTopLeaderboard === option ? 'all' : option;
    setHeaderTopLeaderboard(value as agrupationType);
  };
  const [showAboutLevels, setShowAboutLevels] = useState(false);
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={['#046034', '#04603400']}
          style={styles.background}>
          <View style={styles.header}>
            <View style={{ height: 60, width: 150, alignSelf: 'center' }}>
              <Image
                source={require('../../assets/home/leaderboard-screen-logo.png')}
                style={{ flex: 1, width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            </View>
            {/* <Image
              source={require('../../assets/home/leaderboard-screen-logo.png')}
              style={{alignSelf: 'center'}}
            /> */}
            <TabLabels
              tabs={Times}
              onSelect={handleHeaderTopLeaderboard}
              selected={headerTopLeaderboard}
            />
          </View>
          <View style={styles.body}>
            <Animated.View
              style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                marginTop: headerScrollHeight,
              }}
            />
            <Animated.FlatList
              showsVerticalScrollIndicator={false}
              style={{
                flex: 1,
                marginTop: 32,
                paddingTop: 0,
                marginHorizontal: 8,
                zIndex: 999,
              }}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scrollOffsetY } } }],
                {
                  useNativeDriver: false,
                },
              )}
              ListHeaderComponent={
                <View
                  style={{
                    marginTop: hideTop ? H_MIN_HEIGHT : H_MAX_HEIGHT,
                  }}
                />
              }
              scrollEventThrottle={10}
              data={restPlayers}
              keyExtractor={user => `${user.leaderBoardId}`}
              ListFooterComponent={<View style={{ height: 1 }} />}
              renderItem={({ item: user }) => <PlayerRender user={user} />}
            />
            <Animated.View
              style={{
                top: 10,
                height: headerScrollHeight,
                position: 'absolute',
                width: '100%',
                // overflow: 'hidden',
                zIndex: 999,
                // STYLE
              }}>
              <Animated.ScrollView
                style={{
                  height: headerScrollHeight2,
                  width: '100%',
                  overflow: 'hidden',
                  zIndex: 999,
                  paddingBottom: 5,
                  // STYLE
                }}
                scrollEnabled={false}>
                {!hideTop && (
                  <TopPlayerList
                    players={topPlayers}
                    scrollOffsetY={scrollOffsetY}
                  />
                )}
              </Animated.ScrollView>
              <View
                style={{
                  paddingBottom: 1,
                  paddingHorizontal: 20,
                  justifyContent: 'space-between',
                  backgroundColor: '#FFFFFF',
                  flexDirection: 'row',
                  borderTopLeftRadius: 35,
                  borderTopRightRadius: 35,
                  height: 65,
                }}>
                <View style={{ alignItems: 'center', flex: 4 }}>
                  <Text allowFontScaling={false}
                    numberOfLines={1}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      // marginBottom: 5,
                      padding: 10
                    }}>
                    WORKOUT
                  </Text>
                  <SelectDropdown
                    data={workOutTypesArray}
                    defaultValue={workOutType}
                    buttonStyle={{ ...styles.button, maxWidth: '100%' }}
                    buttonTextStyle={styles.buttonLabel}
                    renderDropdownIcon={isOpened => {
                      return (
                        <Icon
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={'#444'}
                          size={12}
                        />
                      );
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdownStyle}
                    rowTextStyle={styles.rowStyle}
                    onSelect={selectedItem => {
                      setWorkOutType(selectedItem);
                    }}
                    buttonTextAfterSelection={selectedItem => {
                      return selectedItem;
                    }}
                    rowTextForSelection={item => {
                      return item;
                    }}
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ alignItems: 'center', flex: 4 }}>
                  <Text allowFontScaling={false}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      // marginBottom: 2,
                      padding: 10
                    }}>
                    SEX
                  </Text>
                  <SelectDropdown
                    data={sexFilterArray}
                    defaultValue={sexFilter}
                    buttonStyle={{ ...styles.button, maxWidth: '100%' }}
                    buttonTextStyle={styles.buttonLabel}
                    renderDropdownIcon={isOpened => {
                      return (
                        <Icon
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={'#444'}
                          size={12}
                        />
                      );
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdownStyle}
                    rowTextStyle={styles.rowStyle}
                    onSelect={selectedItem => {
                      setSexFilter(selectedItem);
                    }}
                    buttonTextAfterSelection={selectedItem => {
                      return selectedItem;
                    }}
                    rowTextForSelection={item => {
                      return item;
                    }}
                  />
                </View>
                <View style={{ width: 12 }} />
                <View style={{ alignItems: 'center', flex: 4 }}>
                  <Text allowFontScaling={false}
                    style={{
                      fontFamily: 'Montserrat-SemiBold',
                      // marginBottom: 2,
                      padding: 10
                    }}>
                    AGE
                  </Text>
                  <SelectDropdown
                    data={ageFilterArray}
                    defaultValue={ageFilter}
                    buttonStyle={{ ...styles.button, maxWidth: '100%' }}
                    buttonTextStyle={styles.buttonLabel}
                    renderDropdownIcon={isOpened => {
                      return (
                        <Icon
                          name={isOpened ? 'chevron-up' : 'chevron-down'}
                          color={'#444'}
                          size={12}
                        />
                      );
                    }}
                    dropdownIconPosition={'right'}
                    dropdownStyle={styles.dropdownStyle}
                    rowTextStyle={styles.rowStyle}
                    onSelect={selectedItem => {
                      setAgeFilter(selectedItem);
                    }}
                    buttonTextAfterSelection={selectedItem => {
                      return selectedItem;
                    }}
                    rowTextForSelection={item => {
                      return item;
                    }}
                  />
                </View>
              </View>
            </Animated.View>
          </View>
        </LinearGradient>

        {hideProfile && (
          <LinearGradient
            colors={['#FFFFFF70', '#FFFFFF']}
            style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: '100%',
              alignItems: 'center',
            }}>
            <View
              style={{
                position: 'absolute',
                bottom: 58,
                width: '100%',
              }}>
              <Text allowFontScaling={false}
                style={{
                  fontFamily: 'Montserrat-SemiBold',
                  fontSize: 24,
                  paddingHorizontal: 70,
                  textAlign: 'center',
                  marginBottom: 12,
                }}>
                Display profile to see leaderboards
              </Text>
              <TouchableOpacity
                onPress={() => setShowAboutLevels(true)}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#056135',
                  width: 307,
                  alignSelf: 'center',
                  paddingVertical: 18,
                  borderRadius: 25,
                }}
                activeOpacity={0.6}>
                <Text allowFontScaling={false} style={{ color: 'white', fontFamily: 'GoodTimesRg-Bold' }}>
                  Display
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        )}
        <ActionPopup
          isOpen={showAboutLevels}
          onClose={() => setShowAboutLevels(false)}
          text='Joining leaderboards will turn off "Hide Profile" in settings'
          cancelText='CANCEL'
          continueText='CONTINUE'
          onAccept={() => {
            toggleProfileVisiblity();
            setShowAboutLevels(false);
          }}
        />
      </View>
    </View>
  );
};

export default Leaderboard;

type PlayerRenderProps = {
  user: player;
};
const PlayerRender: FC<PlayerRenderProps> = ({ user }) => {
  const User = useUser();
  const bestTime = useMemo(
    () => getTimeFormat(user.bestTime, 0),
    [user.bestTime],
  );

  return (
    <>
      <View
        key={user.leaderBoardId}
        style={{
          ...styles.bodyLeaderboard,
          backgroundColor: user.isTop ? '#23744D' : '#FFFFFF',
          marginBottom: 0
        }}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 10,
            alignItems: 'center',
            backgroundColor: Boolean(User.user?.uid == user.userId) ? 'rgba(14, 96, 54, 1)' : '',
            borderRadius: 20
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: 30,
              justifyContent: 'center',
            }}>
            <Text allowFontScaling={false}
              style={{
                ...styles.userPosition,
                color: user.isTop || Boolean(User.user?.uid == user.userId) ? '#FFFFFF' : '#056135',
              }}>
              {user.position}
            </Text>
          </View>

          <FastImage
            style={{
              marginLeft: 7,
              width: 42,
              height: 42,
              borderRadius: 42,
            }}
            source={
              user && user.profileImage == null
                ? require('./../../assets/profile/placeholder.png')
                : { uri: user?.profileImage }
            }
          />

          <View
            style={{
              flexDirection: 'column',
              marginLeft: 12,
              flex: 1,
            }}>
            <Text allowFontScaling={false}
              style={{
                ...styles.userName,
                color: user.isTop || Boolean(User.user?.uid == user.userId) ? '#FFFFFF' : '#000000',
              }}
              numberOfLines={1}
              lineBreakMode="clip">
              @{user.userName}
            </Text>

            <View
              style={{
                marginTop: 4,
                height: 20,
                justifyContent: 'flex-end',
              }}>
              <Image
                //@ts-ignore
                source={getLevelImage(user?.klimbLevel)}
                style={{ width: 30, height: 30 }}
              />
            </View>
          </View>

          <View style={{}}>
            <Text allowFontScaling={false}
              style={{
                ...styles.userTime,
                color: user.isTop || Boolean(User.user?.uid == user.userId) ? '#FFFFFF' : '#056135',
                // width: 100,
                fontSize: 25,
                marginTop: 12,
                textAlign: 'right',
                padding: 10,
              }}>
              {bestTime}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};
type TopPlayerListProps = {
  players: player[];
  scrollOffsetY: Animated.Value<0>;
};
const TopPlayerList: FC<TopPlayerListProps> = ({ players, scrollOffsetY }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        marginTop: 4,
      }}>
      <TopPlayerRender
        player={players?.[1]}
        size={68}
        scrollOffsetY={scrollOffsetY}
      />
      <TopPlayerRender
        player={players?.[0]}
        size={94}
        scrollOffsetY={scrollOffsetY}
      />
      <TopPlayerRender
        player={players?.[2]}
        size={68}
        scrollOffsetY={scrollOffsetY}
      />
    </View>
  );
};
type TopPlayerRenderProps = {
  player?: player;
  size: number;
  scrollOffsetY: Animated.Value<0>;
};
const TopPlayerRender: FC<TopPlayerRenderProps> = ({
  player,
  size,
  scrollOffsetY,
}) => {
  const bestTime = useMemo(
    () => getTimeFormat(player?.bestTime || 0, 0),
    [player?.bestTime],
  );

  const headerScrollHeight2 = scrollOffsetY.interpolate({
    inputRange: [0, H_SCROLL_DISTANCE],
    outputRange: [size, 20],
    extrapolate: 'clamp',
  });

  return (
    <View style={{ alignItems: 'center', marginHorizontal: 4, flex: 1 }}>
      <Text allowFontScaling={false} style={styles.topTextPosition}>{player?.position}</Text>
      <View>
        <Animated.View
          style={{
            width: headerScrollHeight2,
            height: headerScrollHeight2,
            marginBottom: 10,
            borderRadius: headerScrollHeight2,
          }}>
          <FastImage
            source={
              player && player.profileImage == null
                ? require('./../../assets/profile/placeholder.png')
                : { uri: player?.profileImage }
            }
            style={{
              width: '100%',
              height: '100%',
              borderRadius: player?.profileImage ? size : 0,
            }}
          />
        </Animated.View>
        {Boolean(player?.level) && (
          <Image
            source={getLevelImage(player?.level)}
            style={{
              width: 25,
              height: 25,
              position: 'absolute',
              bottom: 5,
              right: 0,
              backgroundColor: '#FFFFFF',
              borderRadius: 25,
            }}
          />
        )}
      </View>

      <Text allowFontScaling={false} numberOfLines={1} style={styles.topTextDetails}>
        {player?.userName ? '@' : ''}
        {player?.userName}
      </Text>
      <Text allowFontScaling={false} style={{ ...styles.topTextDetails, marginBottom: 4 }}>
        {player?.bestTime ? bestTime : ''}
      </Text>
    </View>
  );
};
