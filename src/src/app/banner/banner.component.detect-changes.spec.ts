import { async } from '@angular/core/testing';
import { ComponentFixtureAutoDetect } from '@angular/core/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerComponent } from './banner.component';

describe('BannerComponent (自动检测变化)', () => {
  let comp: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let h1: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent],
      providers: [
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ]
    });
    fixture = TestBed.createComponent(BannerComponent);
    comp = fixture.componentInstance;
    h1 = fixture.nativeElement.querySelector('h1');
  });

  it('应该显示原始标题', () => {
    // Hooray! No `fixture.detectChanges()` needed
    expect(h1.textContent).toContain(comp.title);
  });

  it('comp.title 修改后仍然应该看见原始标题', () => {
    const oldTitle = comp.title;
    comp.title = 'Test Title';
    // Displayed title is old because Angular didn't hear the change :(
    expect(h1.textContent).toContain(oldTitle);
  });

  it('调用detectChanges后应该展示更新后的标题', () => {
    comp.title = 'Test Title';
    fixture.detectChanges(); // detect changes explicitly
    expect(h1.textContent).toContain(comp.title);
  });
});


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/