import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferUserComponent } from './transfer-user.component';

describe('TransferUserComponent', () => {
  let component: TransferUserComponent;
  let fixture: ComponentFixture<TransferUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransferUserComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
