import { Component, OnInit } from '@angular/core';

import { Color } from './color';
import { ColorService } from './color.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ColorService]
})
export class AppComponent implements OnInit {
  colors: Color[];
  errorMessage: string;

  constructor(private colorService: ColorService) { }

  ngOnInit(): void {
    this.colorService.getColors()
      .subscribe(
        colors => this.colors = colors,
        error => this.errorMessage = <any>error);
  }
}
