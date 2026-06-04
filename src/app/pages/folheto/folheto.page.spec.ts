import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FolhetoPage } from './folheto.page';

describe('FolhetoPage', () => {
  let component: FolhetoPage;
  let fixture: ComponentFixture<FolhetoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FolhetoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
