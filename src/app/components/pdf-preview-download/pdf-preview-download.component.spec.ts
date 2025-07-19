import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfPreviewDownloadComponent } from './pdf-preview-download.component';

describe('PdfPreviewDownloadComponent', () => {
  let component: PdfPreviewDownloadComponent;
  let fixture: ComponentFixture<PdfPreviewDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PdfPreviewDownloadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfPreviewDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
