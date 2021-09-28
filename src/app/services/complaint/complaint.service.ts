import { Injectable, OnInit } from '@angular/core';
import { ChartDB } from 'src/app/demo/pages/core-chart/crt-apex/chart/chart-data';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService implements OnInit {

  public data = Object({});

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.getDataCharts()
  }

  async getDataCharts() {
    try {
      console.log('getDataCharts');
      const { data } = await this.api.get('/complain/report-charts');
      this.data = data;
    } catch (error) {
      console.log(error);
    }
  }


}
