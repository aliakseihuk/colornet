import { Injectable } from '@angular/core';
import { Http, Jsonp, Response } from '@angular/http';

import { Color, ColorData } from './color';
import { COLORS } from './colors';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/concat';

@Injectable()
export class ColorService {

  private colorsUrl = 'http://www.colourlovers.com/api/colors/top?format=json&numResults=50&orderCol=numVotes&sortBy=DESC&jsonCallback=JSONP_CALLBACK';

  constructor(private jsonp: Jsonp) { }

  getColors(): Observable<ColorData[]> {
    const requestCount: number = 1;
    let requests: Observable<Response>[] = [];
    for (let i = 0; i < requestCount; ++i) {
      requests.push(this.jsonp.get(this.colorsUrl + `&resultOffset=${i}00`));
    }
    return requests
      .reduce((p, c) => p.concat(c))
      .map(this.extractData)
      .catch(this.handleError);

    // let observable = Observable.create(function (observer) {
    //     observer.next(COLORS.map(o => new ColorData(
    //     new Color(`#${o.hex}`, { r: o.rgb.red, g: o.rgb.green, b: o.rgb.blue }),
    //     o.numVotes, 0, 0)));
    // });
    // return <Observable<ColorData[]>>observable;
  }

  private extractData(res: Response): ColorData[] {
    return res.json()
      .map(o => new ColorData(
        new Color(`#${o.hex}`, { r: o.rgb.red, g: o.rgb.green, b: o.rgb.blue }),
        o.numVotes, 0, 0)
      );
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
}
