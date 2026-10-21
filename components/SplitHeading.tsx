import { splitHeadingText } from '@/lib/heading-colors';

/** Small accessible text-only fragment; the parent keeps its original H1-H6. */
export function SplitHeading({ text }: { text: string }) {
  const { first, second, separator } = splitHeadingText(text);
  if (!second) return <>{first}</>;
  return <>
    <span className="ftt-heading-base">{first}</span>
    {separator}
    <span className="ftt-heading-accent">{second}</span>
  </>;
}
