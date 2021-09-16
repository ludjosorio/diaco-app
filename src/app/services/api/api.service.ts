import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export const API_SERVER = `${environment.apiServer.protocol}://${environment.apiServer.ip}:${environment.apiServer.port}`;
const API_URL = API_SERVER;


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private header: { [k: string]: string } = {};
  constructor(
    private http: HttpClient,
  ) { }

  public async post(route: string, body: any, option?: HttpOptions) {
    return await this.request('post', route, body, option || {});
  }

  public async put(route: string, body: any, option?: HttpOptions) {
    return await this.request('put', route, body, option || {});
  }

  public async patch(route: string, body: any, option?: HttpOptions) {
    return await this.request('patch', route, body, option || {});
  }

  public async copy(route: string, option?: HttpOptions) {
    return await this.request('copy', route, null, option || {});
  }

  public async get(route: string, option?: HttpOptions) {
    return await this.request('get', route, null, option || {});
  }

  public async delete(route: string, body: any, option?: HttpOptions) {
    return await this.request('delete', route, body, option || {});
  }

  public registerHeader(key: string, value: string) {
    if (value === undefined) {
      delete this.header[key];
    } else {
      this.header[key] = value;
    }
  }

  private async request(verb: 'post' | 'patch' | 'get' | 'put' | 'delete' | 'copy', route: string, body: any, option: HttpOptions) {
    option.headers = Object.assign({}, option.headers || {}, this.header);
    option.body = body;
    try {
      const promise = new Promise((resolve, reject) => {
        const subs = this.http.request(verb, API_URL + route, option);
        subs.subscribe(resolve, reject);
      });
      const result: any = await promise;

      if (result && result.message) {
      }
      return result;
    } catch (error) {
      let stringError = '';
      if (error) {
        if (error.error && error.error.message) {
          stringError = `${error.error.message}`;
        }
        else if (error.status === 0) {
          stringError = `${error.statusText}`;
        }
        else if (error.message) {
          stringError = `${error.message}`;
        }
        else if (error.statusText) {
          stringError = `${error.statusText}`;
        }
        else {
          stringError = `Don't possible to process the error information: ${JSON.stringify(error)}`;
        }
      } else {
        stringError = `Don't possible to process the error information`;
      }

      throw stringError;
    }
  }

}

interface HttpOptions {
  body?: any;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
  params?: HttpParams | {
    [param: string]: string | string[];
  };
}
