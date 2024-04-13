import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-bottom-navigation',
  templateUrl: './bottom-navigation.component.html',
  styleUrls: ['./bottom-navigation.component.scss']
})
export class BottomNavigationComponent {
  @Input() activeSection: number = 0;
  @Output() sectionChange = new EventEmitter<number>();

  constructor() { }

  setActiveSection(section: number) {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }
}
