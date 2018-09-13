import {AdminImageDirective} from './admin-image.directive';
import {Component, DebugElement} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';


@Component({
    template: `<img kuiAdminImage [image]="'http://dasch.swiss/content/images/2017/11/DaSCH_Logo_RGB.png'" [type]="'project'"/>`
})
class TestAdminImageComponent {

}


describe('Directive: AdminImageDirective', () => {
    let component: TestAdminImageComponent;
    let fixture: ComponentFixture<TestAdminImageComponent>;
    let imageEl: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                AdminImageDirective,
                TestAdminImageComponent
            ]
        });

        fixture = TestBed.createComponent(TestAdminImageComponent);
        component = fixture.componentInstance;
        imageEl = fixture.debugElement.query(By.css('img'));

    });

    /*    it('should create an instance', () => {
            // const directive = new AdminImageDirective();
            // expect(directive).toBeTruthy();
        });*/
});


