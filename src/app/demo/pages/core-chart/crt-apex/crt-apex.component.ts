import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ComplaintService } from 'src/app/services/complaint/complaint.service';
import { ChartDB } from './chart/chart-data';

@Component({
  selector: 'app-crt-apex',
  templateUrl: './crt-apex.component.html',
  styleUrls: ['./crt-apex.component.scss']
})
export class CrtApexComponent implements OnInit {
  public data = {
    years: ChartDB.line1CAC, months: ChartDB.line1CAC,
    providers: ChartDB.line1CAC, consumers: ChartDB.line1CAC,
    departments: ChartDB.line1CAC, regions: ChartDB.pie1CAC, statuses: ChartDB.pie1CAC
  };

  constructor(
    private api: ApiService,
    private complaintService: ComplaintService
  ) {
    this.data = complaintService.data;
  }

  async ngOnInit() {
    try {
      this.data = this.complaintService.data;
    } catch (error) {
      console.log(error);
    }
  }


}
