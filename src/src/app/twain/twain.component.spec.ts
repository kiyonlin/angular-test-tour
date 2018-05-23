import { async, fakeAsync, ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { asyncData, asyncError } from '../../testing';

import { of, throwError } from 'rxjs';

import { last } from 'rxjs/operators';

import { TwainService } from './twain.service';
import { TwainComponent } from './twain.component';

describe('TwainComponent', () => {
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
    testQuote = 'Test Quote';

    // Create a fake TwainService object with a `getQuote()` spy
    const twainService = jasmine.createSpyObj('TwainService', ['getQuote']);
    // Make the spy return a synchronous Observable with the test data
    getQuoteSpy = twainService.getQuote.and.returnValue(of(testQuote));

    TestBed.configureTestingModule({
      declarations: [TwainComponent],
      providers: [
        { provide: TwainService, useValue: twainService }
      ]
    });

    fixture = TestBed.createComponent(TwainComponent);
    component = fixture.componentInstance;
    quoteEl = fixture.nativeElement.querySelector('.twain');
  });

  describe('使用同步观察者测试', () => {
    it('调用 OnInit 之前不应该显示引述', () => {
      expect(quoteEl.textContent).toBe('', '什么都不显示');
      expect(errorMessage()).toBeNull('不应该显示错误元素');
      expect(getQuoteSpy.calls.any()).toBe(false, 'getQuote 还没有被调用');
    });

    // The quote would not be immediately available if the service were truly async.
    it('组件初始化后应该显示引述', () => {
      fixture.detectChanges(); // onInit()

      // sync spy result shows testQuote immediately after init
      expect(quoteEl.textContent).toBe(testQuote);
      expect(getQuoteSpy.calls.any()).toBe(true, '调用 getQuote');
    });


    // The error would not be immediately available if the service were truly async.
    // Use `fakeAsync` because the component error calls `setTimeout`
    it('当调用 TwainService 失败后应该显示错误', fakeAsync(() => {
      // tell spy to return an error observable
      getQuoteSpy.and.returnValue(
        throwError('TwainService 测试失败'));

      fixture.detectChanges(); // onInit()
      // sync spy errors immediately after init

      // 向前推动（虚拟）时钟。
      tick(); // flush the component's setTimeout()

      fixture.detectChanges(); // update errorMessage within setTimeout()

      expect(errorMessage()).toMatch(/测试失败/, '应该显示错误');
      expect(quoteEl.textContent).toBe('...', '应该显示占位符');
    }));
  });

  describe('使用异步观察者测试', () => {
    beforeEach(() => {
      // Simulate delayed observable values with the `asyncData()` helper
      getQuoteSpy.and.returnValue(asyncData(testQuote));
    });

    it('调用 OnInit 之前不应该显示引述', () => {
      expect(quoteEl.textContent).toBe('', '什么都不显示');
      expect(errorMessage()).toBeNull('不应该显示错误元素');
      expect(getQuoteSpy.calls.any()).toBe(false, 'getQuote 没有被调用');
    });

    it('组件初始化后仍然不显示引述', () => {
      fixture.detectChanges();
      // getQuote service is async => still has not returned with quote
      // so should show the start value, '...'
      expect(quoteEl.textContent).toBe('...', '应该显示占位符');
      expect(errorMessage()).toBeNull('不应该显示错误');
      expect(getQuoteSpy.calls.any()).toBe(true, '调用getQuote');
    });

    it('调用 getQuote (fakeAsync) 后应该显示引述', fakeAsync(() => {
      fixture.detectChanges(); // ngOnInit()
      expect(quoteEl.textContent).toBe('...', '显示占位符');

      tick(); // flush the observable to get the quote
      fixture.detectChanges(); // update view

      expect(quoteEl.textContent).toBe(testQuote, '应该显示引述');
      expect(errorMessage()).toBeNull('不应该显示错误');
    }));

    it('调用 getQuote (async) 后应该显示引述', async(() => {
      fixture.detectChanges(); // ngOnInit()
      expect(quoteEl.textContent).toBe('...', '显示占位符');

      // fixture.whenStable() 返回一个承诺，这个承诺会在 JavaScript 引擎的任务队列变为空白时被解析。
      fixture.whenStable().then(() => { // wait for async getQuote
        fixture.detectChanges();        // update view with quote
        expect(quoteEl.textContent).toBe(testQuote, '应该显示引述');
        expect(errorMessage()).toBeNull('不应该显示错误');
      });
    }));


    it('应该显示最后的引述 (quote done)', (done: DoneFn) => {
      fixture.detectChanges();

      // RxJS 的 last() 操作符会在结束之前发出这个可观察对象的最后一个值，也就是那条测试引文。
      component.quote.pipe(last()).subscribe(() => {
        fixture.detectChanges(); // update view with quote
        expect(quoteEl.textContent).toBe(testQuote, '应该显示引述');
        expect(errorMessage()).toBeNull('不应该显示错误');
        done();
      });
    });

    it('调用 getQuote (spy done) 后应该显示引述', (done: DoneFn) => {
      fixture.detectChanges();

      // the spy's most recent call returns the observable with the test quote
      getQuoteSpy.calls.mostRecent().returnValue.subscribe(() => {
        fixture.detectChanges(); // update view with quote
        expect(quoteEl.textContent).toBe(testQuote, '应该显示引述');
        expect(errorMessage()).toBeNull('不应该显示错误');
        done();
      });
    });

    it('当调用 TwainService 失败后应该显示错误', fakeAsync(() => {
      // tell spy to return an async error observable
      getQuoteSpy.and.returnValue(asyncError<string>('TwainService test failure'));

      fixture.detectChanges();
      tick();                  // component shows error after a setTimeout()
      fixture.detectChanges(); // update error message

      expect(errorMessage()).toMatch(/test failure/, '应该显示错误');
      expect(quoteEl.textContent).toBe('...', '应该显示占位符');
    }));

    it('调用 getQuote (async) 失败后应该显示错误', async(() => {
      // tell spy to return an async error observable
      getQuoteSpy.and.returnValue(asyncError<string>('TwainService test failure'));

      fixture.detectChanges(); // ngOnInit()

      // fixture.whenStable() 返回一个promise，这个承诺会在 JavaScript 引擎的任务队列变为空白时被解析。
      fixture.whenStable().catch(() => { // wait for async getQuote
        fixture.detectChanges();        // update view with quote
        expect(errorMessage()).toMatch(/test failure/, '应该显示错误');
        expect(quoteEl.textContent).toBe('...', '应该显示占位符');
      });
    }));

    it('失败后应该显示错误 (last() toPromise)', () => {
      // tell spy to return an async error observable
      getQuoteSpy.and.returnValue(asyncError<string>('TwainService test failure'));

      fixture.detectChanges();

      // RxJS 的 last() 操作符会在结束之前发出这个可观察对象的最后一个值，也就是那条测试引文。
      component.quote.pipe(last()).toPromise().catch(() => {

        fixture.detectChanges(); // update view with quote

        expect(errorMessage()).toMatch(/test failure/, '应该显示错误');
        expect(quoteEl.textContent).toBe('...', '应该显示占位符');
      });
    });

  });
});


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/