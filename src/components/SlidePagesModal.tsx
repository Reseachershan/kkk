import React, {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const {width} = Dimensions.get('screen');
export type PageType = {
  id: number;
  headerRender: JSX.Element;
  paragraph: {
    id: number;
    text: string;
  }[];
  align?: 'left' | 'center';
}[];

type Props = {
  isOpen: boolean;
  onClose?: () => void;
  onSelected?: () => void;
  pages: PageType;
  startText?: string;
};

const SlidePagesModal: FC<Props & {isModal?: boolean}> = ({
  isOpen,
  onClose,
  onSelected,
  pages,
  startText,
  isModal,
}) => {
  const insets = useSafeAreaInsets();
  if (!isModal) {
    return (
      <View
        style={{
          justifyContent: 'flex-end',
          margin: 0,
          flex: 1,
          backgroundColor: '#056135',
          paddingTop: insets.top + 10,
        }}>
        <ListRender
          isOpen={isOpen}
          onClose={onClose}
          onSelected={onSelected}
          pages={pages}
          startText={startText}
        />
      </View>
    );
  }
  return (
    <Modal
      isVisible={isOpen}
      onSwipeComplete={onClose}
      style={{
        justifyContent: 'flex-end',
        margin: 0,
        flex: 1,
        backgroundColor: '#056135',
        paddingTop: insets.top + 10,
      }}>
      <ListRender
        isOpen={isOpen}
        onClose={onClose}
        onSelected={onSelected}
        pages={pages}
        startText={startText}
      />
    </Modal>
  );
};
const ListRender: FC<Props> = ({
  pages,
  startText,
  isOpen,
  onClose,
  onSelected,
}) => {
  const scrollRef = useRef<any>();
  const handleNextScreen = () => {
    if (index >= pages.length - 1) {
      onSelected?.();
    } else {
      setIndex(index + 1);
    }
  };
  const handleBackScreen = () => {
    if (index <= 0) {
      onClose?.();
    } else {
      setIndex(index - 1);
    }
  };
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    setIndex(0);
  }, [isOpen]);
  useEffect(() => {
    scrollRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  }, [index]);

  const onViewableItemsChanged = useCallback(({viewableItems}: any) => {
    setIndex(viewableItems?.[0]?.index);
  }, []);
  return (
    <>
      <FlatList
        ref={scrollRef}
        style={{flex: 1}}
        data={pages}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={width}
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        renderItem={({item}) => (
          <View
            style={{
              ...styles.container,
              ...(item.align === 'center'
                ? {alignContent: 'center', justifyContent: 'center'}
                : {}),
            }}>
            <View>
              {item.headerRender}
              <View style={{marginTop: 20.77}} />
              {item.paragraph.map(paragraph => (
                <Text
                allowFontScaling={false}
                  key={`paragraph-${paragraph.id}-${item.id}`}
                  style={{
                    ...styles.title,
                    marginHorizontal: 38,
                    marginTop: 15,
                    textAlign: 'center',
                  }}>
                  {paragraph.text}
                </Text>
              ))}
            </View>
          </View>
        )}
      />
      <View style={{justifyContent: 'flex-end', margin: 0}}>
        <View style={styles.footer}>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            {pages.map((_, i) => (
              <View
                key={`dot-${i}`}
                style={{
                  ...styles.paginationIcon,
                  opacity: index === i ? 1 : 0.2,
                  marginHorizontal: 6,
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => handleNextScreen()}
            style={{
              ...styles.button,
              marginTop: 25,
              marginBottom: 4,
              backgroundColor: '#056135',
            }}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={{...styles.buttonLabel, color: '#FFFFFF'}}>
              {index >= pages.length - 1 ? startText || 'FINISH' : 'NEXT'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleBackScreen()}
            style={{...styles.button, backgroundColor: '#FFFEFE'}}
            activeOpacity={0.6}>
            <Text allowFontScaling={false} style={{...styles.buttonLabel, color: '#00000061'}}>
              BACK
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};
export default SlidePagesModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
  },
  title: {
    fontFamily: 'Montserrat-SemiBold',
    fontWeight: '600',
    fontSize: 17,
    lineHeight: 24.38,
    color: '#FFFFFF',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 173,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#FFFEFE',
  },
  paginationIcon: {
    width: 8,
    height: 8,
    borderRadius: 10,
    backgroundColor: '#056135',
  },
  button: {
    justifyContent: 'center',
    width: 331,
    height: 56,
    borderRadius: 8,
  },
  buttonLabel: {
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
    fontWeight: '500',
    fontSize: 15,
    lineHeight: 18,
  },
});
