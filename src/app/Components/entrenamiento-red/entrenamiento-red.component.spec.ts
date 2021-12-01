import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenamientoRedComponent } from './entrenamiento-red.component';

describe('EntrenamientoRedComponent', () => {
  let component: EntrenamientoRedComponent;
  let fixture: ComponentFixture<EntrenamientoRedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntrenamientoRedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntrenamientoRedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
