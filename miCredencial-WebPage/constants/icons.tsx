import { Ionicons } from "@expo/vector-icons";

export const icon = (routeName: string, color: any) => {
  switch (routeName) {
    case "index":
      return <Ionicons name="home" size={24} color={color} />;
    case "prestamos":
      return <Ionicons name="book" size={24} color={color} />;
    case "about":
      return <Ionicons name="information-circle" size={24} color={color} />;
    default:
      return <Ionicons name="home" size={24} color={color} />;
  }
};
