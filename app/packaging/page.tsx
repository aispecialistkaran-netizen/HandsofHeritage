import type { Metadata } from 'next';
import PackagingContent from './PackagingContent';

export const metadata: Metadata = {
  title: 'Packaging | Hands of Heritage',
  description: 'Gift-ready packaging options for handcrafted wedding favours and corporate gifts.',
};

export default function PackagingPage() {
  return <PackagingContent />;
}
