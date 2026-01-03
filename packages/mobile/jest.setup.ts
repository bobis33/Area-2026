import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-worklets', () => ({
  init: jest.fn(),
  runOnJS: (fn: any) => fn,
  runOnUI: (fn: any) => fn,
  makeShareable: (v: any) => v,
  makeShareableCloneRecursive: (v: any) => v,
  shareableMappingCache: new Map(),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = {
    Text: 'Text',
    View: 'View',
    ScrollView: 'ScrollView',
    FlatList: 'FlatList',
    SectionList: 'SectionList',

    useSharedValue: (value: any) => ({ value }),
    useAnimatedStyle: (fn: any) => fn(),
    withTiming: (value: any) => value,
    withSpring: (value: any) => value,
    withDecay: (value: any) => value,
    runOnJS: (fn: any) => fn,
    runOnUI: (fn: any) => fn,
    cancelAnimation: jest.fn(),
    interpolate: (v: any) => v,
    Extrapolate: { CLAMP: 'CLAMP' },
    Easing: { linear: (v: number) => v },

    default: {},
  };

  Reanimated.default.Text = Reanimated.Text;
  Reanimated.default.View = Reanimated.View;

  return Reanimated;
});
