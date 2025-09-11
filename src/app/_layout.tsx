import React from 'react';
import { Stack } from "expo-router";
import Head from "expo-router/head";
import { useFonts } from 'expo-font';
// Custom Archivo Extra Condensed fonts loaded from assets
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  PTSans_400Regular,
  PTSans_700Bold,
} from '@expo-google-fonts/pt-sans';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    // Custom Archivo Extra Condensed fonts from assets
    'ArchivoExtraCondensed-Thin': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-Thin.ttf'),
    'ArchivoExtraCondensed-ThinItalic': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-ThinItalic.ttf'),
    'ArchivoExtraCondensed-Light': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-Light.ttf'),
    'ArchivoExtraCondensed-LightItalic': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-LightItalic.ttf'),
    'ArchivoExtraCondensed-Regular': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-Regular.ttf'),
    'ArchivoExtraCondensed-Italic': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-Italic.ttf'),
    'ArchivoExtraCondensed-Medium': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-Medium.ttf'),
    'ArchivoExtraCondensed-MediumItalic': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-MediumItalic.ttf'),
    'ArchivoExtraCondensed-SemiBold': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-SemiBold.ttf'),
    'ArchivoExtraCondensed-SemiBoldItalic': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-SemiBoldItalic.ttf'),
    'ArchivoExtraCondensed-Bold': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-Bold.ttf'),
    'ArchivoExtraCondensed-BoldItalic': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-BoldItalic.ttf'),
    'ArchivoExtraCondensed-ExtraBold': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-ExtraBold.ttf'),
    'ArchivoExtraCondensed-ExtraBoldItalic': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-ExtraBoldItalic.ttf'),
    'ArchivoExtraCondensed-Black': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-Black.ttf'),
    'ArchivoExtraCondensed-BlackItalic': require('../../assets/fonts/Archivo_ExtraCondensed/Archivo_ExtraCondensed-BlackItalic.ttf'),
    // Google Fonts - Poppins and PT Sans
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    PTSans_400Regular,
    PTSans_700Bold,
  });

  // Log font loading status
  React.useEffect(() => {
    console.log('🎨 Fonts loaded:', fontsLoaded);
    if (fontsLoaded) {
      console.log('✅ All fonts successfully loaded!');
      console.log('📝 Available fonts: Archivo Extra Condensed (custom, including italics), Poppins, PT Sans');
      console.log('🎯 Font hierarchy: Poppins (titles), PT Sans (body), Archivo Extra Condensed Italics (captions)');
    } else {
      console.log('⏳ Loading fonts...');
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    console.log('🔄 Waiting for fonts to load...');
    return null; // Or a loading screen
  }

  return (
    <>
      <Head>
        <title>Expo Router Layouts Demo</title>
        <meta name="description" content="Expo Router Layouts Demo" />
      </Head>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}
