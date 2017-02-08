import { Component, OnInit } from '@angular/core';

import { Color } from './../color';
import { ColorService } from './../color.service';
import * as Synaptic from "synaptic";

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {
  private colors: Color[] = [];
  private maxVotes: number;
  private errorMessage: string;
  private biggestError: number = 0;

  constructor(private colorService: ColorService) { }

  ngOnInit(): void {
    this.colorService.getColors()
      .subscribe(
      colors => this.colors = this.colors.concat(colors).sort((a, b) => b.likes - a.likes),
      error => this.errorMessage = <any>error);
  }

  train(): void {
    var perceptron = new Synaptic.Architect.Perceptron(3, 10, 10, 1);
    let trainer = new Synaptic.Trainer(perceptron);
    let maxLikes = Math.max(...this.colors.map(c => c.likes))
    let set = this.colors.map(c => { return { input: [c.rgb.red / 255, c.rgb.green / 255, c.rgb.blue / 255], output: [c.likes / maxLikes] } });
    console.log(set);
    let options = {
      rate: .05,
      iterations: 50000,
      error: .005,
      shuffle: true,
      log: 10000,
      cost: Synaptic.Trainer.cost.CROSS_ENTROPY
    }
    let result = trainer.train(set, options);
    console.log(result);

    // console.log(perceptron.activate([0,0,0])[0]);
    this.colors.forEach(element => {
      element.real = element.likes / maxLikes;
      element.result = perceptron.activate([element.rgb.red / 255, element.rgb.green / 255, element.rgb.blue / 255])[0];
      element.error = Math.abs(element.result - element.real);
    });

    var exported = perceptron.toJSON();

    var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exported));

    //Write it as the href for the link
    var link = document.getElementById('link').setAttribute('href', dataUri);

    this.biggestError = Math.max(...this.colors.map(c => c.error));
  }
}
