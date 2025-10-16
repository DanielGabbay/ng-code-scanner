import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgCodeScanner } from './ng-code-scanner';

describe('NgCodeScanner', () => {
  let component: NgCodeScanner;
  let fixture: ComponentFixture<NgCodeScanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgCodeScanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgCodeScanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
