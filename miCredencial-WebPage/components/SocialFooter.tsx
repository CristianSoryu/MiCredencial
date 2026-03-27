import { Image, Linking, TouchableOpacity, View } from "react-native";

const INSTAGRAM_URL = "https://www.instagram.com/unilibrecucuta1/";
const FACEBOOK_URL = "https://www.facebook.com/UniLibreCucuta1";
const WEB_URL = "https://www.unilibrecucuta.edu.co";

// Íconos libres de uso (ejemplos de iconos planos)
const INSTAGRAM_ICON =
  "https://cdn-icons-png.flaticon.com/512/2111/2111463.png";
const FACEBOOK_ICON = "https://cdn-icons-png.flaticon.com/512/733/733547.png";
const WEB_ICON = "https://cdn-icons-png.flaticon.com/512/841/841364.png";

function openUrl(url: string) {
  Linking.openURL(url);
}

export function SocialFooter() {
  return (
    <View
      style={{
        marginTop: 24,
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          columnGap: 24,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity onPress={() => openUrl(INSTAGRAM_URL)}>
          <Image
            source={{ uri: INSTAGRAM_ICON }}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openUrl(FACEBOOK_URL)}>
          <Image
            source={{ uri: FACEBOOK_ICON }}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => openUrl(WEB_URL)}>
          <Image
            source={{ uri: WEB_ICON }}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
