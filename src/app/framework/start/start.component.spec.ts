import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {StartComponent} from './start.component';

describe('StartComponent', () => {
    let component: StartComponent;
    let fixture: ComponentFixture<StartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [StartComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StartComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the start page on route \'/\'', () => {
        expect(component).toBeTruthy();
    });

    it(`should have as title 'test environment for the Knora gui modules'`, async(() => {
        expect(component.title).toEqual('test environment for the Knora gui modules');
    }));
    it('should render title in a h1 tag', async(() => {
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector('h1').textContent).toContain('test environment for the Knora gui modules');
    }));
});
