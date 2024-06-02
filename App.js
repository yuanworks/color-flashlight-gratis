import React, { useState } from 'react';
import { Button, Modal, Switch, StyleSheet, View, Text, Pressable } from 'react-native';

import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import * as Brightness from 'expo-brightness';

import ColorPicker, { Panel1, Swatches, Preview, OpacitySlider, HueSlider } from 'reanimated-color-picker';
import Slider from '@react-native-community/slider';

export default function App() {
  const [showModal, setShowModal] = useState(false);
  const [chosenColor, setChosenColor] = useState('#ffffff');

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(prevState => {
      const newState = !prevState;
      newState ?  activateKeepAwakeAsync() : deactivateKeepAwake();

      return newState;
    });
  }

  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({ hex }) => {
    // do something with the selected color.
    console.log(hex);
    setChosenColor(hex);
  };

  const changeOpacity = async () => {
    const { status } = await Brightness.requestPermissionsAsync();

    if (status === 'granted') {
      Brightness.setSystemBrightnessAsync(1);
    }
  }

  const setOpacity = test => {
    console.log('test:', test)
    // Brightness.setSystemBrightnessAsync(test);
    Brightness.setBrightnessAsync(test);
  }

  return (
      <View style={{...styles.container, backgroundColor: chosenColor }}>
        <Button title='Color Picker' onPress={() => setShowModal(true)} />

        <Switch
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text>Keep Screen On</Text>

        <Pressable onPress={changeOpacity}><Text>Opacity</Text></Pressable>

        <Slider
          style={{width: 200, height: 40}}
          minimumValue={0.1}
          maximumValue={1}
          minimumTrackTintColor="red"
          maximumTrackTintColor="#000000"
          // onSlidingComplete={setOpacity}
          onValueChange={setOpacity}
        />

        <Modal visible={showModal} animationType='slide'>
          <ColorPicker style={{ width: '70%' }} value='red' onComplete={onSelectColor}>
            <Preview />
            <Panel1 />
            <HueSlider />
            <OpacitySlider />
            <Swatches />
          </ColorPicker>
          <Button title='Ok' onPress={() => setShowModal(false)} />
        </Modal>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
