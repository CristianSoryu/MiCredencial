import { Ionicons } from '@expo/vector-icons';

export const icon = (routeName: string, props: { color: string }) => {
  switch (routeName) {
    case 'index':
      return <Ionicons name="home" size={24} color={props.color} />;
    case 'bienestar':
      return <Ionicons name="heart" size={24} color={props.color} />;
    case 'herramientas':
      return <Ionicons name="briefcase" size={24} color={props.color} />;
    case 'about':
      return (
        <Ionicons name="information-circle" size={24} color={props.color} />
      );
    default:
      return <Ionicons name="home" size={24} color={props.color} />;
  }
};
