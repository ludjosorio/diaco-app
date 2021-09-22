import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyComplaintComponent } from './verify-complaint.component';

describe('VerifyComplaintComponent', () => {
  let component: VerifyComplaintComponent;
  let fixture: ComponentFixture<VerifyComplaintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyComplaintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
