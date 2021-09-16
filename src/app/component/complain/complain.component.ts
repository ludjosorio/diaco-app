import { Component, OnInit } from '@angular/core';
import { IGender } from 'src/app/interface/interface';
import { ApiService } from 'src/app/services/api/api.service';
import { ToastService } from 'src/app/theme/shared/components/toast/toast.service';
import { FormArray, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-complain',
  templateUrl: './complain.component.html',
  styleUrls: ['./complain.component.scss']
})
export class ComplainComponent implements OnInit {

  public diacoBranches: Array<any> = [];
  public nationalities: Array<any> = [];
  public genders: Array<IGender> = [];
  public typeConsumers: Array<any> = [];
  public departments: Array<any> = [];
  public providerDepartments: Array<any> = [];
  public municipalities: Array<any> = [];
  public providerMunicipalities: Array<any> = [];
  public numberZones: Array<number> = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

  public anonymous: boolean = false;
  public loadDependencies: boolean = true;
  public toastMessage = '';

  public complaintForm = this.fb.group({
    consumer: this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', Validators.required],
      dpi: ['', Validators.required],
      homePhone: ['', Validators.required],
      phone: ['', Validators.required],
      nationalityId: ['', Validators.required],
      typeConsumerId: ['', Validators.required],
      genderId: ['', Validators.required],
      departmentId: ['', Validators.required],
      municipalityId: ['', Validators.required],
      address: ['', Validators.required],
    }),
    provider: this.fb.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      businessName: ['', Validators.required],
      nit: ['', Validators.required],
      address: ['', Validators.required],
      zoneNumber: ['', Validators.required],
      departmentId: ['', Validators.required],
      municipalityId: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
    }),
    invoiceNumber: ['', Validators.required],
    invoiceDate: ['', Validators.required],
    complaintDetail: ['', Validators.required],
    complaintRequest: ['', Validators.required],
    branchId: ['', Validators.required],
  });

  constructor(
    public toastEvent: ToastService,
    private api: ApiService,
    private fb: FormBuilder,
  ) {

  }

  ngOnInit() {
    this.getDependencyListings();
  }

  numberValue(value) {
    return Number(value);
  }

  setAnonymous() {
    this.anonymous = !this.anonymous;
    this.complaintForm.get('consumer').reset();

  }

  async getDependencyListings(): Promise<void> {
    try {
      const [typeConsumers, genders, nationalities, departments, diacoBranches] = await Promise.all([
        this.api.get('/consumer/type-consumer'),
        this.api.get('/consumer/gender'),
        this.api.get('/consumer/nacionality'),
        this.api.get('/department'),
        this.api.get('/department/diaco-branch'),
      ]);
      this.genders = genders.data;
      this.nationalities = nationalities.data;
      this.diacoBranches = diacoBranches.data;
      this.typeConsumers = typeConsumers.data;
      this.departments = departments.data;
      this.providerDepartments = departments.data;
      this.loadDependencies = false;
    } catch (error) {
      this.toastMessage = error.message || 'Ha ocurrido un error';
      this.toastEvent.toast({ uid: 'toast6', delay: 3000 });
      throw error;
    }
  }

  validateForm() {
    console.log(this.complaintForm.invalid);
  }

  async createComplaint() {
    this.validateForm();
    return;
    const data = this.complaintForm.getRawValue();
    await this.api.post('/complain', data);
  }

  selectConsumerDepartment($event) {
    try {
      const municipalities = this.refreshMunicipalities(this.departments, this.municipalities, $event);
      this.municipalities = municipalities;
    } catch (error) {

    }
  }

  selectProviderDepartment($event) {
    try {
      const municipalities = this.refreshMunicipalities(this.providerDepartments, this.providerMunicipalities, $event);
      this.providerMunicipalities = municipalities;
    } catch (error) {

    }
  }

  refreshMunicipalities(departments, municipalities, $event) {
    municipalities = [];
    const department = departments.find(d => d.id === Number($event.target.value));
    return department.municipality;
  }

  async searchConsumer() {
    try {
      const dpi = this.complaintForm.get('consumer').get('dpi').value;
      if (dpi) {
        this.complaintForm.get('consumer').reset();
        const consumer = await this.api.get('/consumer/' + dpi);
        this.complaintForm.controls.consumer.patchValue(consumer.data);
        const municipality = this.setDepartmentAndMunicipality('consumer', consumer.data.municipalityId);
        this.municipalities = municipality.municipalities;
        const homePhone = this.complaintForm.get('consumer').get('homePhone').value;
        const phone = this.complaintForm.get('consumer').get('phone').value;
        this.complaintForm.get('consumer').get('homePhone').setValue('0000' + homePhone)
        this.complaintForm.get('consumer').get('phone').setValue('0000' + phone)
      }
    } catch (error) {
      this.toastMessage = error.message;
      this.toastEvent.toast({ uid: 'toast6', delay: 3000 });
      console.log(error);
    }
  }

  async searchProvider() {
    try {
      const nit = this.complaintForm.get('provider').get('nit').value;
      if (nit) {
        this.complaintForm.get('provider').reset();
        const provider = await this.api.get('/provider/' + nit);
        this.complaintForm.controls.provider.patchValue(provider.data);
        const municipality = this.setDepartmentAndMunicipality('provider', provider.data.municipalityId);
        this.providerMunicipalities = municipality.municipalities;
      }
    } catch (error) {
      this.toastMessage = error.message;
      this.toastEvent.toast({ uid: 'toast6', delay: 3000 });
      console.log(error);
    }
  }


  setDepartmentAndMunicipality(type, municipalityId) {
    let data = { municipalities: [], municipality: null }
    this.departments.forEach(department => {
      department.municipality.find(municipality => {
        if (municipality.id === municipalityId) {
          data = { municipalities: department.municipality, municipality }
        }
      });
    });
    this.complaintForm.get(type).get('departmentId').setValue(data.municipality.departmentId)
    return data;
  }

}
