import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-verify-complaint',
  templateUrl: './verify-complaint.component.html',
  styleUrls: ['./verify-complaint.component.scss']
})
export class VerifyComplaintComponent implements OnInit {

  public message: string = '';
  public stringSearch: string = '';
  public hasError: boolean = false;

  constructor(private api: ApiService) { }

  ngOnInit(): void {
  }

  async searchComplaint() {
    try {
      this.hasError = false;
      if (this.stringSearch) {
        const response = await this.api.get('/complain/' + this.stringSearch);
        this.message = response.message;
      } else {
        alert('Ingresa un número de queja para verificar')
      }
    } catch (error) {
      this.hasError = true;
      console.log(error);
      this.message = error.message || 'Ha ocurrido un error para validar tu queja, intenta nuevamente';
    }
  }

}
