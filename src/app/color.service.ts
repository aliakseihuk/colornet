import { Injectable } from '@angular/core';
import { Http, Jsonp, Response } from '@angular/http';

import { Color } from './color';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ColorService {

  private colorsUrl = 'http://www.colourlovers.com/api/colors/top?format=json&jsonCallback=JSONP_CALLBACK';

  constructor(private jsonp: Jsonp) { }

  getColors(): Observable<Color[]> {
    console.log('res');
    return this.jsonp.get(this.colorsUrl).map(this.extractData).catch(this.handleError);
    // return Promise.resolve(COLORS);
  }

  private extractData(res: Response): Color[] {
    return res.json().map(o => new Color(`#${o.hex}`));
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
