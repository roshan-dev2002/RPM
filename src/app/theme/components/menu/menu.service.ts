import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Menu } from './menu.model';
import { verticalMenuItems, horizontalMenuItems, clientMenuItems,supplierMenuItems } from './menu';

@Injectable()
export class MenuService {

  constructor(private location:Location,
              private router:Router){ } 
    
  // public getVerticalMenuItems():Array<Menu> {
  //   return verticalMenuItems;
  // }

  public getVerticalMenuItems(): Array<Menu> {
    const userType = localStorage.getItem('userType');
    
    if (userType === 'supplier') {
      return supplierMenuItems;
    } else if (userType === 'client') {
      return clientMenuItems;
    }
    return verticalMenuItems;
  }

  public getHorizontalMenuItems(): Array<Menu> {
    const userType = localStorage.getItem('userType');
    
    if (userType === 'supplier') {
      return supplierMenuItems;
    } else if (userType === 'client') {
      return clientMenuItems;
    }
    return horizontalMenuItems;
  }
  public getClientMenuItems():Array<Menu> {
    return clientMenuItems;
  }

  public expandActiveSubMenu(menu:Array<Menu>){
      let url = this.location.path();
      let routerLink = url; // url.substring(1, url.length);
      let activeMenuItem = menu.filter(item => item.routerLink === routerLink);
      if(activeMenuItem[0]){
        let menuItem = activeMenuItem[0];
        while (menuItem.parentId != 0){  
          let parentMenuItem = menu.filter(item => item.id == menuItem.parentId)[0];
          menuItem = parentMenuItem;
          this.toggleMenuItem(menuItem.id);
        }
      }
  }

  public toggleMenuItem(menuId){
    let menuItem = document.getElementById('menu-item-'+menuId);
    let subMenu = document.getElementById('sub-menu-'+menuId);  
    if(subMenu){
      if(subMenu.classList.contains('show')){
        subMenu.classList.remove('show');
        menuItem.classList.remove('expanded');
      }
      else{
        subMenu.classList.add('show');
        menuItem.classList.add('expanded');
      }      
    }
  }

  public closeOtherSubMenus(menu:Array<Menu>, menuId){
    let currentMenuItem = menu.filter(item => item.id == menuId)[0]; 
    if(currentMenuItem.parentId == 0 && !currentMenuItem.target){
      menu.forEach(item => {
        if(item.id != menuId){
          let subMenu = document.getElementById('sub-menu-'+item.id);
          let menuItem = document.getElementById('menu-item-'+item.id);
          if(subMenu){
            if(subMenu.classList.contains('show')){
              subMenu.classList.remove('show');
              menuItem.classList.remove('expanded');
            }              
          } 
        }
      });
    }
  }

  // menu.service.ts
// horizontal-menu.component.ts

// Inside menu.service.ts

  isMenuItemActive(menu: any): boolean {
    const routerUrl = this.router.url.split('?')[0];
    const url = (routerUrl && routerUrl !== '/') ? routerUrl : location.hash.replace('#', '').split('?')[0];

    if (!menu) return false;

    // 1. EXPLICIT PROJECTS CHECK (Uses ID 2)
    if (menu.id === 2 && (
      url.includes('/app/testing/projects') || 
      url.includes('/projects/dashboard')
    )) {
      return true;
    }

    // 2. EXPLICIT STAGES CHECK (Uses ID 3)
    if (menu.id === 3 && url.includes('/app/testing/stages')) {
      return true;
    }

    // 3. EXPLICIT GATES CHECK (Uses ID 4)
    if (menu.id === 4 && url.includes('/app/testing/gates')) {
      return true;
    }

    // 4. EXPLICIT MASTER DATA CHECK (Uses ID 5)
    if (menu.id === 5 && url.includes('/app/testing/testing-masterData')) {
      return true;
    }

    // 4. Default check for standard menus (This will automatically handle Tasks, Issues, To Do)
    const baseMatch = menu.routerLink ? url.startsWith(menu.routerLink) : false;

    // 5. Existing custom module checks
    const result =
      baseMatch ||
      (menu.routerLink === '/app/prts-part' &&
        (url.includes('/app/prtsnavbar') || url.includes('/app/prtsonepager'))) ||
      (menu.routerLink === '/app/subjective-audits' &&
        url.includes('/app/checklistdoard')) ||
      (menu.routerLink === '/app/objective-audits' &&
        (url.includes('/app/setup/subjective/check') ||
         url.includes('/app/setup/subjective/overview') ||
         url.includes('/app/parameterboard')));

    return result;
  }

}
