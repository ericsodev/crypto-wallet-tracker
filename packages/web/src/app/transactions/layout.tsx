import SidebarLayout from '@/components/app-sidebar/sidebar-layout';
import { PropsWithChildren } from 'react';

export default function Layout({ children }: PropsWithChildren) {
  return <SidebarLayout>{children}</SidebarLayout>;
}
