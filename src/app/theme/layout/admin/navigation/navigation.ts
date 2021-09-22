import { Injectable } from '@angular/core';

export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  function?: any;
  badge?: {
    title?: string;
    type?: string;
  };
  children?: Navigation[];
}

export interface Navigation extends NavigationItem {
  children?: NavigationItem[];
}

const NavigationItems = [
  {
    id: 'chart-maps',
    title: 'Utilidades Diaco',
    type: 'group',
    icon: 'feather icon-pie-chart',
    children: [
      {
        id: 'charts',
        title: 'Reportería',
        type: 'item',
        url: '/reporteria/quejas',
        classes: 'nav-item',
        icon: 'feather icon-pie-chart'
      },
      {
        id: 'bootstrap',
        title: 'Quejas',
        type: 'item',
        url: '/quejas/listado',
        classes: 'nav-item',
        icon: 'feather icon-server'
      },
    ]
  }
];

@Injectable()
export class NavigationItem {
  public get() {
    return NavigationItems;
  }
}
