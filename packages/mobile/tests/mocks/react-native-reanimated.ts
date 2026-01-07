const Reanimated = {
  View: 'View',
  Text: 'Text',
  ScrollView: 'ScrollView',

  useSharedValue: (v: any) => ({ value: v }),
  useAnimatedStyle: (fn: any) => fn(),

  withTiming: (v: any) => v,
  withSpring: (v: any) => v,
  withDecay: (v: any) => v,

  runOnJS: (fn: any) => fn,
  runOnUI: (fn: any) => fn,

  cancelAnimation: jest.fn(),
  createAnimatedComponent: (c: any) => c,

  Extrapolate: { CLAMP: 'CLAMP' },
  Easing: { linear: (v: number) => v },

  default: {},
};

export default Reanimated;
