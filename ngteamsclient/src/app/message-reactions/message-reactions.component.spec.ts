import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageReactionsComponent } from './message-reactions.component';

describe('MessageReactionsComponent', () => {
  let component: MessageReactionsComponent;
  let fixture: ComponentFixture<MessageReactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageReactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageReactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
