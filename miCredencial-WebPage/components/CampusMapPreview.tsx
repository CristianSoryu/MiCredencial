// CampusMapPreview.tsx
import { useCallback } from "react";
import { Linking, Platform, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

const UNILIBRE_CUCUTA_LAT = 7.8962;
const UNILIBRE_CUCUTA_LNG = -72.5075; // aprox. campus Cúcuta [web:60]

export function CampusMapPreview() {
  const handleOpenMapApp = useCallback(() => {
    const url =
      Platform.OS === "ios"
        ? `http://maps.apple.com/?ll=${UNILIBRE_CUCUTA_LAT},${UNILIBRE_CUCUTA_LNG}`
        : `https://maps.app.goo.gl/ErZ1uv94B67tCs937`; // tu link corto [web:72]
    Linking.openURL(url);
  }, []);

  return (
    <View
      style={{
        marginTop: 16,
        borderRadius: 16,
        overflow: "hidden",
        height: 200,
      }}
    >
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: UNILIBRE_CUCUTA_LAT,
          longitude: UNILIBRE_CUCUTA_LNG,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        onPress={handleOpenMapApp} // tocando el mapa abre la app
      >
        <Marker
          coordinate={{
            latitude: UNILIBRE_CUCUTA_LAT,
            longitude: UNILIBRE_CUCUTA_LNG,
          }}
          title="Universidad Libre Seccional Cúcuta"
          description="Campus Cúcuta"
        />
      </MapView>
    </View>
  );
}
