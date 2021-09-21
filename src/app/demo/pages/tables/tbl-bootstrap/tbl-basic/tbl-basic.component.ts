import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-tbl-basic',
  templateUrl: './tbl-basic.component.html',
  styleUrls: ['./tbl-basic.component.scss']
})
export class TblBasicComponent implements OnInit {

  public data = [];
  public temp = [];
  public stringSearch = '';
  public statusId = null;
  public complaint = Object({});
  public statuses = [];

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.getData();
  }

  async getData() {
    try {
      const { data } = await this.api.get('/complain');
      const statuses = await this.api.get('/complain/status');
      this.data = data;
      this.temp = data;
      this.statuses = statuses.data;
    } catch (error) {

    }
  }

  updateFilter() {
    if (!!this.stringSearch) {
      const val = String(this.stringSearch).toLowerCase();
      const temp = this.temp.filter(function (d) {
        return String(d.id).toLowerCase().indexOf(val) !== -1 || !val || String(d.provider.name).toLowerCase().indexOf(val) !== -1;
      });
      this.data = temp;
    } else {
      this.data = this.temp;
    }
  }

  editComplaint(i) {
    this.complaint = this.data[i];
  }

  closeModal() {
    this.complaint = Object({});
  }

  async updateComplaint() {
    try {
      const user = JSON.parse(localStorage.auth);
      await this.api.patch('/complain', { id: this.complaint.id, statusId: Number(this.statusId), userId: user.id });
      this.closeModal();
      this.getData();
    } catch (error) {
      console.log(error);
    }
  }

  getColor() {
    if (this.complaint.status?.name === 'CREADA') {
      return `background-color: red`;
    } if (this.complaint.status?.name === 'EN TRÁMITE') {
      return `background-color: gray`;
    } else {
      return `background-color: green`;
    }
  }

}
