import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { BannerComponent } from './banner.component';

describe('BannerComponent (inline template)', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let h1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
    });
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance; // BannerComponent test instance
    h1 = fixture.nativeElement.querySelector('h1');
  });

  it('调用 createComponent() 后 DOM 中title为空', () => {
    expect(h1.textContent).toEqual('');
  });

  it('调用 detectChanges() 后应该显示原始的 title', () => {
    // 绑定是在 Angular 执行变更检测时才发生的
    // 调用 fixture.detectChanges() 来要求 TestBed 执行数据绑定。
    fixture.detectChanges();
    expect(h1.textContent).toContain(component.title);
  });

  it('应该显示测试 title', () => {
    component.title = '测试标题';
    fixture.detectChanges();
    expect(h1.textContent).toContain('测试标题');
  });
});


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/