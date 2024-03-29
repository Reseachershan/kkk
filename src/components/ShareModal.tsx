import React, {FC} from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import {Divider} from 'react-native-paper';

type Props = {
  isShareModalVisible: boolean;
  setIsShareModalVisible: any;
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: 360,
    height: 678,
    borderRadius: 20,
    backgroundColor: '#FAFAFAED',
  },
  search: {
    marginHorizontal: 20,
    marginTop: 20,
    height: 36,
    borderRadius: 30,
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
  },
  divider: {
    height: 0.5,
    backgroundColor: 'rgba(60, 60, 67, 0.2)',
    opacity: 0.5,
  },
  title: {
    marginTop: 15.5,
    marginLeft: 20,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 13,
    color: '#000000',
  },
  itemsTitle: {
    marginTop: 4,
    fontWeight: '400',
    fontSize: 11,
    lineHeight: 13,
    color: '#000000',
  },
  optionsTitle: {
    marginLeft: 16,
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 22,
    color: '#000000',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 137,
    height: 40,
    borderRadius: 100,
  },
  buttonLabel: {
    fontWeight: '500',
    fontSize: 17,
    lineHeight: 22,
  },
});

const appsList = [
  {
    id: 1,
    name: 'Facebook',
    icon: require('../assets/share/facebook-icon.png'),
  },
  {
    id: 2,
    name: 'WhatsApp',
    icon: require('../assets/share/whatsapp-icon.png'),
  },
  {
    id: 3,
    name: 'Telegram',
    icon: require('../assets/share/telegram-icon.png'),
  },
  {
    id: 4,
    name: 'Twitter',
    icon: require('../assets/share/twitter-icon.png'),
  },
];

const peopleList = [
  {
    id: 1,
    name: 'Ethan',
    icon: require('../assets/share/user-1.png'),
  },
  {
    id: 2,
    name: 'Liam',
    icon: require('../assets/share/user-2.png'),
  },
  {
    id: 3,
    name: 'Agata',
    icon: require('../assets/share/user-3.png'),
  },
  {
    id: 4,
    name: 'Olivia',
    icon: require('../assets/share/user-4.png'),
  },
];

const ShareModal: FC<Props> = ({
  isShareModalVisible = false,
  setIsShareModalVisible,
}) => {
  return (
    <>
      <Modal
        isVisible={isShareModalVisible}
        backdropOpacity={0}
        style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.search} />

          <Divider style={{...styles.divider, marginTop: 20}} />

          <Text allowFontScaling={false} style={styles.title}>Apps</Text>

          <View style={{height: 77, marginTop: 14}}>
            <FlatList
              style={{
                marginLeft: 20,
                marginRight: 20,
              }}
              horizontal={true}
              data={appsList}
              keyExtractor={app => `${app.id}`}
              renderItem={({item: app}) => (
                <View key={app.id} style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => console.log(app.name)}
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: app.id > 1 ? 30 : 0,
                    }}
                    activeOpacity={0.6}>
                    <Image source={app.icon} style={{}} />

                    <Text allowFontScaling={false} style={styles.itemsTitle}>{app.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <Divider style={{...styles.divider, marginTop: 18}} />

          <Text allowFontScaling={false} style={styles.title}>People</Text>

          <View style={{marginTop: 12, height: 92}}>
            <FlatList
              style={{
                marginLeft: 12,
                marginRight: 12,
              }}
              horizontal={true}
              data={peopleList}
              keyExtractor={user => `${user.id}`}
              renderItem={({item: user}) => (
                <View key={user.id} style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => console.log(user.name)}
                    style={{
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: user.id > 1 ? 13 : 0,
                    }}
                    activeOpacity={0.6}>
                    <Image source={user.icon} />

                    <Text allowFontScaling={false} style={styles.itemsTitle}>{user.name}</Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>

          <Divider style={{...styles.divider, marginTop: 18}} />

          <TouchableOpacity
            onPress={() => console.log('Copy Link')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginHorizontal: 20,
              marginTop: 15.5,
              height: 48,
              borderRadius: 30,
              backgroundColor: '#FFFFFF',
            }}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={styles.optionsTitle}>Copy Link</Text>

            <Image
              source={require('../assets/share/copy-link-icon.png')}
              style={{marginRight: 14}}
            />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'column',
              marginHorizontal: 20,
              marginTop: 16,
              height: 144,
              borderRadius: 30,
              backgroundColor: '#FFFFFF',
            }}>
            <TouchableOpacity
              onPress={() => console.log('Add to Reading List')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 48,
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(60, 60, 67, 0.06)',
              }}
              activeOpacity={0.6}>
              <Text allowFontScaling={false} style={styles.optionsTitle}>Add To Reading List</Text>

              <Image
                source={require('../assets/share/reading-list-icon.png')}
                style={{marginRight: 9}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => console.log('Add Bookmark')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 48,
                borderBottomWidth: 0.5,
                borderBottomColor: 'rgba(60, 60, 67, 0.06)',
              }}
              activeOpacity={0.6}>
              <Text allowFontScaling={false} style={styles.optionsTitle}>Add Bookmark</Text>

              <Image
                source={require('../assets/share/bookmark-icon.png')}
                style={{marginRight: 12}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => console.log('Add to Favorites')}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: 48,
              }}
              activeOpacity={0.6}>
              <Text allowFontScaling={false} style={styles.optionsTitle}>Add to Favorites</Text>

              <Image
                source={require('../assets/share/favorites-icon.png')}
                style={{marginRight: 12}}
              />
            </TouchableOpacity>
          </View>

          <Divider style={{...styles.divider, marginTop: 16}} />

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginHorizontal: 20,
              marginTop: 19.5,
            }}>
            <TouchableOpacity
              onPress={() => setIsShareModalVisible(false)}
              style={{...styles.button, backgroundColor: '#F2F2F7'}}
              activeOpacity={0.6}>
              <Text allowFontScaling={false} style={{...styles.buttonLabel, color: '#000000'}}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => console.log('Send')}
              style={{
                ...styles.button,
                marginLeft: 21,
                backgroundColor: '#056135',
              }}
              activeOpacity={0.6}>
              <Text allowFontScaling={false} style={{...styles.buttonLabel, color: '#FFFFFF'}}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ShareModal;
