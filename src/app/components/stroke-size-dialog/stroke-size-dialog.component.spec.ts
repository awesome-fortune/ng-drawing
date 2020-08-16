import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrokeSizeDialogComponent } from './stroke-size-dialog.component';

describe('StrokeSizeDialogComponent', () => {
  let component: StrokeSizeDialogComponent;
  let fixture: ComponentFixture<StrokeSizeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StrokeSizeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrokeSizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
