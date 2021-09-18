import { Component, OnInit } from '@angular/core';
import { IGender } from 'src/app/interface/interface';
import { ApiService } from 'src/app/services/api/api.service';
import { ToastService } from 'src/app/theme/shared/components/toast/toast.service';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-complain',
  templateUrl: './complain.component.html',
  styleUrls: ['./complain.component.scss']
})
export class ComplainComponent implements OnInit {

  public nationalities: Array<any> = [];
  public genders: Array<IGender> = [];
  public typeConsumers: Array<any> = [];
  public departments: Array<any> = [];
  public complaintDepartments: Array<any> = [];
  public municipalities: Array<any> = [];
  public complaintMunicipalities: Array<any> = [];
  public numberZones: Array<number> = [1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26];

  public anonymous: boolean = false;
  public loadDependencies: boolean = true;
  public toastMessage = '';

  public complaintForm = this.fb.group({
    consumer: this.fb.group({
      id: [],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dpi: ['', [Validators.required, Validators.pattern(/^[0-9]{8,13}$/)]],
      homePhone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,8}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,8}$/)]],
      nationalityId: ['', Validators.required],
      typeConsumerId: ['', Validators.required],
      genderId: ['', Validators.required],
      departmentId: ['', Validators.required],
      municipalityId: ['', Validators.required],
      address: ['', [Validators.required]],
    }),
    provider: this.fb.group({
      id: [],
      name: ['', Validators.required],
      businessName: ['', Validators.required],
      nit: ['', [Validators.required, Validators.pattern(/^[0-9]{8,8}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{8,8}$/)]],
      email: ['', [Validators.required, Validators.email]],
    }),
    invoiceNumber: ['', Validators.required],
    invoiceDate: ['', Validators.required],
    complaintDetail: ['', [Validators.required, Validators.minLength(25), Validators.maxLength(250)]],
    complaintRequest: ['', [Validators.required, Validators.minLength(25), Validators.maxLength(250)]],
    address: ['', Validators.required],
    departmentId: ['', Validators.required],
    municipalityId: ['', Validators.required],
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
    this.complaintForm.controls.consumer.enable();
  }

  async getDependencyListings(): Promise<void> {
    try {
      this.complaintForm.disable();
      const [typeConsumers, genders, nationalities, departments] = await Promise.all([
        this.api.get('/consumer/type-consumer'),
        this.api.get('/consumer/gender'),
        this.api.get('/consumer/nacionality'),
        this.api.get('/department'),
      ]);
      this.genders = genders.data;
      this.nationalities = nationalities.data;
      this.typeConsumers = typeConsumers.data;
      this.departments = departments.data;
      this.complaintDepartments = departments.data;
      this.loadDependencies = false;
      this.complaintForm.enable();
    } catch (error) {
      this.toastMessage = error.message || 'Ha ocurrido un error';
      this.toastEvent.toast({ uid: 'toast6', delay: 3000 });
      throw error;
    }
  }

  async createComplaint() {
    try {
      this.findInvalidControls();
      const data = this.complaintForm.getRawValue();
      if (this.anonymous) {
        data.consumer = Object({});
        data.anonymous = true;
        this.complaintForm.controls.consumer.disable();
      } else {
        data.anonymous = false;
        this.complaintForm.controls.consumer.enable();
      }
      // this.findInvalidControls();
      await this.api.post('/complain', data);
    } catch (error) {
      this.toastMessage = error.message || 'Ha ocurrido un error';
      this.toastEvent.toast({ uid: 'toast6', delay: 3000 });
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.complaintForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    console.log('asdfa', invalid);
    return invalid;
  }

  selectConsumerDepartment($event) {
    try {
      const municipalities = this.refreshMunicipalities(this.departments, this.municipalities, $event);
      this.municipalities = municipalities;
    } catch (error) {

    }
  }

  selectComplaintDepartament($event) {
    try {
      const municipalities = this.refreshMunicipalities(this.complaintDepartments, this.complaintMunicipalities, $event);
      this.complaintMunicipalities = municipalities;
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
      var formValues = this.complaintForm.get('consumer').value;
      console.log('formValues', formValues);

      if (formValues.dpi) {
        this.complaintForm.get('consumer').reset();
        const consumer = await this.api.get('/consumer/' + formValues.dpi);
        this.complaintForm.controls.consumer.patchValue(consumer.data);
        const municipality = this.setDepartmentAndMunicipality('consumer', consumer.data.municipalityId);
        this.municipalities = municipality.municipalities;
        const homePhone = this.complaintForm.get('consumer').get('homePhone').value;
        const phone = this.complaintForm.get('consumer').get('phone').value;
        this.complaintForm.get('consumer').get('homePhone').setValue('0000' + homePhone)
        this.complaintForm.get('consumer').get('phone').setValue('0000' + phone)
        this.complaintForm.controls.consumer.disable();
        this.complaintForm.controls.consumer.get('dpi').enable()
      }
    } catch (error) {
      this.complaintForm.get('consumer').patchValue(formValues);
      this.complaintForm.controls.consumer.enable();
      this.toastMessage = error.message;
      this.toastEvent.toast({ uid: 'toast6', delay: 3000 });
      console.log(error);
    }
  }

  async searchProvider() {
    try {
      var nit = this.complaintForm.get('provider').get('nit').value;
      if (nit) {
        this.complaintForm.get('provider').reset();
        const provider = await this.api.get('/provider/' + nit);
        this.complaintForm.controls.provider.patchValue(provider.data);
        this.complaintForm.controls.provider.disable();
        this.complaintForm.controls.provider.get('nit').enable()
      }
    } catch (error) {
      this.complaintForm.get('provider').get('nit').setValue(nit);
      this.complaintForm.controls.provider.enable();
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
