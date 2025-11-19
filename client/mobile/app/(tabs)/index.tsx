import { StyleSheet } from 'react-native';
import { Button } from '../shared/ui/Button';

export default function HomeScreen() {
  return (
      <Button
          label="Click me Mobile"
          onPress={() => alert('Button pressed on Mobile!')}
      />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
