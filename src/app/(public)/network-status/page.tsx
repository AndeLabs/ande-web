import { Metadata } from 'next';
import { NetworkStatusPage } from './network-status-client';

export const metadata: Metadata = {
  title: 'Network Status',
  description: 'Real-time status and health monitoring for ANDE Network',
};

export default function Page() {
  return <NetworkStatusPage />;
}
