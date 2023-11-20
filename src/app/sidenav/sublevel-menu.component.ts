import { Component, Input } from '@angular/core';
import { INavBarData } from './types';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { fadeInOut } from './helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sublevel-menu',
  template: `
    <ul
      *ngIf="collapsed && data.items && data.items.length > 0"
      class="sublevel-nav"
      [@submenu]="
        expanded
          ? {
              value: 'visible',
              params: {
                transitionpParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)',
                height: '*'
              }
            }
          : {
              value: 'hidden',
              params: {
                transitionpParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)',
                height: '0'
              }
            }
      "
    >
      <li *ngFor="let item of data.items" class="sublevel-nav-item">
        <a
          class="sublevel-nav-link"
          *ngIf="data.items && data.items.length > 0"
          (click)="handleClick(item)"
          [ngClass]="getActiveClass(data)"
        >
          <i class="sublevel-link-icon fa fa-circle"></i>
          <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">
            {{ item.label }}
          </span>
          <i
            class="menu-collapse-icon fa"
            *ngIf="item.items && collapsed"
            [ngClass]="!item.expanded ? 'fa-angle-right' : 'fa-angle-down'"
          ></i>
        </a>

        <a
          class="sublevel-nav-link"
          *ngIf="!item.items || (item.items && item.items.length === 0)"
          [routerLink]="item.routerLink"
          routerLinkActive="active-sublevel"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <i class="sublevel-link-icon fa fa-circle"></i>
          <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">
            {{ item.label }}
          </span>
        </a>

        <div *ngIf="item.items && item.items.length > 0">
          <app-sublevel-menu
            [data]="item"
            [collapsed]="collapsed"
            [multiple]="multiple"
            [expanded]="item.expanded"
          />
        </div>
      </li>
    </ul>
  `,
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({ height: '0', overflow: 'hidden' })),
      state('visible', style({ height: '*' })),
      transition('visible <=> hidden', [
        style({ overflow: 'hidden' }),
        animate('{{transitionpParams}}'),
      ]),
      transition('void => *', animate(0)),
    ]),
  ],
})
export class SublevelMenuComponent {
  @Input() data: INavBarData = {
    routerLink: '',
    icon: '',
    label: '',
    items: [],
  };

  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple = false;

  constructor(public router: Router) {}

  handleClick(item: any): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (item !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }

    item.expanded = !item.expanded;
  }

  getActiveClass(data: INavBarData): string {
    return data.expanded && this.router.url.includes(data.routerLink)
      ? 'active-sublevel'
      : '';
  }
}
