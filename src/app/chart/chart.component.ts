import { Component, OnInit, OnChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import * as d3 from "d3";

import { ChartData, ChartColorData } from './chart-data';
import { Color } from '../color';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit, OnChanges {
  
  @Input() chartData: ChartData;
  private chart: d3.Selection<d3.BaseType, {}, HTMLElement, any>;
  private x;
  private y;
  private plotWidth: number;
  private plotHeight: number;
  constructor() { }

  ngOnInit() {
    let svg = d3.select("svg");
    let
      width = +svg.attr("width"),
      height = +svg.attr("height");

    let margin = 10;
    this.plotWidth = width - margin * 2;
    this.plotHeight = height - margin * 2;
    this.chart = svg.append('g').attr('transform', `translate(${margin}, ${margin})`);
    this.x = d3.scaleLinear().domain([0, 255]).range([0, this.plotWidth]);

    // let xaxis = d3a.axisBottom(this.x)
    // this.chart.append('g')
    //   .attr('class','x axis')
    //   .attr('transform',`translate(${0},${this.plotHeight})`)
    //   .call(xaxis);
    
    this.y = d3.scaleLinear().domain([0, 255]).range([this.plotHeight, 0]);

    // let yaxis = d3a.axisLeft(this.y)
    // this.chart.append('g')
    //   .attr('class','y axis')
    //   .call(yaxis)

    this.chart.append('g')
      .classed('data', true);
    this.chart.append('text')
      .classed('label', true)
      .attr('transform', 'translate(15,15)');
  }

  ngOnChanges() {
    if(this.chart && this.chartData) {
      const elementSize = {
        height: this.plotHeight / Math.sqrt(this.chartData.data.length),
        width: this.plotWidth / Math.sqrt(this.chartData.data.length)
      };

      let b = this.chartData.data[0].color.b;

      let elements = this.chart
        .select('.data')
        .selectAll('rect')
        .data(this.chartData.data, (d: ChartColorData) => `${d.color.r}${d.color.g}`);

      elements.enter()
        .append('rect')
        .attr('x', d => this.x(d.color.r))
        .attr('y', d => this.y(d.color.g)-elementSize.height)
        .attr('height', elementSize.height)
        .attr('width', elementSize.width)
        .attr('stroke-width', 1)
        .merge(elements)
        .attr('fill', d => this.translateToColor(d.level).hex)
        .attr('stroke', d => this.translateToColor(d.level).hex);

      elements.exit().remove();
      
      this.chart
        .select('.label')
        .text('blue: ' + b);
    }
  }

  private translateToColor(level: number) {

    let a=(1 - level)/0.25;	//invert and group
    var X = Math.floor(a);	//this is the integer part
    var Y = Math.floor(255*(a-X)); //fractional part from 0 to 255
    let r, g, b;
    switch(X)
    {
        case 0: r=255;g=Y;b=0;break;
        case 1: r=255-Y;g=255;b=0;break;
        case 2: r=0;g=255;b=Y;break;
        case 3: r=0;g=255-Y;b=255;break;
        case 4: r=0;g=0;b=255;break;
    }
    return Color.fromRgb(r, g, b);
    // return Color.fromRgb(Math.round(level * 255), 0, Math.round((1.0 - level) * 255));
  }
}
