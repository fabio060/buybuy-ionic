import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlaneamentoPage } from './planeamento.page';

describe('PlaneamentoPage', () => {
  let component: PlaneamentoPage;
  let fixture: ComponentFixture<PlaneamentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaneamentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
