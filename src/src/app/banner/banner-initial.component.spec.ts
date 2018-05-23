import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerComponent } from './banner-initial.component';
/*
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
*/
describe('BannerComponent (CLI 生成)', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('可以创建', () => {
    expect(component).toBeDefined();
  });
});

describe('BannerComponent (最小)', () => {
  it('可以创建', () => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent]
    });
    const fixture = TestBed.createComponent(BannerComponent);
    const component = fixture.componentInstance;
    expect(component).toBeDefined();
  });
});

describe('BannerComponent (with beforeEach)', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BannerComponent]
    });
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
  });

  it('可以创建', () => {
    expect(component).toBeDefined();
  });

  it('应该包含 "banner works!"', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    expect(bannerElement.textContent).toContain('banner works!');
  });

  it('"banner works!"应该在<p>标签里', () => {
    const bannerElement: HTMLElement = fixture.nativeElement;
    const p = bannerElement.querySelector('p');
    expect(p.textContent).toEqual('banner works!');
  });


  it('通过 fixture.debugElement.nativeElement 应该找到 <p> 标签', () => {
    const bannerDe: DebugElement = fixture.debugElement;
    const bannerEl: HTMLElement = bannerDe.nativeElement;
    const p = bannerEl.querySelector('p');
    expect(p.textContent).toEqual('banner works!');
  });

  it('通过 fixture.debugElement.query(By.css) 应该找到 <p> 标签', () => {
    const bannerDe: DebugElement = fixture.debugElement;
    const paragraphDe = bannerDe.query(By.css('p'));
    const p: HTMLElement = paragraphDe.nativeElement;
    expect(p.textContent).toEqual('banner works!');
  });
});


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/