import SidebarLayout from '@/components/app-sidebar/sidebar-layout';
import { PropsWithChildren } from 'react';
import WagmiContextProvider from '../context/wagmi';

export default function Layout({ children }: PropsWithChildren) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
