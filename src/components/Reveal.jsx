import { useInView } from '../hooks/useInView';

// Thin wrapper: fades/slides a section into place the first time it enters
// the viewport (see .reveal / .reveal.is-visible in index.css). `as` lets
// callers keep semantic section wrappers instead of an extra generic div.
export const Reveal = ({ children, as: Tag = 'div', className = '', ...rest }) => {
  const [ref, isVisible] = useInView();
  return (
    <Tag ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  );
};
