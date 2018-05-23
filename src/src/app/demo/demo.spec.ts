import {
  LightswitchComponent,
  MasterService,
  ValueService,
  ReversePipe
} from './demo';

///////// Fakes /////////
export class FakeValueService extends ValueService {
  value = 'faked service value';
}
////////////////////////
describe('demo (no TestBed):', () => {

  // Straight Jasmine testing without Angular's testing support
  describe('ValueService', () => {
    let service: ValueService;
    beforeEach(() => { service = new ValueService(); });

    it('#getValue 应该返回 "real value"', () => {
      expect(service.getValue()).toBe('real value');
    });

    it('#getObservableValue 应该返回可观察的值',
      (done: DoneFn) => {
        service.getObservableValue().subscribe(value => {
          expect(value).toBe('observable value');
          done();
        })
      }
    );

    it('#getPromiseValue 应该从promise返回一个值',
      (done: DoneFn) => {
        service.getPromiseValue().then(value => {
          expect(value).toBe('promise value');
          done();
        })
      });
  });

  // MasterService requires injection of a ValueService
  describe('MasterService 不适用 Angular 测试框架', () => {
    let masterService: MasterService;

    it('#getValue should return real value from the real service', () => {
      masterService = new MasterService(new ValueService());
      expect(masterService.getValue()).toBe('real value');
    });

    it('#getValue should return faked value from a fakeService', () => {
      masterService = new MasterService(new FakeValueService());
      expect(masterService.getValue()).toBe('faked service value');
    });

    it('#getValue should return faked value from a fake object', () => {
      const fake = { getValue: () => 'fake value' };
      masterService = new MasterService(fake as ValueService);
      expect(masterService.getValue()).toBe('fake value');
    });

    it('#getValue should return stubbed value from a spy', () => {
      // create `getValue` spy on an object representing the ValueService
      const valueServiceSpy =
        jasmine.createSpyObj('ValueService', ['getValue']);

      // set the value to return when the `getValue` spy is called.
      const stubValue = 'stub value';
      valueServiceSpy.getValue.and.returnValue(stubValue);

      masterService = new MasterService(valueServiceSpy);

      expect(masterService.getValue())
        .toBe(stubValue, 'service returned stub value');
      expect(valueServiceSpy.getValue.calls.count())
        .toBe(1, 'spy method was called once');
      expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
        .toBe(stubValue);
    });
  });

  describe('MasterService (不使用 beforeEach)', () => {
    it('#getValue 应该从spy返回桩数据', () => {
      const { masterService, stubValue, valueServiceSpy } = setup();
      expect(masterService.getValue())
        .toBe(stubValue, '服务返回桩数组');
      expect(valueServiceSpy.getValue.calls.count())
        .toBe(1, 'spy方法调用了1次');
      expect(valueServiceSpy.getValue.calls.mostRecent().returnValue)
        .toBe(stubValue);
    });

    function setup() {
      const valueServiceSpy =
        jasmine.createSpyObj('ValueService', ['getValue']);
      const stubValue = 'stub value';
      const masterService = new MasterService(valueServiceSpy);

      valueServiceSpy.getValue.and.returnValue(stubValue);
      return { masterService, stubValue, valueServiceSpy };
    }
  });


  describe('ReversePipe', () => {
    let pipe: ReversePipe;

    beforeEach(() => { pipe = new ReversePipe(); });

    it('transforms "abc" to "cba"', () => {
      expect(pipe.transform('abc')).toBe('cba');
    });

    it('no change to palindrome: "able was I ere I saw elba"', () => {
      const palindrome = 'able was I ere I saw elba';
      expect(pipe.transform(palindrome)).toBe(palindrome);
    });

  });

  describe('LightswitchComp', () => {
    it('#clicked() 应该切换 #isOn', () => {
      const comp = new LightswitchComponent();
      expect(comp.isOn).toBe(false, '最初是off');
      comp.clicked();
      expect(comp.isOn).toBe(true, '点击后是on');
      comp.clicked();
      expect(comp.isOn).toBe(false, '第二次点击后是off')
    });

    it('#clicked() 应该设置 #message 为 "is on"', () => {
      const comp = new LightswitchComponent();
      expect(comp.message).toMatch(/is off/i, '最初是off');
      comp.clicked();
      expect(comp.message).toMatch(/is on/i, '点击后是on');
    });
  });

});


/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/