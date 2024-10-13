import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFeedContainerComponent } from './new-feed-container.component';

describe('NewFeedContainerComponent', () => {
  let component: NewFeedContainerComponent;
  let fixture: ComponentFixture<NewFeedContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewFeedContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewFeedContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
