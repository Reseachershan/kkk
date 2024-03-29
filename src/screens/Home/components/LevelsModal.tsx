import { useNavigation } from '@react-navigation/native';
import React, { FC, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';

type Props = {
  isLevelsModalVisible: boolean;
  setIsLevelsModalVisible: any;
  close: any
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: 663,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingBottom: 20,
  },
  modalTitle: {
    marginTop: 18,
    fontFamily: 'GoodTimesRg-Bold',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 23.28,
    color: '#000000',
  },
  modalDescription: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 12,
    lineHeight: 14.5,
    color: '#000000',
    // textAlign: 'justify',
  },
  bodyLevels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 366,
    height: 75,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 10,
  },
  levelTitle: {
    fontFamily: 'Montserrat-BoldItalic',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 23.28,
    color: '#000000',
  },
  requiredKlimbs: {
    marginTop: 6,
    fontFamily: 'Montserrat-Bold',
    fontWeight: '600',
    fontSize: 11,
    lineHeight: 13,
    color: '#000000',
  },
  button: {
    marginBottom: 17,
    backgroundColor: '#8A2715',
    borderRadius: 100,
    height: 53,
    justifyContent:'center',
    alignItems:'center'
  },
  buttonLabel: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: '#FFFFFF',
  },
  aboutLevelsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
});

const LevelsModal: FC<Props> = ({
  isLevelsModalVisible = false,
  setIsLevelsModalVisible,
  close
}) => {
  const [showAboutLevels, setShowAboutLevels] = useState(false);
  const levelsArray = [
    {
      id: 0,
      title: 'Level 5: ULTRA',
      requiredKlimbs: '75+',
      img: require('../../../assets/home/ultra-icon.png'),
    },
    {
      id: 1,
      title: 'Level 4: ELITE',
      requiredKlimbs: '40-74',
      img: require('../../../assets/home/elite-icon.png'),
    },
    {
      id: 2,
      title: 'Level 3: MASTER',
      requiredKlimbs: '15-39',
      img: require('../../../assets/home/master-icon.png'),
    },
    {
      id: 3,
      title: 'Level 2: EXPLORER',
      requiredKlimbs: '5-14',
      img: require('../../../assets/home/explorer-icon.png'),
    },
    {
      id: 4,
      title: 'Level 1: KLIMBER',
      requiredKlimbs: '0-4',
      img: require('../../../assets/home/klimber-icon.png'),
    },
  ];


  return (
    <>
      <Modal
        isVisible={isLevelsModalVisible}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        onBackdropPress={() => setIsLevelsModalVisible(false)}
        onSwipeComplete={() => setIsLevelsModalVisible(false)}
        swipeDirection="down"
        style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View style={styles.container}>
          <Text allowFontScaling={false} style={styles.modalTitle}>KLIMB LEVELS</Text>

          <View
            style={{
              marginTop: 20,
              paddingHorizontal: 23,
              width: 363,
              height: 37,
            }}>
            <Text allowFontScaling={false} style={styles.modalDescription}>
              Your Klimb Level tracks how many times you reach the top of Koko
              Crater. This resets each year.
            </Text>
          </View>

          <View style={{ flex: 1, marginTop: 8, backgroundColor: '#FFFFFF' }}>
            <FlatList
              style={{
                flex: 1,
                alignContent: 'center',
                backgroundColor: '#FFFFFF',
              }}
              data={levelsArray}
              keyExtractor={level => `${level.id}`}
              ItemSeparatorComponent={() => <View style={{ height: 13 }} />}
              renderItem={({ item: level }) => (
                <View key={level.id} style={styles.bodyLevels}>
                  <View style={{ marginLeft: 19, flexDirection: 'column' }}>
                    <Text allowFontScaling={false} style={styles.levelTitle}>{level.title}</Text>

                    <Text allowFontScaling={false} style={styles.requiredKlimbs}>
                      {level.requiredKlimbs} KLIMBS/YEAR
                    </Text>
                  </View>

                  <Image
                    source={level.img}
                    style={{
                      width: 100,
                      height: 100,
                      marginRight: 10,
                      bottom: 10,
                    }}
                  />
                </View>
              )}
            />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => close()}
              style={{ ...styles.button, width: '40%', backgroundColor:'#D9D9D9' }}
              activeOpacity={0.6}>
              <Text allowFontScaling={false} style={{...styles.buttonLabel, color:'#000000'}}>BACK</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowAboutLevels(true)}
              style={{ ...styles.button, width: '40%', marginLeft: 10 }}
              activeOpacity={0.6}>
              <Text allowFontScaling={false} style={styles.buttonLabel}>LEARN MORE</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          isVisible={showAboutLevels}
          onBackdropPress={() => setShowAboutLevels(false)}
          onSwipeComplete={() => setShowAboutLevels(false)}
          swipeDirection={['up', 'down']}>
          <View style={[styles.aboutLevelsContainer]}>
            <View style={{ borderColor: '#000', borderWidth: 1.5, borderRadius: 10, padding: 20 }}>
              <Text allowFontScaling={false} style={[styles.modalTitle, { fontFamily: 'Montserrat-Bold', marginTop: 5, marginBottom: 15, alignSelf: 'center' }]}>KLIMB LEVELS ICONS</Text>

              <Text allowFontScaling={false} style={styles.modalDescription}>
                The Klimb Hawai team has chosen the culturally significant
                Ahu'ula, or Hawaiian feather cloak, to represent the 5 different
                Klimb Levels. The progression of capes represents the journey from
                a regional chief to the highest-ranking king - and symbolizes your
                journey with Koko Crater.
              </Text>
              <View style={{ marginTop: 20 }} />
              <Text allowFontScaling={false} style={styles.modalDescription}>
                The 'Ahu'ula was worn by the Ali'i, or chiefs, during the rule of
                the sovereign Hawaiian Kingdom. Highly-skilled native
                featherworkers detailed these capes, using as many as half a
                million feathers to create a single piece. After a battle between
                royalty, the victor would often take the opponent's feather cloak
                as a prize. And in special occasions, 'ahu'ulas were also gifted
                by generous Hawaiian chiefs as tokens of their friendship.
              </Text>
              <View style={{ marginTop: 20 }} />

              <Text allowFontScaling={false} style={styles.modalDescription}>
                The red feathers were used from the 'i'iwi bird, a forest species
                indigenous to Hawai'i that can still be seen on all Hawaiian
                islands today. The black and yellow feathers came from the mamo
                bird, a highly sought after bird with one single yellow feather.
                It was for this reason that chiefs of higher rank had more yellow
                on their cape. The featherworkers only took a few feathers at a
                time from each bird allowing the mamo species to continue to
                thrive, but with the arrival of colonizers and a growing urban
                population the mamo is now extinct.
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Image
                  source={require('../../../assets/home/klimber-icon.png')}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />
                <Image
                  source={require('../../../assets/home/explorer-icon.png')}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />
                <Image
                  source={require('../../../assets/home/master-icon.png')}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />
                <Image
                  source={require('../../../assets/home/elite-icon.png')}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />
                <Image
                  source={require('../../../assets/home/ultra-icon.png')}
                  style={{
                    width: 50,
                    height: 50,
                  }}
                />

              </View>
            </View>
          </View>
        </Modal>
      </Modal>
    </>
  );
};

export default LevelsModal;
