import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { cold, getTestScheduler } from 'jasmine-marbles';

import { TwainService } from './twain.service';
import { TwainComponent } from './twain.component';


describe('TwainComponent (marbles)', () => {
  let component: TwainComponent;
  let fixture: ComponentFixture<TwainComponent>;
  let getQuoteSpy: jasmine.Spy;
  let quoteEl: HTMLElement;
  let testQuote: string;

  // Helper function to get the error message element value
  // An *ngIf keeps it out of the DOM until there is an error
  const errorMessage = () => {
    const el = fixture.nativeElement.querySelector('.error');
    return el ? el.textContent : null;
  };

  beforeEach(() => {
    // Create a fake TwainService object with a `getQuote()` spy
    const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);
    getQuoteSpy = twainService.getQuote;

    TestBed.configureTestingModule({
      declarations: [TwainComponent],
      providers: [
        { provide: TwainService, useValue: twainService }
      ]
    });

    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;
    quoteEl = fixture.nativeElement.querySelector('.twain');
    testQuote = 'Test Quote';
  });

  // A synchronous test that simulates async behavior
  it('调用 getQuote (marbles) 后应该显示引述', () => {
    // observable test quote value and complete(), after delay
    // 这个测试定义了一个冷的可观察对象，它等待三帧 (---)，然后发出一个值（x），然后结束（|）。 
    // 在第二个参数中，把值标记（x）换成了实际发出的值（testQuote）。
    const q$ = cold('---x|', { x: testQuote });
    getQuoteSpy.and.returnValue(q$);

    fixture.detectChanges(); // ngOnInit()
    expect(quoteEl.textContent).toBe('...', 'should show placeholder');

    getTestScheduler().flush(); // flush the observables

    fixture.detectChanges(); // update view

    expect(quoteEl.textContent).toBe(testQuote, 'should show quote');
    expect(errorMessage()).toBeNull('should not show error');
  });

  // Still need fakeAsync() because of component's setTimeout()
  it('当调用 TwainService 失败后应该显示错误', fakeAsync(() => {
    // observable error after delay
    // 它是一个冷的可观察对象，它等待三帧，然后发出一个错误。 
    // 井号（#）标记出了发出错误的时间点，这个错误是在第三个参数中指定的。 
    // 第二个参数是空的，因为这个可观察对象永远不会发出正常值。
    const q$ = cold('---#|', null, new Error('TwainService test failure'));
    getQuoteSpy.and.returnValue(q$);

    fixture.detectChanges(); // ngOnInit()
    expect(quoteEl.textContent).toBe('...', 'should show placeholder');

    getTestScheduler().flush(); // flush the observables
    tick();                     // component shows error after a setTimeout()
    fixture.detectChanges();    // update error message

    expect(errorMessage()).toMatch(/test failure/, 'should display error');
    expect(quoteEl.textContent).toBe('...', 'should show placeholder');
  }));
});


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/