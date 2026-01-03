import { render } from '@testing-library/react-native';
import { HelloWave } from '@/components/hello-wave';

describe('HelloWave', () => {
  it('renders the waving emoji', () => {
    const { getByText } = render(<HelloWave />);

    expect(getByText('👋')).toBeTruthy();
  });

  it('applies the animated text style', () => {
    const { getByText } = render(<HelloWave />);
    const node = getByText('👋');

    const style = Array.isArray(node.props.style)
      ? Object.assign({}, ...node.props.style)
      : node.props.style;

    expect(style.fontSize).toBe(28);
    expect(style.animationIterationCount).toBe(4);
    expect(style.animationDuration).toBe('300ms');
  });
});
