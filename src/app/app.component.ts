import { Component, OnInit } from '@angular/core';

import { Color } from './color';
import { ColorService } from './color.service';
import * as Synaptic from "synaptic";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [ColorService]
})
export class AppComponent {
  constructor() { }
}
