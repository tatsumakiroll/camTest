import { StatusBar } from "expo-status-bar";
import { Button, TouchableOpacity, StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import { CameraView, useCameraPermissions, CameraType } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import React, { useState, useRef, useEffect } from "react";

export default function App() {

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null)

  const [photo, setPhoto] = useState<ImageData | null>();

  useEffect(() => {
    console.log(photo);
    
  }, [photo])

  if (!permission) {
    // Camera permissions are still loading.
    return <View><Text>!permission</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

if(photo){
  return (
    <SafeAreaView style={styles.container}>
    <Image source={{ uri: photo.uri }} />
    </SafeAreaView>
  )
}

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  interface ImageData {
    height: number;
    uri: string;
    width: number;
  };

  return (
    <View style={styles.container}>
    <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() =>{        
            if (cameraRef) {
              cameraRef.current.takePictureAsync().then((data: ImageData) => {
                setPhoto(data)

              }).catch((err: ImageData) => {
              console.log(err, 'Error');             
            })
            
          }}}>
        <Text style={styles.text}>Take a Pic</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip Camera</Text>
        </TouchableOpacity>
      </View>
    </CameraView>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
